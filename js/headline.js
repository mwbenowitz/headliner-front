import React from 'react';

import Capture from './capture';

export default class Headline extends React.Component{

    render(){
        var headline = this.props.headline;
        return(
            <div className="headlineVersion">
                <div className="row">
                    <div className="col-12">
                        <h5 className="homeHeader">{headline.headline}</h5>
                        <p><small>{headline.versions.length} Capture{headline.versions.length > 1 ? 's' : ''} from {headline.firstSeen} - {headline.lastSeen}</small></p>
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
