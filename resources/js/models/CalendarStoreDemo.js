const cals = [
    {
        "id": "demo_kaigi_a",
        "summary": "会議室A",
        "priority": 1,
        "events": [
            {
                "id": "dka_01",
                "summary": "Webマーケ MTG",
                "description": "",
                "start": "2019-05-01T11:00:00+09:00",
                "end": "2019-05-01T12:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dka_01_a",
                    "name": "青木 一哉"
                },
                "attendees": [
                    {
                        "email": "dka_01_a",
                        "name": "青木 一哉"
                    },
                    {
                        "email": "dka_01_b",
                        "name": "安倍 雅紀"
                    },
                    {
                        "email": "dka_01_c",
                        "name": "安藤 輝彦"
                    }
                ]
            },
            {
                "id": "dka_02",
                "summary": "株式会社XX 佐藤様 来社",
                "description": "",
                "start": "2019-05-01T13:00:00+09:00",
                "end": "2019-05-01T15:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dka_01_a",
                    "name": "大井 康一"
                },
                "attendees": []
            }
        ]
    },
    {
        "id": "demo_kaigi_b",
        "summary": "会議室B",
        "priority": 3,
        "events": [
            {
                "id": "dkb_01",
                "summary": "1on1 荒川",
                "description": "",
                "start": "2019-05-01T11:00:00+09:00",
                "end": "2019-05-01T12:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dkb_01_a",
                    "name": "飯塚 薫"
                },
                "attendees": [
                    {
                        "email": "dkb_01_a",
                        "name": "飯塚 薫"
                    },
                    {
                        "email": "dkb_01_b",
                        "name": "荒川 学 "
                    }
                ]
            }
        ]
    },
    {
        "id": "demo_kaigi_C",
        "summary": "会議室C",
        "priority": 5,
        "events": [
            {
                "id": "dkc_01",
                "summary": "採用面接 田中様",
                "description": "",
                "start": "2019-05-01T11:00:00+09:00",
                "end": "2019-05-01T12:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dkc_01_a",
                    "name": "有賀 幹久"
                },
                "attendees": [
                    {
                        "email": "dkc_01_b",
                        "name": "有賀 幹久"
                    }
                ]
            }
        ]
    },
    {
        "id": "demo_oset_1",
        "summary": "応接室1",
        "priority": 7,
        "events": [
            {
                "id": "do1_01",
                "summary": "株式会社XX 吉野様",
                "description": "",
                "start": "2019-05-01T11:00:00+09:00",
                "end": "2019-05-01T12:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dkc_01_a",
                    "name": "石島 慶"
                },
                "attendees": [
                    {
                        "email": "dkc_01_b",
                        "name": "石島 慶"
                    }
                ]
            }
        ]
    },
    {
        "id": "demo_oset_2",
        "summary": "応接室2",
        "priority": 9,
        "events": [
            {
                "id": "do2_01",
                "summary": "役員ミーティング",
                "description": "",
                "start": "2019-05-01T16:00:00+09:00",
                "end": "2019-05-01T18:00:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dka_01_a",
                    "name": "内村 孝輔"
                },
                "attendees": []
            }
        ]
    },
    {
        "id": "demo_oset_3",
        "summary": "応接室3",
        "priority": 11,
        "events": [
            {
                "id": "do2_01",
                "summary": "人事会議",
                "description": "",
                "start": "2019-05-01T14:00:00+09:00",
                "end": "2019-05-01T14:30:00+09:00",
                "allDay": false,
                "manager": {
                    "email": "dka_01_a",
                    "name": "市川 健太"
                },
                "attendees": []
            }
        ]
    },
    {
        "id": "demo_semi_a",
        "summary": "セミナールームα",
        "priority": 13,
        "events": []
    },
    {
        "id": "demo_semi_b",
        "summary": "セミナールームβ",
        "priority": 15,
        "events": []
    },
    {
        "id": "demo_semi_c",
        "summary": "セミナールームγ",
        "priority": 17,
        "events": []
    },
];

class CalendarStoreDemo {
    calendars = [];

    constructor() {
        for (const cal of cals) {
            this.setCalendarData(cal);
        }
    }

    getCalendar(id) {
        var res = [];
        for (let i = 0; i < this.calendars.length; i++) {
            const cal = this.calendars[i];
            if (id == cal.id) {
                res.push(cal);
                break;
            }
        }
        return res;
    }

    getNormalizedCalendars = () => {
        var emptyCals = [], usingCals = [];
        this.calendars.forEach((cal) => {
            for (let i = 0; i < cal.events.length; i++) {
                const e = cal.events[i];
                if (momNow.isSameOrAfter(e.start) && momNow.isBefore(e.end)) {
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
                if (momNow.isBefore(e.end)) {
                    if (momNow.isSameOrAfter(e.start)) {
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
        _c.sort((a, b) => {
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        });
        this.calendars = _c;
    }
}

export default CalendarStoreDemo;