import React from 'react';

import Headline from './headline';

export default class Article extends React.Component{

    render(){
        var article = this.props.article;
        return(
            <div className="col-12">
                <div className="card article-card">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-12">
                                        <h6 className="card-title">{article.source} (<a href={article.link} target="_blank">See Article</a>)</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        {article.headlines.map((headline) =>
                                            <Headline key={headline.head_id} headline={headline}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-12 text-right">
                                        <h6>Start<br/>{article.firstSeen}<br/>End<br/>{article.lastSeen}</h6>
                                        <h6>Average Score<br/>{article.avgScore}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
