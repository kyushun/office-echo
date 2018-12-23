import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { observer, inject, Provider } from "mobx-react";
import Header from './js/Header';
import Top from './js/top/Top';
import Room from './js/room/Room';
import WeatherDetail from './js/weather/WeatherDetail';
import Viewer from './js/viewer/Viewer';
import Error from './Error';

import CalendarStore from './js/models/CalendarStore';
import WeatherStore from './js/models/WeatherStore';
import TrainDelaysStore from './js/models/TrainDelaysStore';

import "./sass/_reboot.scss";
import "./sass/style.scss";


global.moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");
moment.locale("ja");

const calendarStore = new CalendarStore();
const weatherStore = new WeatherStore();
const trainDelaysStore = new TrainDelaysStore();

const MyRouter = props => (
    <Router>
        <Route render={({ location }) => (
            <div>
                <Header weatherStore={weatherStore} trainDelaysStore={trainDelaysStore} />
                <div style={{ position: 'relative' }}>
                    <TransitionGroup>
                        <CSSTransition
                            key={location.key}
                            classNames="anim"
                            timeout={300}
                        >
                            <Switch location={location}>
                                <Route exact path='/' render={({ match }) => (
                                    <Top weatherStore={weatherStore} calendarStore={calendarStore} trainDelaysStore={trainDelaysStore} match={match} />
                                )} />
                                <Route exact path='/weather' render={({ match }) => (
                                    <WeatherDetail weatherStore={weatherStore} match={match} />
                                )} />
                                <Route exact path='/room/:id' render={({ match }) => (
                                    <Room calendarStore={calendarStore} match={match} />
                                )} />
                                <Route exact path='/viewer' render={({ match }) => (
                                    <Viewer calendarStore={calendarStore} match={match} />
                                )} />
                                <Route exact path='/error' render={({ match }) => (
                                    <Error error={this.state.errorContent} info={this.state.errorInfo} match={match} />
                                )} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>
        )} />
    </Router>
)

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorOccurred: false,
            errorContent: [],
            errorInfo: []
        };
    }

    componentDidCatch = (error, info) => {
        this.setState({
            errorOccurred: true,
            errorContent: error,
            errorInfo: info
        });
    }

    render = () => {
        if (this.state.errorOccurred) {
            return (
                <Error error={this.state.errorContent} info={this.state.errorInfo} />
            );
        } else {
            return (
                <MyRouter />
            );
        }
    }
}

render(<App />, document.getElementById('app'));