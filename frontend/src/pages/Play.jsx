import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Container,
} from '@material-ui/core';
import API from '../api';
import '../pages.css';

export default function Play() {
  const api = new API('http://localhost:5005');
  const getUrl = window.location.href.split('/');
  const sessionId = getUrl[getUrl.length - 1];
  const storage = window.localStorage;
  const quizId = storage.getItem('quizId');
  const [valid, setValid] = useState(false);
  const [seeResult, setSeeResult] = useState(false);
  const [questions, setQuestion] = useState('');
  const [playerId, setPlayerId] = useState('');

  function removeAnswer(userAnswers, id) {
    const index = userAnswers.indexOf(id);
    if (index > -1) {
      userAnswers.splice(index, 1);
    }
  }
  function submitAnswers(userAnswers, type) {
    if (userAnswers.length === 0) {
      alert('Please choose answer');
      return;
    }
    if (type === 'single' && userAnswers.length > 1) {
      alert('You can only choose one answer');
      return;
    }
    const body = {
      answerIds: userAnswers,
    };
    api.put(`play/${playerId}/answer`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      quizId,
    }).then(() => {
      alert('submit success');
    });
    document.getElementById('submitButton').style.display = 'none';
  }
  async function showResult(answers) {
    const correctAnswers = [<h3 key={`${answers}`}>Correct Result</h3>];
    try {
      const res = await api.get(`play/${playerId}/answer`, {
        headers: {
          Authorization: `Bearer ${storage.getItem('token')}`,
        },
      });
      Object.keys(res.answerIds).forEach((key) => {
        let index = res.answerIds[key];
        index = parseInt(index, 10);
        const correct = <li key={`correct${index}`}>{ answers[index].title }</li>;
        correctAnswers.push(correct);
      });
    } catch (err) {
      alert(err);
    }
    const result = (
      <div className="resultPart">
        {correctAnswers}
      </div>
    );
    ReactDOM.render(
      result,
      document.getElementById('result'),
    );
    document.getElementById('result').style.display = 'block';
  }

  function showQuestion(q) {
    const { answers } = q;
    const { optionNum } = q;
    const { time } = q;
    const { img } = q;
    const { url } = q;
    const userAnswers = [];
    const choices = [];
    for (let i = 0; i < optionNum; i += 1) {
      const choice = (
        <button
          key={`${q.name}${i}`}
          name={`answerButton${i}`}
          className="btn"
          type="submit"
          onClick={(e) => {
            if (e.target.className === 'btn') {
              e.target.className = 'btnActive';
              userAnswers.push(i);
            } else {
              e.target.className = 'btn';
              removeAnswer(userAnswers, i);
            }
          }}
        >
          {answers[i].title}
        </button>
      );
      choices.push(choice);
    }

    const media = [];
    if (img != null && img !== '') {
      const image = (
        <div key={`${img}`}>
          <img src={img} alt="img" />
        </div>
      );
      media.push(image);
    }
    if (url != null && url !== '') {
      const vedio = (
        <div key={`${url}`}>
          <p>If the video is embedded, you can see the video. </p>
          <p>Otherwise, click below link</p>
          <a href={url} target="_blank" rel="noreferrer">Visit the link to see more</a>
          <iframe
            title={url}
            width="640"
            height="520"
            src={url}
          />
        </div>
      );
      media.push(vedio);
    }

    const title = (
      <div className="playContainer">
        <h3>{q.name}</h3>
        <div>
          <p>
            {q.type}
            {' '}
            answer
            {' '}
          </p>
          <p>
            Time left:
            {' '}
            <b id="countdown">
              {time}
            </b>
          </p>
          <p>
            Point:
            {q.point}
            <br />
          </p>
        </div>
        <div className="playerContainer" id="choices" container spacing={3}>
          { choices }
          <br />
        </div>
        <br />
        <div>
          <button className="waves-effect waves-light btn" style={{ position: 'relative', left: 100 }} type="submit" id="submitButton" onClick={() => submitAnswers(userAnswers, q.type)}>submit</button>
        </div>
        <div>
          { media }
        </div>
      </div>
    );

    ReactDOM.render(
      title,
      document.getElementById('question'),
    );
    document.getElementById('submitButton').style.display = 'block';
    let duration = parseInt(time, 10) + 1;
    function countSecond() {
      if (duration > 0) {
        duration -= 1;
        document.getElementById('countdown').textContent = duration;
        setTimeout(() => countSecond(), 1000);
      } else {
        showResult(answers);
        document.getElementById('advance').style.display = 'block';
        document.getElementById('submitButton').style.display = 'none';
      }
    }
    countSecond();
  }

  async function advance() {
    api.post(`admin/quiz/${quizId}/advance`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    })
      .catch((err) => { alert(err); });
    // get current question
    try {
      const res = await api.get(`play/${playerId}/question`, {
        headers: {
          Authorization: `Bearer ${storage.getItem('token')}`,
        },
      });
      showQuestion(res.question);
    } catch (err) {
      alert('session finished');
      setSeeResult(true);
    }
  }

  function addPlayer(inputSessionId, inputName) {
    const data = {
      name: inputName,
    };

    api.post(`play/join/${inputSessionId}`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      setPlayerId(res.playerId);
      localStorage.setItem('session', inputSessionId);
      localStorage.setItem('playerId', res.playerId);
    })
      .catch((err) => { alert(err); alert('Please wait admin  stop the game and restart it.'); });
  }

  function checkActive() {
    const inputSessionId = document.getElementById('inputSessionId').value;
    const inputName = document.getElementById('inputName').value;

    api.get(`admin/session/${inputSessionId}/status`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    }).then((res) => {
      if (res.active === false) {
        alert('This session has not begin yet');
      }
      if (inputName === '') {
        alert('Please enter a name');
        return;
      }
      if (inputSessionId === sessionId) {
        setValid(true);
        addPlayer(inputSessionId, inputName);
        setQuestion(res.results.questions);
      } else {
        window.location.replace(`http://localhost:3000/play/${inputSessionId}`);
      }
    })
      .catch((err) => {
        if (inputSessionId !== sessionId) {
          window.location.replace(`http://localhost:3000/play/${inputSessionId}`);
        } else {
          alert(err);
        }
      });
  }

  function Join() {
    return (
      <div className="join">
        <h3>Session ID</h3>
        <input id="inputSessionId" type="input" defaultValue={sessionId} />
        <h3>Enter your name</h3>
        <input type="input" id="inputName" />
        <br />
        <br />
        <button
          type="submit"
          className="btn"
          onClick={() => {
            checkActive();
          }}
        >
          Join
        </button>
      </div>
    );
  }

  function Game() {
    return (
      <div className="playContainer">
        <button
          id="advance"
          className="waves-effect waves-light btn"
          style={{ display: 'none' }}
          type="submit"
          onClick={(e) => {
            advance();
            e.target.style.display = 'none';
            document.getElementById('result').style.display = 'none';
          }}
        >
          advance
        </button>
        <br />
        <button
          id="advance"
          type="submit"
          className="bigStart"
          onClick={
          (e) => {
            e.target.style.display = 'none';
            advance();
            document.getElementById('result').style.display = 'none';
          }
          }
        >
          start
        </button>
        <Container maxWidth="sm" id="question">.</Container>
        <Container maxWidth="sm" id="result">.</Container>
      </div>
    );
  }

  function Result() {
    api.get(`play/${playerId}/results`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
    }).then((res) => {
      const list = [];
      let sum = 0;
      Object.keys(res).forEach((key) => {
        const consequence = res[key];
        const score = parseInt(questions[key].point, 10);
        let correct;
        if (consequence.correct) {
          correct = 'Correct';
          sum += parseInt(questions[key].point, 10);
        } else {
          correct = 'Incorrect';
        }
        const { answers } = questions[key];
        const { answerIds } = res[key];
        const selectedList = [];

        Object.keys(answerIds).forEach((x) => {
          const index = parseInt(answerIds[x], 10);
          const selected = answers[index];
          selectedList.push(<span>{selected.title}</span>);
        });
        const TotalScore = (
          <h2>
            Total Score:
            {' '}
            {sum}
          </h2>
        );

        ReactDOM.render(
          TotalScore,
          document.getElementById('score'),
        );

        const element = (
          <div className="eachResult" key={`result${key}`}>
            <h3>
              Q
              {' '}
              {parseInt(key, 10) + 1}
              {': '}
              <span>{questions[key].name}</span>
            </h3>
            <h3>
              score:
              {score}
            </h3>
            <div>
              <p>selected answers of user:</p>
              {selectedList}
            </div>
            <p>
              questionStartedAt:
              <span>{consequence.questionStartedAt}</span>
            </p>
            <p>
              answeredAt:
              <span>{consequence.answeredAt}</span>
            </p>
            <p>
              result:
              <span>{correct}</span>
            </p>
          </div>
        );
        list.push(element);
      });

      ReactDOM.render(
        list,
        document.getElementById('performance'),
      );
    });

    return (
      <div className="performance">
        <h1 id="score">Total score</h1>
        <div id="performance">
          Result
        </div>
      </div>
    );
  }
  return (
    <div>
      {!valid && !seeResult && <Join />}
      {valid && !seeResult && <Game />}
      {seeResult && <Result />}
    </div>
  );
}
