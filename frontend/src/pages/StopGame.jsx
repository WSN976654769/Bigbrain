import React from 'react';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
import API from '../api';

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
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function StopGame(prop) {
  const { id } = prop;
  const classes = useStyles();
  const api = new API('http://localhost:5005');
  const storage = window.localStorage;
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  // get the session id before stop
  // eslint-disable-next-line no-unused-vars
  const [session, setSession] = React.useState(0);

  const handleOpen = () => {
    setOpen(true);
    // console.log('show modal button and stop', id);
    api.get(`admin/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    }).then((res) => {
      setSession(res.active);
    });
    api.post(`admin/quiz/${id}/end`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <p id="simple-modal-description">
        Would you like to view the results?
      </p>
      <Link to={`/result/${localStorage.getItem('session')}/`} className="avatar">
        <button
          type="button"
          onClick={() => {
            const currentSession = localStorage.getItem('session');
            api.get(`admin/session/${currentSession}/results`, {
              headers: {
                Authorization: `Bearer ${storage.getItem('token')}`,
              },
            });
          }}
        >
          YES
        </button>
      </Link>
    </div>
  );

  return (
    <div className="StopGame">
      <button
        className="cardBtn btn waves-effect waves-light"
        type="button"
        onClick={() => {
          handleOpen();
        }}
      >
        STOP THIS GAME
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
