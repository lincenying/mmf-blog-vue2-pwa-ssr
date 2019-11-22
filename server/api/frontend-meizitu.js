const rp = require('request-promise')

exports.lists = async (req, res) => {
    const key = req.query.key || ''
    const options = {
        method: 'GET',
        uri: 'https://handmaid.cn/loadPic?searchKey=' + key,
        headers: {
            Referer: 'referer: https://handmaid.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie: 'ID=FuZJbMubyKLTvyNpqg9Zxg; key=6233476',
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
        const options = {
            method: 'GET',
            uri: 'https://handmaid.cn/album/' + id,
            headers: {
                Referer: 'referer: https://handmaid.cn/',
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                cookie: 'ID=FuZJbMubyKLTvyNpqg9Zxg; key=6233476',
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
