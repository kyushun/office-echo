import React from 'react';
import { render } from 'react-dom';
import { SvgLoader, SvgProxy } from 'react-svgmt';

export default class Train extends React.Component {
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
                    {this.state.lines.map((line) => {
                        return (
                            <div key={line.symbol}>
                                {line.summary}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}