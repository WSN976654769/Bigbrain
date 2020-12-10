import React from 'react';
import '../App.css';
import API from '../api';

export default function StartGame1(id) {
  const api = new API('http://localhost:5005');
  const storage = window.localStorage;

  // begin a game, the active is not null.
  fetch(`http://localhost:5005/admin/quiz/${id}/start`, {
    headers: {
      Authorization: `Bearer ${storage.getItem('token')}`,
    },
    method: 'POST',
  });

  api.get(`admin/quiz/${id}`, {
    headers: {
      Authorization: `Bearer ${storage.getItem('token')}`,
    },
  }).then((res) => {
    alert(`The seesion ID of Game${id} is ${res.active}`);
  });

  return (
    <div>
      <h1>Start</h1>
    </div>
  );
}
