const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');


/*
 * Config
 */
const CONFIG_DEFAULT_PATH = './config/_default.json';
const CONFIG_DEST_PATH = './config/default.json';
fs.copyFile(CONFIG_DEFAULT_PATH, CONFIG_DEST_PATH, fs.constants.COPYFILE_EXCL, (err) => {
    if (!err) {
        console.log('Config file is generated.');
    }
});
const STORAGE_PATH = './storage';
fs.mkdir(STORAGE_PATH + '/auth', (err) => {
    if (!err) {
        console.log('Auth directory is generated.');
    }
});
fs.mkdir(STORAGE_PATH + '/data', (err) => {
    if (!err) {
        console.log('Data directory is generated.');
        fs.mkdirSync(STORAGE_PATH + '/data/calendars');
        fs.mkdirSync(STORAGE_PATH + '/data/users');
        fs.mkdirSync(STORAGE_PATH + '/data/weather');
    }
    fs.writeFileSync(STORAGE_PATH + '/data/users/users.json', JSON.stringify([], null, "\t"));
});

/*
 * Google Api
 */
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/admin.directory.user.readonly'];
const CREDENTIAL_PATH = './storage/auth/credentials.json';
const TOKEN_PATH = './storage/auth/token.json';

// Load client secrets from a local file.
fs.readFile(CREDENTIAL_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);

    fs.stat(TOKEN_PATH, (err) => {
        if (!err) {

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Token file already exists. Delete it? (y/N) :', (input) => {
                rl.close();
                if (input === 'Y' || input === 'y') {
                    fs.unlink(TOKEN_PATH, (err) => {
                        if (err) throw err;
                        authorize(JSON.parse(content), checkCalendarApi);
                        //authorize(JSON.parse(content), checkAdminApi);
                    });
                }
            });

        } else {

            authorize(JSON.parse(content), checkCalendarApi);
            //authorize(JSON.parse(content), checkAdminApi);

        }
    });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function checkCalendarApi(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) {
            console.log('failed: Google Calendar API Access.');
            console.log(err);
            return;
        }

        console.log('success: Google Calendar API Access.');
    });
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function checkAdminApi(auth) {
    const service = google.admin({ version: 'directory_v1', auth });
    service.users.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email',
    }, (err, res) => {
        if (err) {
            console.log('failed: Google Admin API Access.');
            console.log(err);
            return;
        }

        console.log('success: Google Admin API Access.');
    });
}
