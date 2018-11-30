import { observable, computed, action, decorate } from 'mobx';

class WeatherStore {
    currently = [];
    hourly = [];
    daily = [];

    constructor() {
        this.socketWeather = io('/weather');

        this.socketWeather.on('disconnect', (err) => {
            this.currently = [];
            this.hourly = [];
            this.daily = [];
        });

        this.socketWeather.on('weather', (data) => {
            this.setDarkskyData(data);
        });
    }

    setDarkskyData = (json) => {
        this.currently[0] = json.currently || [];
        this.hourly = json.hourly.data || [];
        this.daily = json.daily.data || [];
    }
}

export default decorate(WeatherStore, {
    currently: observable,
    hourly: observable,
    daily: observable,
    setDarkskyData: action
});