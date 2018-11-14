const fs = require('fs');
const req = require("request");

const FILE_PATH = './storage/data/weather/weather.json';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

exports.update = (options, callback) => {
    const _options = {
        url: BASE_URL,
        method: 'GET',
        json: true,
        qs: {
            id: options.id,
            appid: options.apiKey,
            units: 'metric'
        }
    };
    req.get(_options, (err, res, json) => {
        if (err) {
            console.log(err);
            return;
        } else if (json.cod != 200) {
            console.log(json);
            return;
        }

        fs.writeFile(FILE_PATH, JSON.stringify(json, null, "\t"), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            if (typeof(callback) == 'function') {
                callback(json, FILE_PATH);
            }
        });
    });
}