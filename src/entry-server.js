import process from 'node:process'

import { createApp } from './main'
import { api } from '~api'

export default (context) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        // const nowTime = Date.now()
        const { app, router, store } = await createApp()

        const url = context.url
        const fullPath = router.resolve(url).route.fullPath

        if (fullPath !== url)
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ url: fullPath })

        if (url !== '/backend/' && url.includes('/backend/')) {
            if (!context.req.cookies.b_user) {
                context.req.res.redirect('/backend')
                return
            }
        }
        if (url !== '/user/' && url.includes('/user/')) {
            if (!context.req.cookies.b_user) {
                context.req.res.redirect('/')
                return
            }
        }

        router.push(url)

        // wait until router has resolved possible async hooks
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()

            // no matched routes
            if (!matchedComponents.length)
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ code: 404 })

            store.$api = store.state.$api = api(context.req.cookies)
            store.commit('global/setCookies', context.req.cookies)
            // Call fetchData hooks on components matched by the route.
            // A preFetch hook dispatches a store action and returns a Promise,
            // which is resolved when the action is complete and store state has been
            // updated.
            Promise.all(
                matchedComponents.map(
                    ({ asyncData }) =>
                        asyncData
                        && asyncData({
                            store,
                            route: router.currentRoute,
                            cookies: context.req.cookies,
                            isServer: true,
                            isClient: false,
                        }),
                ),
            )
                .then(() => {
                    // console.log(`data pre-fetch: ${Date.now() - nowTime}ms`)

                    // After all preFetch hooks are resolved, our store is now
                    // filled with the state needed to render the app.
                    // Expose the state on the render context, and let the request handler
                    // inline the state in the HTML response. This allows the client-side
                    // store to pick-up the server-side state without having to duplicate
                    // the initial data fetching on the client.
                    context.state = store.state
                    context.isProd = process.env.NODE_ENV === 'production'
                    context.meta = app.$meta()
                    resolve(app)
                })
                .catch(reject)
        }, reject)
    })
}
