import React from 'react';
import {HashRouter as Router, Link, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import 'bootstrap';
import App from './app';
import gaTracker from './tracker.js';
import conf from './../config.json';

ReactDOM.render((
    <Router>
        <Route component={gaTracker(App)} />
    </Router>
), document.getElementById('root'));
