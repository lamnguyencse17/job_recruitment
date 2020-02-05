const cronJob = require('cron').CronJob
const fs = require('fs')
const LogCompress = require('./jobs/LogCompress')

module.exports = () => {
    ["./archive/error", "./archive/cache"].map(path => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
    })
    let logCompress = new cronJob('50 59 23 * * *', LogCompress(), null, true, 'Asia/Ho_Chi_Minh')
    logCompress.start()
}

