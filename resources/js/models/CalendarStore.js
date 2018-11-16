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

    getNormalizedCalendars = () => {
        var emptyCals = [], usingCals = [];
        this.calendars.forEach((_cal) => {
            const cal = toJS(_cal);
            for (let i = 0; i < cal.events.length; i++) {
                const e = cal.events[i];
                if (moment().isSameOrAfter(e.start) && moment().isBefore(e.end)) {
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

    getNormalizedEvents = (id) => {
        var summary = null, current = null, follow = [];

        const cal = this.getCalendar(id);

        if (cal.length > 0) {
            summary = cal[0].summary;
            cal[0].events.forEach(e => {
                if (moment().isBefore(e.end)) {
                    if (moment().isSameOrAfter(e.start)) {
                        current = e;
                        return;
                    }
                    follow.push(e);
                }
            });
        }

        return {
            summary: summary,
            currentEvent: current,
            followEvents: follow
        };
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
    getCalendar: computed,
    setCalendarData: action
});