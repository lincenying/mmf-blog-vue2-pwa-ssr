const process = require('node:process')

const { LRUCache } = require('lru-cache')

let api
const cached = false

if (process.__API__) {
    api = process.__API__
}
else {
    api = process.__API__ = {
        api: 'http://localhost:4000/api/',
        timeout: 30000,
        cached:
            cached
            && new LRUCache({
                max: 1000,
                maxAge: 1000 * 60 * 15,
            }),
        cachedItem: {},
    }
}

module.exports = api
