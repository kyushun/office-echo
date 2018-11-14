import React from 'react';
import { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'


const WeatherDetail = observer(class WeatherDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.autoCloseTimeout = setTimeout(() => {
            this.props.history.push('/');
        }, 30 * 1000);
    }

    componentWillUnmount = () => {
        clearTimeout(this.autoCloseTimeout);
    }

    render() {
        const weathers = this.props.weatherStore.weather;


        return (
            <div className="weather-detail">
                {(() => {
                    if (weathers.length > 0) {
                        return (
                            <div className="weather-detail-wrapper">
                                <div className="card current-weather-detail">
                                    <div className="card-title">現在の天気</div>
                                    <div className="today-weather">
                                        <i className={`icon wi wi-owm-${weathers[0].id}`} />
                                        <div className="temp">{weathers[0].temp}&deg;C</div>
                                        <div className="humid">{weathers[0].humid}%</div>
                                    </div>
                                </div>
                                <div className="card follow-weather-detail">
                                    <div className="card-title">今後の天気</div>
                                    <div className="weather-todays">
                                        <div className="weather-todays-content-wrapper">
                                            {[...Array(3)].map((val, i) => {
                                                const index = i + 1;
                                                return (
                                                    <div key={weathers[index].dt} className="weather-todays-content">
                                                        <div className="weather-todays-content-title">{moment.unix(weathers[index].dt).format('HH:mm')}</div>
                                                        <div className="inner-content">
                                                            <i className={`icon wi wi-owm-${weathers[index].id}`} />
                                                            <div className="detail">
                                                                <div className="temp">{weathers[index].temp}&deg;C　</div>
                                                                <div className="humid">{weathers[index].humid}%</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <hr className="w-f-hr" />
                                        <div className="weather-todays-content-wrapper">
                                            {[...Array(4)].map((val, i) => {
                                                const today = moment().date();
                                                for (let _i = 1; _i < weathers.length; _i++) {
                                                    if ((moment.unix(weathers[_i].dt).date() - today) ===  (i + 1)) {
                                                        if ((moment.unix(weathers[_i].dt).hours() === 12)) {
                                                            var index = _i;
                                                            break;
                                                        }
                                                    }
                                                }
                                                return (
                                                    <div key={weathers[index].dt} className="weather-todays-content">
                                                        <div className="weather-todays-content-title">{moment.unix(weathers[index].dt).format('MM/DD')}</div>
                                                        <div className="inner-content">
                                                            <i className={`icon wi wi-owm-${weathers[index].id}`} />
                                                            <div className="detail">
                                                                <div className="temp">{weathers[index].temp}&deg;C　</div>
                                                                <div className="humid">{weathers[index].humid}%</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })()}
                <Link to="/">
                    <div className="close-btn"><div className="content">×</div></div>
                </Link>
            </div>
        );
    }
});

export default withRouter(WeatherDetail);