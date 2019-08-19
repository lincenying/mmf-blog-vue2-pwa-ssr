const path = require('path')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new SWPrecachePlugin({
                cacheId: 'mmf-blog-vue2-pwa-ssr',
                filename: 'service-worker.js',
                minify: true,
                dontCacheBustUrlsMatching: /./,
                staticFileGlobsIgnorePatterns: [/\.html/, /\.map$/, /\.json$/],
                runtimeCaching: [
                    {
                        urlPattern: /api/,
                        handler: 'networkFirst',
                        options: {
                            networkTimeoutSeconds: 1,
                            cacheName: 'api-cache',
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
                        handler: 'networkFirst',
                        options: {
                            networkTimeoutSeconds: 1,
                            cacheName: 'cdn-cache',
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            })
        ]
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
        config.module.rule('eslint').uses.clear()
        config.module.rule('eslint').clear()
        if (process.env.VUE_CLI_SSR_TARGET === 'client') {
            config.resolve.alias.set('~api', path.resolve('src/api/index-client.js'))
        } else {
            config.resolve.alias.set('~api', path.resolve('src/api/index-server.js'))
        }
    },
    css: {
        loaderOptions: {}
    },
    pluginOptions: {
        ssr: {
            // Listening port for `serve` command
            port: 8080,
            // Listening host for `serve` command
            host: null,
            // Entry for each target
            entry: target => `./src/entry-${target}`,
            // Default title
            defaultTitle: 'M.M.F 小屋',
            // Path to favicon
            // favicon: './static/img/icons/favicon.ico',
            // Skip some requests from being server-side rendered
            skipRequests: req => {
                return req.originalUrl.indexOf('/css/') > -1 || req.originalUrl.indexOf('/js/') > -1
            },
            // See https://ssr.vuejs.org/guide/build-config.html#externals-caveats
            nodeExternalsWhitelist: [/\.css$/, /\?vue&type=style/],
            // Function to connect custom middlewares
            extendServer: app => {
                const logger = require('morgan')
                app.use(
                    logger('[:remote-addr] ":method :url" :status :res[content-length] ":referrer" ":user-agent" ":date[web]"', {
                        skip(req) {
                            return req.url.indexOf('.map') !== -1
                        }
                    })
                )
                const bodyParser = require('body-parser')
                app.use(bodyParser.json())
                app.use(bodyParser.urlencoded({ extended: false }))
                const cookieParser = require('cookie-parser')
                app.use(cookieParser())

                app.set('views', path.join(__dirname, 'dist'))
                app.engine('.html', require('ejs').__express)
                app.set('view engine', 'ejs')

                // 引入 mongoose 相关模型
                require('./server/models/admin')
                require('./server/models/article')
                require('./server/models/category')
                require('./server/models/comment')
                require('./server/models/user')
                require('./server/models/shihua')
                // 引入 api 路由
                const routes = require('./server/routes/index')
                app.use('/api', routes)
            },
            // Paths
            distPath: path.resolve(__dirname, './dist'),
            error500Html: null,
            templatePath: path.resolve(__dirname, './dist/index.html'),
            serviceWorkerPath: path.resolve(__dirname, './dist/service-worker.js'),
            // Directives fallback
            directives: {
                // See 'Directive' chapter
            }
        }
    },
    pwa: {
        name: 'M.M.F小屋',
        themeColor: '#54d9e0',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        manifestPath: 'static/manifest.json',
        iconPaths: {
            favicon32: 'static/img/icons/favicon-32x32.png',
            favicon16: 'static/img/icons/favicon-16x16.png',
            appleTouchIcon: 'static/img/icons/apple-touch-icon-152x152.png',
            maskIcon: 'static/img/icons/safari-pinned-tab.svg',
            msTileImage: 'static/img/icons/msapplication-icon-144x144.png'
        }
    }
}
