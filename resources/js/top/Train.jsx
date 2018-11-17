import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { SvgLoader, SvgProxy } from 'react-svgmt';

const Train = observer(class Train extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lines: [
                {
                    summary: "京葉線",
                    symbol: "JR_JE"
                },
                {
                    summary: "埼京線",
                    symbol: "JR_JA"
                },
                {
                    summary: "山手線",
                    symbol: "JR_JY"
                },
                {
                    summary: "浅草線",
                    symbol: "A"
                }
            ]
        }
    }

    componentDidMount() {
    }

    render() {
        return(
            <div className="card info">
                <div className="card-title">電車遅延情報</div>
                <div className="train-info">
                    {this.props.trainDelaysStore.delays.map((line) => {
                        return (
                            <div key={line.name}>{line.name}</div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

export default Train;