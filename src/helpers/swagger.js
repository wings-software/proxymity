var request = require('request')

function getSwaggerConfig() {
    return new Promise((resolve, reject) => {
        request('http://localhost:3457/api/swagger.json', function (error, response, body) {
            if (error) {
                reject(error);
            }else {
                const responseBody = JSON.parse(body)
                resolve(responseBody.paths);
            }
        });
    });
}

module.exports = {
    getSwaggerConfig
}