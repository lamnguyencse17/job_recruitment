const fs = require('fs');
const errorLog = require('./errorLog')

function writeLog(id, path) {
    path = `${path}/${id}`
    let date = new Date()
    let data = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    if (fs.existsSync(path)) {
        write(path, data, date)
    } else {
        fs.mkdir(path, (err) => {
            if (err) {
                errorLog.writeLog("CacheLog", __dirname, "mkdir", path, err)
            } else {
                write(path, data, date)
            }
        })
    }
}

async function readLog(id, path) {
    let records = [];
    path = `${path}/${id}`; // depends on where the modules are called
    let files = fs.readdirSync(path)
    files.map(file => {
        if (file.includes('.log')) {
            let day = {}
            day[file.replace('.log', '')] = fs.readFileSync(`${path}/${file}`, 'utf8').replace('\r', '').split('\n')
            records = records.concat(day)
        }
    })
    return records
}
// Helper function
function write(path, data, date) {
    path = path + `/${data}.log`;
    date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (fs.existsSync(path)) {
        fs.appendFileSync(path, `\n${date}`)
    } else {
        fs.writeFile(path, date, (err) => {
            if (err) {
                errorLog.writeLog("authLog", __dirname, "writeFile", path, err)
            } else {
                console.log("success!")
            }
        })
    }
}

module.exports.writeLog = writeLog
module.exports.readLog = readLog