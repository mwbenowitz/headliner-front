import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

const About = () => (
    <div className="container">
        <Helmet>
            <title>Headliner: About</title>
        </Helmet>
        <div className="row">
            <div className="col-12 contactInfo text-center">
                <h1 className="homeHeader">About Headliner</h1>
                <h6 className="homeSubHeader"><Link className="nav-link" to="/">Home</Link>|<Link className="nav-link" to="/contact">Contact</Link></h6>

            </div>
        </div>
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 contactInfo">
                <h4>What it Does</h4>
                <p>Headliner is a service that scrapes the homepages of 10 major news sources for all article headlines every 15 minutes. It stores each along with a link to the associated article and metadata describing its size and position on the page. This data is then made accessible through an API (and the search platform on this site) for anyone interested in seeing how different news organizations covered different topics.</p>
                <hr/>
            </div>
        </div>
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 contactInfo">
                <h4>Why make this?</h4>
                <p>I was curious about what information could be gathered with simple web scraping tools from news organizations. I believe the resulting database is of interest to anyone curious about how different news outlets cover different topics and allows them to see the differences in tone and focus between these organizations.</p>
                <hr/>
            </div>
        </div>
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 contactInfo">
                <h4>Sites Currently Included</h4>
                <ul>
                    <li>The New York Times</li>
                    <li>The Wall Street Journal</li>
                    <li>The Washington Post</li>
                    <li>Fox News</li>
                    <li>CNN</li>
                    <li>NPR</li>
                    <li>USA Today</li>
                    <li>The Houston Chronicle</li>
                    <li>The Chicago Tribune</li>
                    <li>The LA Times</li>
                </ul>
                <hr/>
            </div>
        </div>
        <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 contactInfo">
                <h4>About Me</h4>
                <p>My name is Mike Benowitz and I am a librarian/developer working for <a href="http://collectiveaccess.org" target="_blank">CollectiveAccess</a>.</p>
                <hr/>
            </div>
        </div>
    </div>
)

export default About
