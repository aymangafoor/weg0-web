import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch, } from "react-router-dom";
import Hotel from './hotel'
import Home from './home'

class App extends Component {
  render() {
      return (
        <Router>
          <div className='container'>
            
            
            <div className='tab'>
                <h1 className='logo'>We Go</h1>
                <Link className='link' to="/">Home</Link>
                <Link className='link' to="/hotel">Hotels</Link>
                <Link className='link' to="/about">About</Link>
                </div>

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/hotel" component={Hotel} />
              <Route path="/about" component={About} />

            </Switch>
          </div>
        </Router>

        )
  }
}export default App;

const About = () => (
        <div className='about'>
          <h2 className='heading'>About</h2>
          <p className='para'>We help users to plan their trip by giving tourist places information from any location in India. We also provide information about hotel for stay</p>
        </div>
);