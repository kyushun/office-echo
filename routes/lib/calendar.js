const fs = require('fs');
const { google } = require('googleapis');
const googleauth = require('./googleauth');
const users = require('./users');

const API_NAME = 'Calendar_API';
const FILE_PATH = './storage/data/calendars/';

exports.list = (req, res) => {
    const calendarId = req.params.id;
    const auth = googleauth.getOAuth2Client();

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: calendarId,
        orderBy: 'startTime',
        singleEvents: true,
        timeMin: getStartDay(),
        timeMax: getEndOfDay()
    }, (err, _res) => {
        if (err) {
            let resArray = {};
            if (err.errors[0].message) {
                resArray.error = err.errors[0].message;
            } else {
                resArray.error = 'Unknown Error';
            }
            console.log(err);
            return res.json(resArray);
        }

       return res.json(getResponseJson(calendarId, _res.data));
    });
}

exports.update = (req, res) => {
    const calendarId = req.params.id;
    updateEvents(calendarId);

    res.send('Finish');
}

exports.updateEvents = (calendarId, callback) => {
    const auth = googleauth.getOAuth2Client();

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: calendarId,
        orderBy: 'startTime',
        singleEvents: true,
        timeMin: getStartDay(),
        timeMax: getEndOfDay()
    }, (err, _res) => {
        var json = {};

        if (err) {
            if (err.errors[0].message) {
                json.error = err.errors[0].message;
            } else {
                json.error = 'Unknown Error';
            }
            myconsole.log(myconsole.subjects.error, API_NAME, `An error has occurred - "${err}"`);
        } else {
            json = getResponseJson(calendarId, _res.data);
        }
        
        myconsole.log(myconsole.subjects.info, API_NAME, `Calendar Events Updated - "${calendarId}"`);
        fs.writeFileSync(`${FILE_PATH}${calendarId}.json`, JSON.stringify(json, null, "\t"));
        if ( typeof(callback) == "function") {
            callback(calendarId, `${FILE_PATH}${calendarId}.json`);
        }
        return;
    });
}

getStartDay = () => {
    return moment().tz('Asia/Tokyo').startOf('day').format();
}

getEndOfDay = () => {
    return moment().tz('Asia/Tokyo').endOf('day').format();
}

getResponseJson = (calendar_id, data) => {
    var res = {};
    res.id = calendar_id;
    res.summary = data.summary;
    res.events = new Array(data.items.length).fill({});
    
    data.items.map((event, i) => {
        res.events[i] = {
            id: event.id,
            status: event.status,
            summary: event.summary || "",
            start: event.start.date || event.start.dateTime,
            end: event.end.date || event.end.dateTime,
            allDay: (event.start.date == true),
            manager: {
                email: event.organizer.email,
                name: users.getUserName(event.organizer.email)
            },
            attendees:
                (event.attendees) ?
                event.attendees.filter((attender) => {
                    if (attender.self) return false;
                    return true;
                }).map((attender) => {
                    return {
                        email: attender.email,
                        name: users.getUserName(attender.email, attender.displayName)
                    }
                }) :
                []
        };
    });

    return res;
}