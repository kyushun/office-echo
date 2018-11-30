const fs = require('fs');
const req = require("request");

const API_NAME = 'Weather_API';
const FILE_PATH = './storage/data/weather/weather.json';
const BASE_URL = 'https://api.darksky.net/forecast';

const generateUrl = (key, lat, lng) => {
    return `${BASE_URL}/${key}/${lat},${lng}?lang=ja&units=si`;
}

exports.update = (options, callback) => {
    const _options = {
        url: generateUrl(options.key, options.lat, options.lng),
        method: 'GET',
        json: true
    };
    req.get(_options, (err, res, json) => {
        if (err) {
            myconsole.log(myconsole.subjects.error, API_NAME, 'An error has occurred', err);
            return;
        } else if (json.code) {
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