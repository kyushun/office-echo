import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { SvgLoader, SvgProxy } from 'react-svgmt';

const Train = observer(class Train extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.trainDelaysStore.delays.length > 0) {
            return(
                <div className="card info">
                    <div className="card-title">電車遅延情報</div>
                    <div className="train-info">
                        {this.props.trainDelaysStore.delays.map((line) => {
                            const path = '/svg/line-symbol/' + line.symbol + '.svg';
                            return (
                                <div className="line-content" key={line.name}>
                                    <object className="line-symbol" type="image/svg+xml" data={path} width="22" height="22"></object>
                                    <span>{line.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        } else {
            return(
                <div />
            )
        }
    }
});

export default Train;