import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

const Contact = () => (
    <div className="container">
        <Helmet>
            <title>Headliner: Contact</title>
        </Helmet>
        <div className="row">
            <div className="col-12 contactInfo text-center">
                <h1 className="homeHeader">Contact</h1>
                <h6 className="homeSubHeader"><Link className="nav-link" to="/">Home</Link>|<Link className="nav-link" to="/about">About</Link></h6>

            </div>
        </div>
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 contactInfo">
                <p>Questions/Comments on this project? Email me at <a href="mailto:mike@mikebenowitz.com">mike at mikebenowitz.com</a>.</p>
                <p>If you have feedback on a glitch or would like to request a feature for Headliner, please create an issue on one of these Github projects:</p>
                <p>For the API or headliner scraper<br/><a href="https://github.com/mwbenowitz/headliners/issues" target="_blank">headliner issues</a></p>
                <p>For issues with this site<br/><a href="https://github.com/mwbenowitz/headliner-front/issues" target="_blank">headliner-site issues</a></p>
            </div>
        </div>
    </div>
)

export default Contact
