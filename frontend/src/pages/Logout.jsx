import React from 'react';
import '../App.css';
import { useHistory } from 'react-router-dom';
import API from '../api';

function Logout() {
  const api = new API('http://localhost:5005');
  const storage = window.localStorage;
  const history = useHistory();
  const logoutFunction = (event) => {
    event.preventDefault();
    const Authorization = `Bearer ${storage.getItem('token')}`;
    api.post('admin/auth/logout', {
      headers: {
        Authorization,
      },
    }).then(() => {
      history.push('/login');
      storage.removeItem('token');
    });
  };

  return (
    <div className="row">
      <button className="logoutBtn col s12 btn waves-effect waves-light" type="button" onClick={logoutFunction}>Logout</button>
    </div>
  );
}
export default Logout;
