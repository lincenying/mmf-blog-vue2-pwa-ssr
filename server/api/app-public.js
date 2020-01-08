const fs = require('fs')

exports.checkUpdate = (req, res) => {
    const jsonTxt = fs.readFileSync('./server/config/app.json', 'utf-8')
    const json = JSON.parse(jsonTxt)
    res.json({ code: 200, data: json })
}
