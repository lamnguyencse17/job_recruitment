const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const redis = require('./middlewares/redis')
const verify = require('./middlewares/verify')

const app = express();
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(verify())
app.use(redis())

app.use('/api/auths/login', require('./routes/api/auths/login'))
app.use('/api/auths/register', require('./routes/api/auths/register'))
app.use('/api/auths/verify', require('./routes/api/auths/verify'))
app.use('/api/auths/logout', require('./routes/api/auths/logout'))
app.use('/api/profiles', require('./routes/api/profiles'))
app.use('/api/jobs', require('./routes/api/jobs'))
app.use('/api/companies', require('./routes/api/companies'))
app.use('/api/cvs', require('./routes/api/cvs'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));