import React from 'react';
import '../App.css';
import { useHistory } from 'react-router-dom';
import API from '../api';

function Register() {
  const history = useHistory();
  const api = new API('http://localhost:5005');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const storage = window.localStorage;

  const submitRegister = async () => {
    if (confirmPassword !== password) {
      alert('Password inconsistent!');
    } else if (email === 0 || name === 0) {
      alert('Email and name can not be empty!');
    } else {
      const data = {
        email,
        password,
        name,
      };
      try {
        const d = await api.post('admin/auth/register', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        storage.setItem('token', d.token);
        history.push('/dashboard');
      } catch (err) {
        alert(err);
      }
    }
  };
  return (
    <div id="reg-con" className="container">
      <b className="regInf">Name</b>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <b className="regInf">Password</b>
      <input type="password" id="inputPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <b className="regInf">Confirm password</b>
      <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <br />
      <b className="regInf">Email</b>
      <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      <button id="regBtn" className="waves-effect waves-light btn" type="submit" onClick={submitRegister}>Register</button>
    </div>
  );
}

export default Register;
