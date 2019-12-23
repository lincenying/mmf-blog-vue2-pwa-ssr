const rp = require('request-promise')
const lruCache = require('../utils/lru-cache').meizituCache

const getCookies = async () => {
    const options = {
        method: 'GET',
        uri: 'https://handmaid.cn/',
        headers: {
            Referer: 'https://handmaid.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            'upgrade-insecure-requests': 1
        },
        resolveWithFullResponse: true
    }
    const xhr = await rp(options)
    const $return = []
    if (xhr.headers && xhr.headers['set-cookie'] && Array.isArray(xhr.headers['set-cookie'])) {
        xhr.headers['set-cookie'].forEach(item => {
            $return.push(item.split(';')[0])
        })
        if ($return.length > 0) {
            const cookies = $return.join(';')
            lruCache.set('cookies', cookies)
            return cookies
        }
    }
    return 'ID=g7L6f_-ON6GzSX0YXn2YxQ'
}

exports.lists = async (req, res) => {
    const key = req.query.key || ''
    let cookies = lruCache.get('cookies')
    if (!cookies) {
        cookies = await getCookies()
    }
    const options = {
        method: 'GET',
        uri: 'https://handmaid.cn/loadPic?searchKey=' + key,
        headers: {
            Referer: 'https://handmaid.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie: cookies,
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const body = await rp(options)
        res.json({
            code: 200,
            data: body
        })
    } catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

exports.item = async (req, res) => {
    const id = req.query.id
    if (!id) {
        res.json({ code: 300, ok: 2, msg: '相册ID为空' })
    } else {
        let cookies = lruCache.get('cookies')
        if (!cookies) {
            cookies = await getCookies()
        }
        const options = {
            method: 'GET',
            uri: 'https://handmaid.cn/album/' + id,
            headers: {
                Referer: 'https://handmaid.cn/',
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                cookie: cookies,
                'upgrade-insecure-requests': 1
            }
        }
        try {
            const body = await rp(options)
            const preg = /JSON.parse\(`(.*?)`\)/
            const match = body.match(preg)
            if (match && match[1]) {
                res.json({
                    code: 200,
                    data: JSON.parse(match[1])
                })
            } else {
                res.json({ code: 300, ok: 2, msg: '读取图片失败' })
            }
        } catch (error) {
            res.json({ code: 300, ok: 2, msg: error.toString() })
        }
    }
}
