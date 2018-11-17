const fs = require('fs');
const req = require("request");

const API_NAME = 'Train_Delays_API';
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
            myconsole.log(myconsole.subjects.error, API_NAME, `An error has occurred - "${err}"`);
            return;
        }

        fs.writeFile(FILE_PATH,  JSON.stringify(json, null, "\t"), (err) => {
            if (err) {
                myconsole.log(myconsole.subjects.error, API_NAME, `An error has occurred - "${err}"`);
                return;
            }

            myconsole.log(myconsole.subjects.info, API_NAME, `Train delays data is updated`);
            if (typeof(callback) == 'function') {
                callback(json, FILE_PATH);
            }
        });
    });
}