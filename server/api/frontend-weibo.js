const rp = require('request-promise')

exports.get = async (req, res) => {
    const page = req.query.page || 0
    const options = {
        method: 'GET',
        uri: 'https://m.weibo.cn/api/container/getIndex?containerid=102803_ctg1_4388_-_ctg1_4388&openApp=0&since_id=' + page,
        headers: {
            Referer: 'referer: https://m.weibo.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie:
                'SCF=Aip1F5fqYgfG7nzFqjK3Umxcyp0ztYFLhFYqAAQMvjFPG0UhUj0fJHdp0A7j7wfLwTXfaHg_dOII1ioFQajhYGE.; SUHB=0qjkPHiLu6EcDR; WEIBOCN_FROM=1110003030; SSOLoginState=1546322762; MLOGIN=0; _T_WM=7a00598bc69860f7c6aa9c5beabe7f23; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803_ctg1_4388_-_ctg1_4388%26fid%3D102803_ctg1_4388_-_ctg1_4388%26uicode%3D10000011',
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const body = await rp(options)
        res.json({
            ...body,
            data: body.data.cards.map(item => {
                let video = ''
                let video_img = ''
                if (item.mblog.page_info && item.mblog.page_info.media_info) {
                    video =
                        item.mblog.page_info.media_info.mp4_720p_mp4 ||
                        item.mblog.page_info.media_info.mp4_hd_url ||
                        item.mblog.page_info.media_info.mp4_sd_url ||
                        item.mblog.page_info.media_info.stream_url
                    video_img = item.mblog.page_info.page_pic.url
                }
                return {
                    itemid: item.itemid,
                    pics: item.mblog.pics,
                    text: item.mblog.text.replace(/"\/\//g, '"https://'),
                    video,
                    video_img
                }
            })
        })
    } catch (error) {
        res.json({ ok: 2, msg: error.toString() })
    }
}

exports.card = async (req, res) => {
    const card_id = req.query.card_id
    const block_id = req.query.block_id
    const page = req.query.page || 1
    if (!card_id || !block_id) {
        res.json({ ok: 2, msg: '参数错误' })
        return
    }
    const options = {
        method: 'GET',
        uri: `https://m.weibo.cn/api/novelty/feed/getblock?card_id=${card_id}&block_id=${block_id}&page=${page}`,
        headers: {
            Referer: 'referer: https://m.weibo.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie:
                'SCF=Aip1F5fqYgfG7nzFqjK3Umxcyp0ztYFLhFYqAAQMvjFPG0UhUj0fJHdp0A7j7wfLwTXfaHg_dOII1ioFQajhYGE.; SUHB=0qjkPHiLu6EcDR; WEIBOCN_FROM=1110003030; SSOLoginState=1546322762; MLOGIN=0; _T_WM=7a00598bc69860f7c6aa9c5beabe7f23; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803_ctg1_4388_-_ctg1_4388%26fid%3D102803_ctg1_4388_-_ctg1_4388%26uicode%3D10000011',
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const body = await rp(options)
        res.json({
            ...body,
            data: {
                ...body.data,
                content: body.data.content.map(item => {
                    let video = ''
                    let video_img = ''
                    if (item.data.page_info && item.data.page_info.urls) {
                        video = item.data.page_info.urls
                        video_img = item.data.page_info.page_pic.url
                    } else if (item.data.page_info && item.data.page_info.media_info) {
                        video = item.data.page_info.media_info
                        video_img = item.data.page_info.page_pic.url
                    }
                    return {
                        id: item.mid,
                        pics: item.data.pics,
                        text: item.data.text.replace(/"\/\//g, '"https://'),
                        video,
                        video_img
                    }
                })
            }
        })
    } catch (error) {
        res.json({ ok: 2, msg: error.toString() })
    }
}

// https://m.weibo.cn/api/container/getIndex?containerid=100808f334edf14a66a4e3aa1a31dade762d19_-_main&extparam=%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&luicode=10000011&lfid=100103type%3D1%26q%3D%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91
// https://m.weibo.cn/api/container/getIndex?containerid=100808f334edf14a66a4e3aa1a31dade762d19_-_feed&extparam=%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&luicode=10000011&lfid=100103type%3D1%26q%3D%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&since_id=4357347671259573

exports.video = async (req, res) => {
    const since_id = req.query.since_id || ''
    const options = {
        method: 'GET',
        uri: `https://m.weibo.cn/api/container/getIndex?containerid=100808f334edf14a66a4e3aa1a31dade762d19_-_feed&extparam=%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&luicode=10000011&lfid=100103type%3D1%26q%3D%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&since_id=${since_id}`,
        headers: {
            Referer: 'referer: https://m.weibo.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie:
                'SCF=Aip1F5fqYgfG7nzFqjK3Umxcyp0ztYFLhFYqAAQMvjFPG0UhUj0fJHdp0A7j7wfLwTXfaHg_dOII1ioFQajhYGE.; SUHB=0qjkPHiLu6EcDR; WEIBOCN_FROM=1110003030; SSOLoginState=1546322762; MLOGIN=0; _T_WM=7a00598bc69860f7c6aa9c5beabe7f23; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803_ctg1_4388_-_ctg1_4388%26fid%3D102803_ctg1_4388_-_ctg1_4388%26uicode%3D10000011',
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const body = await rp(options)
        const $list = []
        body.data.cards.forEach(item => {
            if (item.card_group) {
                item.card_group.forEach(sub_item => {
                    let video = ''
                    let video_img = ''
                    if (sub_item.mblog.page_info && sub_item.mblog.page_info.media_info) {
                        video =
                            sub_item.mblog.page_info.media_info.mp4_720p_mp4 ||
                            sub_item.mblog.page_info.media_info.mp4_hd_url ||
                            sub_item.mblog.page_info.media_info.mp4_sd_url ||
                            sub_item.mblog.page_info.media_info.stream_url
                        video_img = sub_item.mblog.page_info.page_pic.url
                    }
                    $list.push({
                        itemid: sub_item.mblog.id,
                        pics: sub_item.mblog.pics,
                        text: sub_item.mblog.text.replace(/"\/\//g, '"https://'),
                        video,
                        video_img
                    })
                })
            }
        })
        const $return = {
            ...body,
            since_id: body.data.pageInfo.since_id,
            data: $list
        }
        res.json($return)
    } catch (error) {
        res.json({ ok: 2, msg: error.toString() })
    }
}
