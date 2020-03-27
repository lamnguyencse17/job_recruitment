const fs = require('fs')
const archiver = require('archiver')
const nodemailer = require('nodemailer')

function compress(path, target) {
    let output = fs.createWriteStream(target);
    let archive = archiver('zip', {
        zlib: { level: 9 }
    })
    archive.on('error', function (err) {
        throw err;
    })
    archive.pipe(output);
    archive.glob(`*.log`, { cwd: path });
    archive.finalize();
}

function errorMail(err) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mailserver@gmail.com',
            pass: 'password'
        }
    });
    let mainOptions = {
        from: 'Job_Recruitment',
        to: 'nguyenquanglam3008@gmail.com',
        subject: 'CronJob_LogCompress Error',
        text: err,
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = () => {
    return function () {
        try {
            let date = new Date()
            date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            let zip = [{
                path: `./logging/logs/error/${date}`,
                target: `./archive/error/${date}.zip`
            }, {
                path: `./logging/logs/cache/${date}`,
                target: `./archive/cache/${date}.zip`
            }]
            zip.map(data => {
                compress(data.data, data.target)
            })
        } catch (err) {
            errorMail(err)
        }

    }
}