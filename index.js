const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const redis = require('./middlewares/redis')
const verify = require('./middlewares/verify')
const scheduler = require('./cron_jobs/scheduler')

const app = express();
scheduler()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(verify())
app.use(redis())

app.use('/admin', require('./routes/admin'))
app.use('/api', require('./routes/api'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));