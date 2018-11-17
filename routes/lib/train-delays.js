const fs = require('fs');
const req = require("request");

const FILE_PATH = './storage/data/train-delays/delays.json';
const URL = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';

exports.update = (callback) => {
    const options = {
        url: URL,
        method: 'GET',
        json: true
    };
    req.get(options, (err, res, json) => {
        if (err) {
            console.log(err);
            return;
        }

        fs.writeFile(FILE_PATH,  JSON.stringify(json, null, "\t"), (err) => {
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