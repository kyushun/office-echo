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
        const { currently, hourly, daily } = this.props.weatherStore;

        return (
            <div className="weather-detail">
                <div className="weather-detail-wrapper">
                    {(() => {
                        if (currently.length > 0) {
                            return (
                                <div className="card current-weather-detail">
                                    <div className="card-title">現在の天気</div>
                                    <div className="today-weather">
                                        <i className={`icon wi wi-forecast-io-${currently[0].icon}`} />
                                        <div className="temp">
                                            <span className="half-size">
                                                <span className="three-quarters-size">
                                                    気温:&nbsp;
                                                </span>
                                            </span>
                                            {Math.round(currently[0].temperature)}
                                            <span className="half-size">&deg;C</span>
                                        </div>
                                        <div className="humid">
                                            <span className="half-size">
                                                <span className="three-quarters-size">
                                                    降水確率:&nbsp;
                                                </span>
                                            </span>
                                            {Math.round(currently[0].precipProbability * 100)}
                                            <span className="half-size">%</span>
                                        </div>
                                        <div className="humid">
                                            <span className="half-size">
                                                <span className="three-quarters-size">
                                                    湿度:&nbsp;
                                                </span>
                                            </span>
                                            {Math.round(currently[0].humidity * 100)}
                                            <span className="half-size">%</span>
                                        </div>
                                        <div className="humid">
                                            <span className="half-size">
                                                <span className="three-quarters-size">
                                                    気圧:&nbsp;
                                                </span>
                                            </span>
                                            {Math.round(currently[0].pressure)}
                                            <span className="half-size">hPa</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                    <div className="card follow-weather-detail">
                        <div className="card-title">今後の天気</div>
                        {(() => {
                            if (hourly.length > 0) {
                                return (
                                    <div className="weather-todays">
                                        <div className="weather-todays-content-wrapper">
                                            {[...Array(3)].map((val, i) => {
                                                const index = (i + 1) * 3;
                                                return (
                                                    <div key={hourly[index].time} className="weather-todays-content">
                                                        <div className="weather-todays-content-title">{moment.unix(hourly[index].time).format('HH:mm')}</div>
                                                        <div className="inner-content">
                                                            <i className={`icon wi wi-forecast-io-${hourly[index].icon}`} />
                                                            <div className="detail">
                                                                <div className="temp">{Math.round(hourly[index].temperature)}&deg;C　</div>
                                                                <div className="humid">
                                                                    <i className="icon wi wi-raindrop" />
                                                                    {Math.round(hourly[index].precipProbability * 100)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                        <hr className="w-f-hr" />
                        {(() => {
                            if (daily.length > 0) {
                                return (
                                    <div className="weather-todays-content-wrapper">
                                        {[...Array(4)].map((val, i) => {
                                            const index = i + 1;
                                            return (
                                                <div key={daily[index].time} className="weather-todays-content">
                                                    <div className="weather-todays-content-title">{moment.unix(daily[index].time).format('MM/DD')}</div>
                                                    <div className="inner-content">
                                                        <i className={`icon wi wi-forecast-io-${daily[index].icon}`} />
                                                        <div className="detail">
                                                            <div className="temp">{Math.round(daily[index].temperatureHigh)}&nbsp;/&nbsp;{Math.round(daily[index].temperatureLow)}&deg;C</div>
                                                            <div className="humid"><i className="icon wi wi-raindrop" />{Math.round(daily[index].precipProbability * 100)}%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div>
                <Link to="/">
                    <div className="close-btn"><div className="content">×</div></div>
                </Link>
            </div>
        );
    }
});

export default withRouter(WeatherDetail);