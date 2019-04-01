const fs = require('fs')
const multer = require('multer')
const AipImageClassifyClient = require('baidu-aip-sdk').imageClassify
const upload = multer({ dest: 'uploads/' }).single('file')
const config = require('../config/shihua')

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
    const id = req.query.id
    const client = new AipImageClassifyClient(config.APP_ID, config.API_KEY, config.SECRET_KEY)

    try {
        const image = fs.readFileSync('./uploads/' + id).toString('base64')
        const options = {}
        options['baike_num'] = '5'
        // 带参数调用植物识别
        client
            .plantDetect(image, options)
            .then(function(result) {
                res.json({
                    code: 200,
                    ...result
                })
            })
            .catch(function(err) {
                res.json({ code: -200, msg: err.toString() })
            })
    } catch (error) {
        res.json({ code: -200, msg: error.toString() })
    }
}
