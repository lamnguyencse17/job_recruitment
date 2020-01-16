const express = require('express')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auths/login', require('./routes/api/auths/login'))
app.use('/api/auths/register', require('./routes/api/auths/register'))
app.use('/api/auths/verify', require('./routes/api/auths/verify'))
app.use('/api/auths/logout', require('./routes/api/auths/logout'))
app.use('/api/profiles', require('./routes/api/profiles'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));