const fs = require('fs');
const https = require('https');
const calendarApi = require('./routes/lib/calendar');
const userApi = require('./routes/lib/users');
const weatherApi = require('./routes/lib/weather');
const trainDelaysApi = require('./routes/lib/train-delays');
/*
 * Socket.IO
 */
module.exports = function (server) {
    var io = require('socket.io')(server);

    io.sockets.on('connection', function (socket) {
        myconsole.log(myconsole.subjects.info, 'Socket_io', 'Client is connected', socket.handshake);
        
        socket.on('disconnect', function () {
            myconsole.log(myconsole.subjects.info, 'Socket_io', 'Client is disconnected', socket.handshake);
        });
    });


    class Calendar {
        constructor(_io) {
            this.io = _io.of('/calendar').on('connection', this.init.bind(this));
        }

        init(socket) {
            this.sendAllEvents(socket.id);
        
            socket.on('events', () => {
                this.sendAllEvents(socket.id);
            });
    
            socket.on('updateAllEvents', () => {
                this.updateAllEvents();
            });
    
            socket.on('resource_list', () => {
                getResources((json) => {
                    this.io.to(socket.id).emit('resource_list', json);
                });
            });
        }

        getResources() {
            return config.room.resources;
        }

        sendEvent(resource, to) {
            fs.readFile('./storage/data/calendars/' + resource.id + '.json', 'utf-8', (err, content) => {
                if (err) return;

                let json = JSON.parse(content);
                json.summary = resource.summary || json.summary;
                json.priority = resource.priority || 0;

                if (to) {
                    this.io.to(to).emit('events', json);
                } else {
                    this.io.emit('events', json);
                }
            });
        }

        sendAllEvents(to) {
            this.getResources().forEach(resource => {
                this.sendEvent(resource, to);
            });
        }

        updateAllEvents() {
            this.getResources().forEach((resource) => {
                calendarApi.updateEvents(resource.id, (id, path) => {
                    this.sendEvent(resource);
                });
            });
        }
    }


    class Weather {
        constructor(_io) {
            this.io = _io.of('/weather').on('connection', this.init.bind(this));
        }

        init(socket) {
            this.send(socket.id);

            socket.on('get', () => {
                this.send(socket.id);
            });
        }

        send(to) {
            fs.readFile('./storage/data/weather/weather.json', 'utf-8', (err, content) => {
                if (err) return;

                const json = JSON.parse(content);
                if (to) {
                    this.io.to(to).emit('weather', json);
                } else {
                    this.io.emit('weather', json);
                }
            });
        }

        update() {
            const owm = config.weather.openWeatherMapApi;
            if (owm.apiKey && owm.locationId) {
                weatherApi.update({
                    apiKey: owm.apiKey,
                    id: owm.locationId
                }, () => {
                    this.send();
                });
            }
        }
    }

    
    class TrainDelays {
        constructor(_io) {
            this.io = _io.of('/train-delays').on('connection', this.init.bind(this));
        }

        init(socket) {
            this.send(socket.id);
            
            socket.on('get', () => {
                this.send(socket.id);
            });
        }

        send(to) {
            fs.readFile('./storage/data/train-delays/delays.json', 'utf-8', (err, content) => {
                if (err) return;

                const json = JSON.parse(content);
                if (to) {
                    this.io.to(to).emit('delays', json);
                } else {
                    this.io.emit('delays', json);
                }
            });
        }

        update() {
            trainDelaysApi.update(() => {
                this.send();
            });
        }
    }


    const calendar = new Calendar(io);
    const weather = new Weather(io);
    const trainDelays = new TrainDelays(io);
    
    if (config.room.autoUpdate) {
        calendar.updateAllEvents();
        setInterval(() => {
            calendar.updateAllEvents();
        }, config.room.updateIntervalSeconds * 1000);
    }

    if (config.room.autoUpdateUsername) {
        userApi.update();
        setInterval(() => {
            userApi.update();
        }, 24 * 60 * 60 * 1000);
    }

    if (config.weather.autoUpdate) {
        weather.update();
        setInterval(() => {
            weather.update();
        }, config.weather.updateIntervalSeconds * 1000);
    }

    if (config.trainDelays.autoUpdate) {
        trainDelays.update();
        setInterval(() => {
            trainDelays.update();
        }, config.trainDelays.updateIntervalSeconds * 1000);
    }

    return io;
};