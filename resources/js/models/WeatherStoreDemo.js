class WeatherStoreDemo {
    currently = [];
    hourly = [];
    daily = [];

    constructor() {
        this.currently[0] = {
            "icon": "clear-day",
            "precipProbability": 0.01,
            "temperature": 24,
            "humidity": 0.5,
            "pressure": 1017.44
        };
        this.hourly = [
            {},
            {},
            {},
			{
				"time": 1556686800,
				"icon": "clear-day",
				"precipProbability": 0,
				"temperature": 23
			},
			{
				"time": 1556686800,
				"icon": "clear-day",
				"precipProbability": 0,
				"temperature": 23
			},
            {},
			{
				"time": 1556697600,
				"icon": "partly-cloudy-day",
				"precipProbability": 0.1,
				"temperature": 20
			},
			{
				"time": 1556697600,
				"icon": "partly-cloudy-day",
				"precipProbability": 0.1,
				"temperature": 20
			},
            {},
			{
				"time": 1556708400,
				"icon": "clear-night",
				"precipProbability": 0,
				"temperature": 18
			},
			{
				"time": 1556708400,
				"icon": "clear-night",
				"precipProbability": 0,
				"temperature": 18
			},
            {},
            {},
			{
				"time": 1556722800,
				"icon": "clear-night",
				"precipProbability": 0,
				"temperature": 18
			},
        ];
        this.daily = [
            {},
			{
				"time": 1556722800,
				"icon": "partly-cloudy-day",
                "precipProbability": 0.06,
                "temperatureHigh": 24,
                "temperatureLow": 15
			},
			{
				"time": 1556809200,
				"icon": "partly-cloudy-day",
                "precipProbability": 0.05,
                "temperatureHigh": 23,
                "temperatureLow": 16
			},
			{
				"time": 1556895600,
				"icon": "cloudy",
                "precipProbability": 0.56,
                "temperatureHigh": 23,
                "temperatureLow": 17
			},
			{
				"time": 1556982000,
				"icon": "rain",
                "precipProbability": 0.72,
                "temperatureHigh": 22,
                "temperatureLow": 15
			}
        ];
    }
}

export default WeatherStoreDemo;