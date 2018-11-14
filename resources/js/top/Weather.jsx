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
        const weather = this.props.weatherStore.weather;

        return (
            <div className="card weather">
                <div className="card-title">天気</div>
                {(() => {
                    if (weather.length > 0) {
                        return (
                            <div>
                                <div className="today-weather">
                                    <i className={`icon wi wi-owm-${weather[0].id}`} />
                                    <div className="temp">{weather[0].temp}&deg;C</div>
                                </div>
                                <hr className="weather-hr" />
                                <div className="weekly-weather">
                                    <div className="ww1">
                                        <div className="describe">3<span className="half-span">時間後</span></div>
                                        <i className={`icon wi wi-owm-${weather[1].id}`} />
                                        <div className="temp">{weather[1].temp}&deg;C</div>
                                    </div>
                                    <div className="ww2">
                                        <div className="describe">6<span className="half-span">時間後</span></div>
                                        <i className={`icon wi wi-owm-${weather[2].id}`} />
                                        <div className="temp">{weather[2].temp}&deg;C</div>
                                    </div>
                                    <div className="ww3">
                                        <div className="describe">9<span className="half-span">時間後</span></div>
                                        <i className={`icon wi wi-owm-${weather[3].id}`} />
                                        <div className="temp">{weather[3].temp}&deg;C</div>
                                    </div>
                                </div>
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