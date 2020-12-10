import React, { useState, useEffect } from 'react';
import '../App.css';
import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {
  Link,
} from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Logout from './Logout';
import API from '../api';
import Edit from './EditGame';
import StopGame from './StopGame';
import '../pages.css';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    pading: theme.spacing(2, 4, 3),
  },
}));

let file;
function readFile(e) {
  if (!e.target.files || !e.target.files[0]) { return; }
  const FR = new FileReader();
  FR.readAsText(e.target.files[0], 'gbk');
  FR.addEventListener('load', (x) => {
    const { result } = x.target;
    file = result;
  });
}

function uploadJson() {
  // console.log(file);
  const json = JSON.parse(file);
  // console.log(json);
  const quizName = json.name;
  const { questions } = json;
  const { thumbnail } = json;
  const api = new API('http://localhost:5005');
  const storage = window.localStorage;
  api.post('admin/quiz/new', {
    body: JSON.stringify({
      name: quizName,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storage.getItem('token')}`,
    },
  });

  api.get('admin/quiz', {
    headers: {
      Authorization: `Bearer ${storage.getItem('token')}`,
    },
  }).then((res) => {
    const upload = res.quizzes.pop();
    const { id } = upload;

    const body = {
      questions,
      quizName,
      thumbnail,
    };
    api.put(`admin/quiz/${id}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      id,
    });
    window.location.reload();
  });
}
function CreateGameModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [newName, setNewName] = useState('');
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        <TextField
          id="standard-basic"
          label="New Game Name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <br />
        <button
          type="submit"
          onClick={() => {
            const api = new API('http://localhost:5005');
            const storage = window.localStorage;
            api.post('admin/quiz/new', {
              body: JSON.stringify({
                name: newName,
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storage.getItem('token')}`,
              },
            });
          }}
        >
          Create
        </button>
      </form>
      <input className="col-s12" type="file" id="upload" onChange={(e) => readFile(e)} />
      <button
        type="submit"
        onClick={() => uploadJson()}
      >
        submit file
      </button>
    </div>
  );

  return (
    <div>
      <div className="row">
        <button type="button" className="createBtn col s12  btn waves-effect waves-light" onClick={handleOpen}>
          Create New Game
        </button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

// Replace this function
function EditGame({ id }) {
  return (
    <Edit quizid={id} />
  );
}
EditGame.propTypes = {
  id: PropTypes.string.isRequired,
};

function DeleteGame({ id }) {
  const api = new API('http://localhost:5005');
  const storage = window.localStorage;
  api.delete(`admin/quiz/${id}`, {
    headers: {
      Authorization: `Bearer ${storage.getItem('token')}`,
    },
  });
}

// modal for start
function StartGameModal({ id }) {
  const storage = window.localStorage;
  storage.setItem('quizId', id);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [session, setSession] = React.useState(0);
  const handleOpen = () => {
    setOpen(true);
    const api = new API('http://localhost:5005');

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
      setSession(res.active);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div id="popup" style={modalStyle} className={classes.paper}>
      <form>
        <p>
          The Game Id:
          {id}
        </p>
        <p>
          Session Id:
          {session}
        </p>
        <CopyToClipboard text={`http://localhost:3000/play/${session}`}>
          <button type="button" onClick={() => alert('Successfully copy url to clipboard')}>Copy to clipboard</button>
        </CopyToClipboard>
        <br />
      </form>
    </div>
  );

  return (
    <div>
      <button className="cardBtn btn waves-effect waves-light" type="button" onClick={handleOpen}>
        Start this game!
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

StartGameModal.propTypes = {
  id: PropTypes.number.isRequired,
};

export function GameCard({ id, name, thumbnail }) {
  const [question, setQuestions] = useState({});
  useEffect(() => {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;
    api.get(`admin/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    }).then((res) => setQuestions(res.questions));
  }, [id]);

  // calculate the total time of the game
  let totalTime = 0;
  Object.keys(question).forEach((key) => {
    const { time } = question[key];
    totalTime += parseInt(time, 10);
  });

  return (
    <div className="card" style={{ border: 'solid 1px' }}>
      <p className="title">
        Titile:
        {name}
      </p>
      <p className="id">
        id:
        {id}
      </p>
      <p className="numQuestion">
        Number of Question:
        {question.length}
      </p>
      <p className="numQuestion">
        Total time:
        {totalTime}
      </p>
      <img
        src={thumbnail}
        alt="thumbnail"
        className="col s12 m6 l6"
      />
      <br />
      <Link to={`/edit/${id}/`} className="avatar">
        <button className="cardBtn btn waves-effect waves-light" type="button" onClick={() => EditGame({ id })}>Edit</button>
      </Link>

      <form>
        <button className="cardBtn btn waves-effect waves-light" type="submit" onClick={() => DeleteGame({ id })}>Delete</button>
      </form>
      <StartGameModal id={id} />
      <StopGame id={id} />
    </div>
  );
}

GameCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

function Dashboard() {
  const [data, setData] = useState('');
  useEffect(() => {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;
    api.get('admin/quiz', {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    }).then((res) => setData(res.quizzes));
  }, []);

  const gameCards = [];
  Object.keys(data).forEach((key) => {
    const { id } = data[key];
    const { name } = data[key];
    const { thumbnail } = data[key];
    gameCards.push(
      <GameCard key={`card${id}`} id={id} name={name} thumbnail={thumbnail} />,
    );
  });
  return (
    <div>
      <Logout />
      <h1 id="slogan" className="hide-on-med-and-down">Welcome to Dashboard!</h1>
      <CreateGameModal />
      <div className="card-container s12 m6 l6">
        {gameCards}
      </div>

    </div>
  );
}

export default Dashboard;
