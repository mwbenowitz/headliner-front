import React from 'react';
import {HashRouter as Router, Link, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import 'bootstrap';
import App from './app';


ReactDOM.render((
    <Router>
        <App />
    </Router>
), document.getElementById('root'));
