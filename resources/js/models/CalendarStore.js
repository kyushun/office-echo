import { observable, computed, action, decorate, toJS } from 'mobx';

class CalendarStore {
    calendars = [];

    constructor() {
        this.socketCal = io('/calendar');

        this.socketCal.on('disconnect', (err) => {
            this.calendars = [];
        });

        this.socketCal.on('events', (data) => {
            //console.log(data.summary + 'updated');
            this.setCalendarData(data);
        });
    }

    get getNormalizedCalendars() {
        var emptyCals = [], usingCals = [];
        this.calendars.forEach((_cal) => {
            const cal = toJS(_cal);
            for (let i = 0; i < cal.events.length; i++) {
                const e = cal.events[i];
                if (moment().tz('Asia/Tokyo').isBetween(e.start, e.end)) {
                    usingCals.push(cal);
                    return;
                }
            }
            emptyCals.push(cal);
        });
        return {
            empty: emptyCals,
            using: usingCals
        };
    }

    get getCalendar() {
        return (id) => {
            var res = [];
            for (let i = 0; i < this.calendars.length; i++) {
                const cal = toJS(this.calendars[i]);
                if (id == cal.id) {
                    res.push(cal);
                    break;
                }
            }
            return res;
        }
    }

    setCalendarData = (data) => {
        for (let i = 0; i < this.calendars.length; i++) {
            if (this.calendars[i].id == data.id) {
                this.calendars[i] = data;
                return;
            }
        }

        var _c = this.calendars.slice();
        _c.push(data);
        _c.sort((_a, _b) => {
            const a = toJS(_a);
            const b = toJS(_b);

            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        });
        this.calendars = _c;
    }
}

export default decorate(CalendarStore, {
    calendars: observable,
    getNormalizedCalendars: computed,
    getCalendar: computed,
    setCalendarData: action
});