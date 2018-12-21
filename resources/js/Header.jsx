import React from 'react';
import { render } from 'react-dom';
import kyureki from '../qreki';

const ANIMATION_INTERVAL_SEC = 4;

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
        this.animationCount = 0;
    }

    componentDidMount() {
        this.updateClock();
        this.clockInterval = null;
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);

        this.cnt = 0;
        setInterval(() => {
            this.animation();
            console.log('a');
        }, ANIMATION_INTERVAL_SEC * 1000);
    }

    animation() {
        const titleId = 'header-info-title';
        const contentId = 'header-info-content';
        const animTag = '-anim-';
        const titleParent = document.getElementById(titleId);
        const contentParent = document.getElementById(contentId);

        var tc = titleParent.children[this.animationCount];
        var tn = titleParent.children[this.animationCount + 1];
        var cc = contentParent.children[this.animationCount];
        var cn = contentParent.children[this.animationCount + 1];

        if (typeof cn !== "undefined") {
            this.animationCount++;
        } else {
            this.animationCount = 0;
            tn = titleParent.children[0];
            cn = contentParent.children[0];
        }

        if (typeof tc !== "undefined") {
            tc.classList.remove(titleId + animTag + 'in');
            tc.classList.add(titleId + animTag + 'out');
        }
        if (typeof cc !== "undefined") {
            cc.classList.remove(contentId + animTag + 'in');
            cc.classList.add(contentId + animTag + 'out');
        }
        tn.classList.remove(titleId + animTag + 'out');
        tn.classList.add(titleId + animTag + 'in');
        cn.classList.remove(contentId + animTag + 'out');
        cn.classList.add(contentId + animTag + 'in');
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
                <div className="header-date">
                    <div className="h-date">
                        {year}<span className="half-span">年</span>{month}<span className="half-span">月</span>{date}<span className="half-span">日</span>
                        <span className="half-span">（</span>{day}<span className="half-span">）</span>{this.state.rokuyo}
                    </div>
                    <div className="h-time">
                        {this.state.time}<div className="h-sec">{this.state.sec}</div>
                    </div>
                </div>
                <div className="header-info">
                    <div className="header-info-frame">
                        <div id="header-info-title" className="header-info-title-wrapper">
                            <div id="t1" className="header-info-title header-info-title-anim-in">お知らせ</div>
                            <div id="t2" className="header-info-title header-info-title-anim-out">天気</div>
                            <div id="t2" className="header-info-title header-info-title-anim-out">鉄道遅延</div>
                            <div id="t2" className="header-info-title header-info-title-anim-out">お知らせ</div>
                        </div>
                        <div id="header-info-content" className="header-info-content-wrapper">
                            <div id="c1" className="header-info-content header-info-content-anim-in">ここはお知らせほんぶんです</div>
                            <div id="c2" className="header-info-content header-info-content-anim-out">てんきをお知らせします</div>
                            <div id="c2" className="header-info-content header-info-content-anim-out">JR山手線で遅延が発生しています</div>
                            <div id="c2" className="header-info-content header-info-content-anim-out">JR山手線・地下鉄日比谷線・東武スカイツリーラインで遅延が発生しています</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}