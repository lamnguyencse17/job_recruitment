const fs = require('fs');

function writeLog(baseUrl, route, method, body, error) {
    let date = new Date()
    date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    let path = `./logging/logs/error/${date}`
    if (!fs.existsSync(path)) {
        console.log(fs.mkdirSync(path, { recursive: true }))
    }
    let data = JSON.stringify({
        method: method,
        route: route,
        body: body,
        error: error
    }, null, 2)
    write(path, data)
}

async function write(path, data) {
    let date = new Date()
    fs.writeFile(`${path}/${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.log`, data, (err) => {
        if (err) {
            console.log(err)
        }
    })
}


module.exports.writeLog = writeLog