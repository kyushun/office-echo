const fs = require('fs');
const { google } = require('googleapis');

const REDIRECT_URL = 'http://localhost:3000/oauthcallback';
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CREDENTIAL_PATH = './storage/auth/credentials.json';
const TOKEN_PATH = './storage/auth/token.json';


exports.getOAuth2Client = () => {
    try {
        const credential = fs.readFileSync(CREDENTIAL_PATH, 'utf-8');
        const { client_id, client_secret, redirect_uris } = JSON.parse(credential).installed;
        var oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
        oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
        myconsole.log(myconsole.subjects.error, API_NAME, `An error has occurred - "${err}"`);
        return;
    }
    return oAuth2Client;
}