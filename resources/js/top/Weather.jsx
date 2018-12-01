import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';

const Weather = observer(class Weather extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { currently, hourly } = this.props.weatherStore;

        return (
            <div className="card weather">
                <div className="card-title">天気</div>
                {(() => {
                    if (currently.length > 0) {
                        return (
                            <div>
                                <div className="today-weather">
                                    <i className={`icon wi wi-forecast-io-${currently[0].icon}`} />
                                    <div className="temp">{Math.round(currently[0].temperature)}&deg;C</div>
                                </div>
                                {(() => {
                                    if (hourly.length > 0) {
                                        return (
                                            <div>
                                                <hr className="weather-hr" />
                                                <div className="weekly-weather">
                                                    <div className="ww1">
                                                        <div className="describe">3<span className="half-span">時間後</span></div>
                                                        <i className={`icon wi wi-forecast-io-${hourly[3].icon}`} />
                                                        <div className="temp">{Math.round(hourly[3].temperature)}&deg;C</div>
                                                    </div>
                                                    <div className="ww2">
                                                        <div className="describe">6<span className="half-span">時間後</span></div>
                                                        <i className={`icon wi wi-forecast-io-${hourly[6].icon}`} />
                                                        <div className="temp">{Math.round(hourly[6].temperature)}&deg;C</div>
                                                    </div>
                                                    <div className="ww3">
                                                        <div className="describe">9<span className="half-span">時間後</span></div>
                                                        <i className={`icon wi wi-forecast-io-${hourly[9].icon}`} />
                                                        <div className="temp">{Math.round(hourly[9].temperature)}&deg;C</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        );
                    } else {
                        return (
                            <div className="text-center">天気情報を取得中です...</div>
                        );
                    }
                })()}
            </div>
        );
    }
})

export default Weather;