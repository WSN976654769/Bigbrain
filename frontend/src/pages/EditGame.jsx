import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import '../pages.css';
import {
  Link,
} from 'react-router-dom';
import Question from './EditQuestion';
import API from '../api';
import Logout from './Logout';

function Edit() {
  const url = window.location.href.split('/');
  const quizid = url[url.length - 2];

  const list = [];
  const [quiz, setQuiz] = useState('');
  const [questions, setQuestion] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;
    api.get(`admin/quiz/${quizid}`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
      quizid,
    }).then((res) => {
      setQuiz(res);
      setQuestion(res.questions);
      setTitle(res.name);
      setThumbnail(res.thumbnail);
    });
  }, [quizid]);

  function update() {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;
    quiz.questions = questions;

    const body = {
      questions,
      title,
      thumbnail,
    };
    api.put(`admin/quiz/${quizid}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      quizid,
    });
  }

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;

    const body = {
      questions,
      title,
      thumbnail,
    };
    api.put(`admin/quiz/${quizid}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      quizid,
    });
  }, [questions, quiz, quizid, thumbnail, title]);
  function deleteQuestion(key) {
    questions.splice(key, 1);
    update();
    window.location.reload();
  }
  function EditQuestion({ key }) {
    return (
      <Question questionId={key} />
    );
  }
  EditQuestion.propTypes = {
    key: PropTypes.number.isRequired,
  };

  function loadQuestion() {
    if (questions != null) {
      Object.keys(questions).forEach((key) => {
        const { name } = questions[key];
        list.push(
          <div key={`question${key}`}>
            <span className="questionName" value={name}>{name}</span>
            <div className="row">
              <Link to={`/edit/${quizid}/${key}`} className="avatar">
                <button className="waves-effect waves-light btn" type="submit" onClick={() => EditQuestion(key)}>Edit</button>
              </Link>
              {' '}
              <button className="waves-effect waves-light btn" type="submit" onClick={() => deleteQuestion(key)}>Delete</button>
            </div>
          </div>,
        );
      });
    }
  }

  // defalut props for new question
  function newQuestion() {
    const data = {
      name: 'New question, please edit it',
      type: 'single',
      point: 10,
      time: 5,
      optionNum: 4,
      img: null,
      url: null,
      answers: [],
    };
    return data;
  }

  function readFile(e) {
    if (!e.target.files || !e.target.files[0]) { return; }
    const FR = new FileReader();
    FR.addEventListener('load', (x) => {
      const { result } = x.target;
      document.getElementById('imgDisplay').src = result;
      setSrc(result);
    });
    FR.readAsDataURL(e.target.files[0]);
  }
  return (
    <div>
      <Logout />
      <div className="quiz">
        <h1>
          Quiz Title:
          {title}
        </h1>
        <div className="questions">
          <i><h3>Questions:</h3></i>
          {loadQuestion()}
          { list }
          <div className="addQuestion">
            <p id="addQ">Click button below to add a question, then you could edit it.</p>
            <div className="row">
              <button
                type="submit"
                id="btnAddQ"
                className="waves-effect waves-light btn col s12 "
                onClick={() => {
                  const data = newQuestion();
                  questions.push(data);
                  alert('Added success! Pleases click edit button to set question answers.');
                  update();
                  window.location.reload();
                }}
              >
                Add a new Question
              </button>
            </div>
            <img id="thumbnailImg" className="col-s10 offset-s1" src={thumbnail} alt="img" />
          </div>
        </div>
      </div>

      <div className="editQuiz">
        <i><h2>Edit Quiz!</h2></i>
        <form action="#">
          <div className="file-field input-field">
            <p id="textThumbnail">Update an Thumbnail</p>
            <div id="btnForThumbnail" className="btn">
              <span id="btnUpdateThumbnail">Update an image as thumbnail</span>
              <input className="col-s12" type="file" id="upload" onChange={(e) => readFile(e)} />
            </div>
            <div id="thumbnailText" className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </form>
        <div id="thumbnailUploaded" className="row">
          <img id="imgDisplay" alt="upload" />
        </div>
        <button
          className="waves-effect waves-light btn"
          type="submit"
          onClick={() => {
            if (src === '') {
              alert('Please choose an image!');
              return;
            }
            setThumbnail(src);
            alert('Change success!');
            update();
          }}
        >
          submit
        </button>
      </div>
      <br />
    </div>
  );
}

export default Edit;
