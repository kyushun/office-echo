import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { observer, inject, Provider } from "mobx-react";
import Header from './js/Header';
import Top from './js/top/Top';
import Room from './js/room/Room';
import WeatherDetail from './js/weather/WeatherDetail';

import CalendarStore from './js/models/CalendarStore';
import WeatherStore from './js/models/WeatherStore';

import "./sass/_reboot.scss";
import "./sass/style.scss";


global.moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

const calendarStore = new CalendarStore();
const weatherStore = new WeatherStore();

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <Router>
                <Route render={({ location }) => (
                    <div>
                        <Header />
                        <div style={{position: 'relative'}}>
                            <TransitionGroup>
                                <CSSTransition
                                    key={location.key}
                                    classNames="anim"
                                    timeout={300}
                                >

                                    <Switch location={location}>
                                        <Route exact path='/' render={({ match }) => (
                                            <Top weatherStore={weatherStore} calendarStore={calendarStore} {...this.props} match={match} />
                                        )} />
                                        <Route exact path='/weather' render={({ match }) => (
                                            <WeatherDetail weatherStore={weatherStore} match={match} />
                                        )} />
                                        <Route exact path='/room/:id' render={({ match }) => (
                                            <Room calendarStore={calendarStore} match={match} />
                                        )} />
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>
                        </div>
                    </div>
                )} />
            </Router>
        );
    }
}

render(<App />, document.getElementById('app'));