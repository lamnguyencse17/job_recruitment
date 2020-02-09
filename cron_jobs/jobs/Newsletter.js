const nodemailer = require('nodemailer')
const mongo = require('mongodb').MongoClient
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'


// Get 5 most applied jobs send email

module.exports = () => {
    return function () {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                console.log(err)
            }
            let emails = await client.db('job_recruitment').collection('newsletter').find({}, { projection: { _id: 0 } }).toArray()
            let jobs = await client.db('job_recruitment').collection('jobs').aggregate([
                {
                    '$addFields': {
                        'size': {
                            '$size': '$cvs'
                        }
                    }
                }, {
                    '$sort': {
                        'size': -1
                    }
                }
            ]).limit(5).toArray()
            let body = ""
            jobs.map(job => {
                body = body + 
                `<a href="http://127.0.0.1/companies/${job._id}" class="list-group-item list-group-item-action flex-column align-items-start active">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${job.name}</h5>
                        <small>$${job.date}</small>
                    </div>
                    <p class="mb-1">${job.description}</p>
                    <small>$${job.salary}</small>
                </a>`
            })
            let html = `
            <html>
                <head>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                </head>
                <body>
                    <div class="list-group">
                    ${body}
                    </div>
                </body>
            </html>
            `
            emails.map(email => {
                newsletterMail(email.email, html)
            })
        })
    }
}

function newsletterMail(email, html) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mailserver@gmail.com',
            pass: 'password'
        }
    });
    let mainOptions = {
        from: 'Job_Recruitment',
        to: email,
        subject: `Your Daily Job_Recruitment Newsletter`,
        text: "Top 5 most applied job at the moment at Job_Recruitment",
        html: html
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}