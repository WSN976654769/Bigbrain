import React from 'react';
import '../App.css';
import { useHistory } from 'react-router-dom';
import API from '../api';
import '../materialize/css/materialize.min.css';
import '../materialize/js/materialize.min';
import '../pages.css';

export const Login = () => {
  const api = new API('http://localhost:5005');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [token, setToken] = React.useState('');
  const storage = window.localStorage;
  const history = useHistory();

  const loginFunction = async (event) => {
    event.preventDefault();
    try {
      const data = await api.post('admin/auth/login', {
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(data);// token
      setToken(data.token);
      storage.setItem('token1', token);
      storage.setItem('token', data.token);
      // console.log(storage.getItem('token'));
      history.push('/dashboard');
    } catch (err) {
      alert(err);
    }
  };
  // console.log(token);

  return (
    <div className="container">
      <form>
        <div className="row mb-2">
          <div className="input-field col s12">
            <label className="labelLogin col s12" htmlFor="email">
              Email:
              <input type="text" value={email} name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
        </div>
        <br />
        <div className="row mb-2">
          <div className="input-field col s12">
            <label className="labelLogin col s12" htmlFor="password">
              Password:
              <input
                type="password"
                value={password}
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="row mt-1">
          <button id="loginBtn" className="btn waves-effect waves-light col s10 offset-s1" type="submit" name="action" onClick={loginFunction}>
            Log In
          </button>
        </div>

      </form>
    </div>
  );
};

export default Login;
