import { observable, computed, action, decorate } from 'mobx';

class WeatherStore {
    weather = [];

    constructor() {
        this.socketWeather = io('/weather');

        this.socketWeather.on('disconnect', (err) => {
            this.weather = [];
        });

        this.socketWeather.on('weather', (data) => {
            this.setOwmData(data);
            //console.log('weather data updated!');
        });
    }

    setOwmData = (json) => {
        var _weather = [];
        for (let i = 0; i < json.list.length; i++) {
            const day = json.list[i];
            _weather.push({
                dt: day.dt,
                id: day.weather[0].id,
                temp: Math.round(day.main.temp),
                humid: day.main.humidity
            });
        }
        this.weather = _weather;
    }
}

export default decorate(WeatherStore, {
    weather: observable,
    setOwmData: action
});