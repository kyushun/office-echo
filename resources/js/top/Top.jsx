import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import Weather from './Weather';
import Train from './Train';
import Rooms from './Rooms';

export default class Top extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-body">
                <div className="left-body">
                    <Link to="/weather"><Weather weatherStore={this.props.weatherStore} /></Link>
                    <Train />
                </div>
                <div className="right-body">
                    <Rooms calendarStore={this.props.calendarStore} />
                </div>
            </div>
        );
    }
}