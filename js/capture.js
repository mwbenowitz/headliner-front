import React from 'react';

export default class Capture extends React.Component{

    render(){
        var capture = this.props.capture;
        return(
            <div className="captureRow">
                <div className="row">
                    <div className="col-12">
                        <h6 className="captureHead">{capture.time}</h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <h6 className="captureSubHead">Size</h6>
                        <div className="row">
                            <div className="col-6">
                                <p><small>Height: {capture.size.height}</small></p>
                            </div>
                            <div className="col-6">
                                <p><small>Width: {capture.size.width}</small></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        <h6 className="captureSubHead">Position</h6>
                        <div className="row">
                            <div className="col-6">
                                <p><small>x: {capture.pos.x}</small></p>
                            </div>
                            <div className="col-6">
                                <p><small>y: {capture.pos.y}</small></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <h6 className="captureSubHead">Score</h6>
                        <p><small>{capture.score}</small></p>
                    </div>
                </div>
            </div>
        );
    }
}
