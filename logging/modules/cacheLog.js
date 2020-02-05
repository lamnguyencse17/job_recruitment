const fs = require('fs');
const errorLog = require('./errorLog')

function writeLog(route, body, error) {
    let date = new Date();
    let foldername = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let filename = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.log`;
    let path = `./logging/logs/cache/${foldername}/`
    let data = error ? JSON.stringify({
        route,
        body,
    }) : JSON.stringify({
        error,
        route,
        body
    })
    if (fs.existsSync(path)) {
        write(path, filename, data, error)
    } else {
        fs.mkdir(path, (err) => {
            if (err) {
                errorLog.writeLog("CacheLog", __dirname, "mkdir", path, err)
            } else {
                write(path, filename, data, error)
            }
        })
    }
}

function write(path, filename, data, error){
    if (error){
        path = path + "ERR-" + filename;
    } else {
        path = path + "CACHED-" + filename;
    }
    fs.writeFile(path, data, (err) => {
        if (err) {
            errorLog.writeLog("CacheLog", __dirname, "writeFile", path, err)
        }
    })
}

module.exports.writeLog = writeLog