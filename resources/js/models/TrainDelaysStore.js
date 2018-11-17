import { observable, computed, action, decorate } from 'mobx';

class TrainDelaysStore {
    delays = [];

    constructor() {
        this.socket = io('/train-delays');

        this.socket.on('disconnect', (err) => {
            this.delays = [];
        });

        this.socket.on('delays', (data) => {
            this.setDelaysData(data);
        });
    }

    setDelaysData = (json) => {
        this.delays = json;
    }
}

export default decorate(TrainDelaysStore, {
    delays: observable,
    setDelaysData: action
});