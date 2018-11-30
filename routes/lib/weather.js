const fs = require('fs');
const req = require("request");

const API_NAME = 'Weather_API';
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
            myconsole.log(myconsole.subjects.error, API_NAME, 'An error has occurred', err);
            return;
        } else if (json.cod != 200) {
            myconsole.log(myconsole.subjects.error, API_NAME, 'Weather API returned error response', json);
            return;
        }

        myconsole.log(myconsole.subjects.info, API_NAME, `Weather data is updated`);
        fs.writeFile(FILE_PATH, JSON.stringify(json, null, "\t"), (err) => {
            if (err) {
                myconsole.log(myconsole.subjects.error, API_NAME, 'An error has occurred', err);
                return;
            }
            
            if (typeof(callback) == 'function') {
                callback(json, FILE_PATH);
            }
        });
    });
}