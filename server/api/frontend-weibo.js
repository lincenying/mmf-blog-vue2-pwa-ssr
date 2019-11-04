const fs = require('fs')
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
            code: 200,
            total: body.data.cardlistInfo.total,
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
        res.json({ code: 300, ok: 2, msg: error.toString() })
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
            code: 200,
            total: body.data.total,
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
        res.json({ code: 300, ok: 2, msg: error.toString() })
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
            if (item.card_group && Array.isArray(item.card_group)) {
                item.card_group.forEach(sub_item => {
                    let video = ''
                    let video_img = ''
                    if (sub_item.mblog && sub_item.mblog.page_info && sub_item.mblog.page_info.media_info) {
                        video =
                            sub_item.mblog.page_info.media_info.mp4_720p_mp4 ||
                            sub_item.mblog.page_info.media_info.mp4_hd_url ||
                            sub_item.mblog.page_info.media_info.mp4_sd_url ||
                            sub_item.mblog.page_info.media_info.stream_url
                        video_img = sub_item.mblog.page_info.page_pic.url
                        $list.push({
                            itemid: sub_item.mblog.id,
                            pics: sub_item.mblog.pics,
                            text: sub_item.mblog.text.replace(/"\/\//g, '"https://'),
                            video,
                            video_img
                        })
                    }
                })
            }
        })
        const $return = {
            ...body,
            code: 200,
            since_id: body.data.pageInfo.since_id,
            data: $list,
            total: body.data.pageInfo.total
        }
        res.json($return)
    } catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

// 231522type=64&q=#尤物#&t=0 => 231522type%3D64%26q%3D%23%E5%B0%A4%E7%89%A9%23%26t%3D0
// 100103type=64&q=#美女#&t=0 => 100103type%3D64%26q%3D%23%E7%BE%8E%E5%A5%B3%23%26t%3D0
exports.beautyVideo = async (req, res) => {
    const key = encodeURIComponent(req.query.key)
    const page = req.query.page || 1
    const options = {
        method: 'GET',
        uri: `https://m.weibo.cn/api/container/getIndex?containerid=${key}&page_type=searchall&page=${page}`,
        headers: {
            Referer: 'referer: https://m.weibo.cn/',
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            cookie:
                'WEIBOCN_FROM=1110003030; _T_WM=11214676918; ALF=1574933534; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFT_XGWwkzbVC-hibvsTOby5JpX5K-hUgL.Fo-7e0qfSKBpehB2dJLoIpjLxKqL1--L1KMLxK-LBozL1K2LxK-LB.BLBo2t; SCF=AjB-wdHJYcdZZUPaCHjN5nGT-S44NH0cad5iqpIkmxkfWkns31OkWpELtvEmPnUginjGYsy42c6K96dSkeeIQIc.; SUB=_2A25wvHd2DeRhGeNO6FQU9SrNyziIHXVQXxk-rDV6PUJbktAKLU-hkW1NTxVebVnXJIjFL8bscTisnqOc0MexHvur; SUHB=0A0Z-9CMJ-LIBO; SSOLoginState=1572341543; MLOGIN=1; XSRF-TOKEN=0616f9; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D100103type%253D64%2526q%253D%2523%25E7%25BE%258E%25E5%25A5%25B3%2523%2526t%253D0%26fid%3D100103type%253D64%2526q%253D%2523%25E7%25BE%258E%25E5%25A5%25B3%2523%2526t%253D0%26uicode%3D10000011',
            'upgrade-insecure-requests': 1
        },
        json: true
    }
    try {
        const body = await rp(options)
        const $list = []
        const cardsLength = (body.data.cards && body.data.cards.length) || 0
        if (cardsLength > 0) {
            const cards = body.data.cards[cardsLength - 1]
            if (cards && cards.card_group && Array.isArray(cards.card_group)) {
                cards.card_group.forEach(sub_item => {
                    let video = ''
                    let video_img = ''
                    if (sub_item.mblog && sub_item.mblog.page_info && sub_item.mblog.page_info.media_info) {
                        video =
                            sub_item.mblog.page_info.media_info.mp4_720p_mp4 ||
                            sub_item.mblog.page_info.media_info.mp4_hd_url ||
                            sub_item.mblog.page_info.media_info.mp4_sd_url ||
                            sub_item.mblog.page_info.media_info.stream_url
                        video_img = sub_item.mblog.page_info.page_pic.url
                        $list.push({
                            itemid: sub_item.mblog.id,
                            pics: sub_item.mblog.pics,
                            text: sub_item.mblog.text.replace(/"\/\//g, '"https://'),
                            video,
                            video_img
                        })
                    }
                })
            }
        }
        const $return = {
            ...body,
            code: 200,
            next_page: body.data.cardlistInfo.page,
            data: $list,
            total: body.data.cardlistInfo.total
        }
        res.json($return)
    } catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

exports.detail = async (req, res) => {
    const id = req.query.id
    if (!id) {
        res.json({ code: 301, ok: 2, msg: '参数错误' })
        return
    }
    try {
        const options = {
            method: 'GET',
            uri: 'https://m.weibo.cn/detail/' + id,
            headers: {
                Referer: 'referer: https://m.weibo.cn/',
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                cookie:
                    'SCF=Aip1F5fqYgfG7nzFqjK3Umxcyp0ztYFLhFYqAAQMvjFPG0UhUj0fJHdp0A7j7wfLwTXfaHg_dOII1ioFQajhYGE.; SUHB=0qjkPHiLu6EcDR; WEIBOCN_FROM=1110003030; SSOLoginState=1546322762; MLOGIN=0; _T_WM=7a00598bc69860f7c6aa9c5beabe7f23; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D102803_ctg1_4388_-_ctg1_4388%26fid%3D102803_ctg1_4388_-_ctg1_4388%26uicode%3D10000011',
                'upgrade-insecure-requests': 1
            }
        }
        const body = await rp(options)
        const jsData = body.split('$render_data = [{')[1].split('}][0]')[0]
        const json = JSON.parse('[{' + jsData + '}]')
        const data = json[0].status
        const $return = {
            code: 200,
            ok: 1,
            data: {
                itemid: id,
                text: data.text.replace(/"\/\//g, '"https://'),
                pics: data.pics.map(item => {
                    return item.large.url
                })
            }
        }
        res.json($return)
    } catch (error) {
        res.json({ code: 300, ok: 2, msg: error.toString() })
    }
}

exports.checkUpdate = (req, res) => {
    const jsonTxt = fs.readFileSync('./server/config/app.json', 'utf-8')
    const json = JSON.parse(jsonTxt)
    res.json({ code: 200, data: json })
}
