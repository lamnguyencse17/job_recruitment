const cronJob = require('cron').CronJob
const fs = require('fs')
const LogCompress = require('./jobs/LogCompress')
const Newsletter = require('./jobs/Newsletter')

module.exports = () => {
    ["./archive/error", "./archive/cache"].map(path => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
    })
    let logCompress = new cronJob('50 59 23 * * *', LogCompress(), null, true, 'Asia/Ho_Chi_Minh')
    logCompress.start()
    let newsletter = new cronJob('00 00 10 * * *', Newsletter(), null, true, 'Asia/Ho_Chi_Minh')
    newsletter.start()
}

