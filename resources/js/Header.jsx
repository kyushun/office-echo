import React from 'react';
import { render } from 'react-dom';
import kyureki from '../qreki';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: {
                year: '',
                month: '',
                date: '',
                day: ''
            },
            rokuyo: '',
            time: '',
            sec: ''
        };
        this._date = null;
    }

    componentDidMount() {
        this.updateClock();
        this.clockInterval = null;
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    getRokuyo() {
        var dt = new Date();
        var kr = new kyureki(dt.getJD());
        return kr.rokuyo;
    }

    updateClock = () => {
        let dt = new Date();
        let year = dt.getFullYear();
        let month = dt.getMonth();
        let date = dt.getDate();
        let days = ['日', '月', '火', '水', '木', '金', '土'];
        let day = days[dt.getDay()];
        let hour = set2fig(dt.getHours());
        let min = set2fig(dt.getMinutes());
        let sec = set2fig(dt.getSeconds());
        
        if (!this._date || this._date.getDate() != dt.getDate()) {
            this.setState({
                rokuyo: this.getRokuyo()
            });
            this._date = dt;
        }

        this.setState({
            date: {
                year: year,
                month: month + 1,
                date: date,
                day: day
            },
            //date: `${year}年${month + 1}月${date}日（${day}）`,
            time: `${hour}:${min}`,
            sec: `:${sec}`
        });

        function set2fig(num) {
            return num >= 10 ? num : '0' + num;
        }
    }

    render() {
        const { year, month, date, day } = this.state.date;
        return (
            <div className="header">
                <div className="h-date">
                    {year}<span className="half-span">年</span>{month}<span className="half-span">月</span>{date}<span className="half-span">日</span>
                    <span className="half-span">（</span>{day}<span className="half-span">）</span>{this.state.rokuyo}
                </div>
                <div className="h-time">
                    {this.state.time}<div className="h-sec">{this.state.sec}</div>
                </div>
            </div>
        );
    }
}