import React from 'react';

import Capture from './capture';

export default class Headline extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            dateOptions: {"weekday": "short", "year": "2-digit", "month": "2-digit", "day": "2-digit", "hour": "numeric", "minute": "numeric", "hour12": true}
        }
        this.parseDate = this.parseDate.bind(this);
    }

    parseDate(date){
        var date = new Date(date);
        return date.toLocaleDateString('en-US', this.state.dateOptions);
    }

    render(){
        var headline = this.props.headline;
        return(
            <div className="headlineVersion">
                <div className="row">
                    <div className="col-12">
                        <h5 className="homeHeader">{headline.headline}</h5>
                        <p><small>
                            {headline.versions.length} Capture{headline.versions.length > 1 ? 's from' : ' on'} {this.parseDate(headline.firstSeen)} {headline.versions.length > 1 ? '- ' +  this.parseDate(headline.lastSeen) : ''}
                        </small></p>
                        <p><a data-toggle="collapse" href={"#" + headline.head_id + "_captures"}>See Capture Data</a></p>
                        <div className="collapse" id={headline.head_id + "_captures"}>
                            {headline.versions.map((version) =>
                                <Capture key={version.uuid} capture={version}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
