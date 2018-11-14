const fs = require('fs');
const req = require("request");
const { google } = require('googleapis');
const googleauth = require('./googleauth');

const RESOURCE_DOMAIN = 'resource.calendar.google.com';
const FILE_PATH = './storage/data/users/users.json';

exports.getUserName = (email, _name) => {
    var name = _name || (() => {
        _email = email.split('@');
        return (_email[1] === RESOURCE_DOMAIN) ? '' : _email[0];
    })();
    try {
        const content = fs.readFileSync(FILE_PATH, 'utf-8');
        const users = JSON.parse(content);
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email) {
                name = users[i].name;
                break;
            }
        }
    } catch (err) {
        console.log(err);
    }
    return name;
}

exports.update = (_options, callback) => {
    const auth = googleauth.getOAuth2Client();

    const options = Object.assign({}, {
        customer: 'my_customer',
        maxResults: 500,
        orderBy: 'email',
        viewType: 'domain_public'
    }, _options);

    const service = google.admin({ version: 'directory_v1', auth });
    service.users.list(options, (err, res) => {
        if (err) return console.error('The API returned an error:', err.message);

        const users = res.data.users;
        if (users.length) {
            var json = [];
            users.forEach((user) => {
                json.push({
                    email: user.primaryEmail,
                    name: user.name.fullName
                });
            });

            fs.writeFile(FILE_PATH, JSON.stringify(json, null, "\t"), (err) => {
                if (err) return console.log(err);

                if (typeof(callback) == 'function') {
                    callback(json, FILE_PATH);
                }
            });
        } else {
            console.log('No users found.');
        }
    });
}