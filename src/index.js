import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import createHistory from 'history/createBrowserHistory'
import {Router, Route} from 'react-router';
import App from './App';
// import asset start
import AssetApp from './asset/AssetApp';
import About from './asset/About';
import Login from './asset/Login';
// import asset end
import registerServiceWorker from './registerServiceWorker';

const history = createHistory();

ReactDOM.render(
    <Router history={history}>
        <div>
            <Route exact path="/" component={AssetApp}/>
            <Route path="/login" component={Login}/>
            <Route path="/about" component={About}/>
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
