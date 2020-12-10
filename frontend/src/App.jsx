import React from 'react';
import './App.css';
import './pages.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import './materialize/css/materialize.min.css';
import './materialize/js/materialize.min';
import Register from './pages/Register';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import GetResult from './pages/GetResult';
import Play from './pages/Play';

function App() {
  // const quizid = 209268501;
  // const quizid = 859665084;
  return (
    <Router>
      <div>
        <nav>
          <div className="nav-wrapper col-12">
            <span href="#" className="brand-logo right hide-on-med-and-down">BigBrain!</span>
            <ul id="nav-mobile" className="left ">
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
        </nav>
        <hr />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/edit/:id" component={() => <EditGame />} />
          <Route exact path="/edit/:id/:questionId" component={() => <EditQuestion />} />
          <Route exact path="/play/:session" component={() => <Play />} />
          <Route exact path="/result/:session" component={() => <GetResult />} />
          <Route path="/">
            <Register />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
