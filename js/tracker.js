import React from 'react';
import ReactGA from 'react-ga';
import conf from './../config.json';
ReactGA.initialize(conf.gaID);

const gaTracker = (Wrapped) => {
    const trackPage = (page) => {
        ReactGA.set({ page });
        ReactGA.pageview(page);
    };
    const HOC = (props) => {
        const page = props.location.pathname
	trackPage(page);
	
	return (
	    <Wrapped {...props} />
	);
    };

    return HOC;
};

export default gaTracker;
