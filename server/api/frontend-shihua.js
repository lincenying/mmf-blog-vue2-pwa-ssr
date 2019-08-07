const fs = require('fs')
const multer = require('multer')
const moment = require('moment')
const AipImageClassifyClient = require('baidu-aip-sdk').imageClassify
const upload = multer({ dest: 'uploads/' }).single('file')
const config = require('../config/shihua')
const checkJWT = require('../utils/check-jwt').checkJWT

const mongoose = require('../mongoose')
const Shihua = mongoose.model('Shihua')

exports.upload = async (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            res.send({ code: '-200', msg: err.toString() })
        } else if (err) {
            res.send({ code: '-200', msg: err.toString() })
        } else {
            const file = req.file
            res.send({ code: '200', url: file.path })
        }
    })
}
exports.shihua = async (req, res) => {
    const img_id = req.query.id
    const token = req.cookies.user || req.headers.user
    const userid = req.cookies.userid || req.headers.userid
    const username = req.cookies.username || req.headers.username
    const isLogin = await checkJWT(token, userid, username, 'user')
    const getData = async () => {
        const client = new AipImageClassifyClient(config.APP_ID, config.API_KEY, config.SECRET_KEY)
        try {
            const image = fs.readFileSync('./uploads/' + img_id).toString('base64')
            const options = {}
            options['baike_num'] = '5'
            // 带参数调用植物识别
            const shihuaResult = await client.plantDetect(image, options)
            if (isLogin) {
                const length = shihuaResult.result.length
                let img, name
                for (let i = 0; i < length; i++) {
                    const item = shihuaResult.result[i]
                    if (item.baike_info && item.baike_info.image_url) {
                        name = item.name
                        img = item.baike_info.image_url
                        break
                    }
                }
                if (img && name) {
                    await Shihua.createAsync({
                        user_id: userid,
                        img_id,
                        name,
                        img,
                        result: JSON.stringify(shihuaResult.result),
                        creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        is_delete: 0,
                        timestamp: moment().format('X')
                    })
                    fs.unlinkSync('./uploads/' + img_id)
                }
            }
            return shihuaResult
        } catch (error) {
            return null
        }
    }

    if (isLogin) {
        Shihua.findOneAsync({ img_id, user_id: userid }).then(result => {
            if (result) {
                res.json({
                    code: 200,
                    from: 'db',
                    userid,
                    result: JSON.parse(result.result)
                })
            } else {
                getData().then(data => {
                    if (data) {
                        res.json({
                            code: 200,
                            from: 'api',
                            userid,
                            ...data
                        })
                    } else {
                        res.json({
                            code: -200,
                            userid,
                            message: '读取数据失败'
                        })
                    }
                })
            }
        })
    } else {
        getData().then(data => {
            if (data) {
                res.json({
                    code: 200,
                    from: 'api',
                    ...data
                })
            } else {
                res.json({
                    code: -200,
                    message: '读取数据失败'
                })
            }
        })
    }
}

/**
 * 获取识花历史列表
 * @method getHistory
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getHistory = (req, res) => {
    const userid = req.cookies.userid || req.headers.userid
    let { limit, page } = req.query
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    if (!page) page = 1
    if (!limit) limit = 10
    const data = {
        is_delete: 0,
        user_id: userid
    }
    const skip = (page - 1) * limit
    const sort = '-creat_date'

    Promise.all([
        Shihua.find(data)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(),
        Shihua.countDocumentsAsync(data)
    ])
        .then(([data, total]) => {
            const totalPage = Math.ceil(total / limit)
            const json = {
                code: 200,
                data: {
                    total,
                    hasNext: totalPage > page ? 1 : 0,
                    hasPrev: page > 1
                }
            }
            data = data.map(item => {
                item.result = ''
                return item
            })
            json.data.list = data
            res.json(json)
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
}

/**
 * 删除识花历史列表
 * @method delHistory
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.delHistory = (req, res) => {
    const userid = req.cookies.userid || req.headers.userid
    const { img_id } = req.query

    Shihua.deleteOne({ img_id, user_id: userid })
        .then(() => {
            res.json({
                code: 200,
                message: '删除成功'
            })
        })
        .catch(err => {
            res.json({
                code: -200,
                message: err.toString()
            })
        })
}
