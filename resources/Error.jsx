import React from 'react';

export default class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    toTop = () => {
        window.location.href = '/';
    }

    render = () => {
        const { error, info } = this.props;
        return (
            <div className="error-wrapper">
                <div className="error-stripe" />
                <svg className="error-uc-icon" version="1.1" id="_x32_"x xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                    <g>
                        <path className="st0" d="M509.676,461.364l-32.74-51.559c-3.224-6.574-10.953-10.875-19.531-10.875h-23.424l-18.129-45.117H96.146
                            L78.016,398.93H54.594c-8.574,0-16.301,4.301-19.527,10.875L2.328,461.364c-3.969,8.066-2.808,17.23,3.064,24.457
                            c5.865,7.215,15.701,11.551,26.221,11.551h161.192h126.383h161.203c10.52,0,20.348-4.336,26.221-11.551
                            C512.483,478.594,513.637,469.43,509.676,461.364z"></path>
                        <path className="st0" d="M331.809,144.625L288.362,36.508c-5.311-13.219-18.119-21.879-32.366-21.879
                            c-14.242,0-27.051,8.66-32.359,21.879l-31.606,78.649l-11.842,29.23h0.096l-0.096,0.238H331.809z"></path>
                        <polygon className="st0" points="124.254,283.844 124.158,284.086 387.838,284.086 359.82,214.352 152.172,214.352 131.84,264.965 
                            124.158,283.844"></polygon>
                    </g>
                </svg>
                <p className="error-content">
                申し訳ございません。<br />
                どうやらエラーが発生してしまったようです。
                </p>
                <p className="error-reload-btn" onClick={this.toTop}>トップページへ戻る</p>
                <code className="error-detail">
                    {error && error.message ? error.message : ''}
                    <hr />
                    {info ? JSON.stringify(info) : ''}
                </code>
                <div className="error-stripe" />
            </div>
        )
    }
}