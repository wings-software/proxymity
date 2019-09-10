var express = require('express')
var proxy = require('express-http-proxy');
var https = require('https');
const fs = require('fs');
const kill = require('kill-port')

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');

var options = {
    key: key,
    cert: cert
};

var app = express()
var router = express.Router()

app.get('/testing', function (req, res) {
    res.send('hello world')
})

var mockApisFile = fs.readFileSync(__dirname + '/mock.json');

const mockApis = JSON.parse(mockApisFile)

Object.keys(mockApis).forEach((api) => {
    const methods = Object.keys(mockApis[api]);

    const expressApi = '/api' + api;

    methods.forEach((method) => {
        router[method](expressApi, (req, res) => {
            setTimeout(() => {
                res.json(mockApis[api][method]);
            }, 2000);
        });
    })
});

app.use(router);
app.use("/", proxy('http://localhost:3457'));

var server = https.createServer(options, app);

server.listen(9191, () => {
    console.log("server starting on port : " + 9191)
});

