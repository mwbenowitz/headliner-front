import React from 'react';
import {Helmet} from 'react-helmet';

const Contact = () => (
    <div className="container">
        <Helmet>
            <title>Mike Benowitz: Contact</title>
        </Helmet>
        <div className="col-12 contactInfo">
            <h1>Contact Me</h1>
            <p>To contact me email me at <a href="mailto:mike@mikebenowitz.com">mike at mikebenowitz.com</a>. I am also (infrequently) on:</p>
            <a href="https://twitter.com/mwbenowitz" target="_blank">Twitter</a><br/>
            <a href="https://www.instagram.com/mikebenowitz/" target="_blank">Instagram</a><br/>
            <a href="https://www.linkedin.com/in/michael-benowitz-68b29827" target="_blank">LinkedIn</a>
        </div>
    </div>
)

export default Contact
