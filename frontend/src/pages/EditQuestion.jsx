/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import '../App.css';
import API from '../api';
import Logout from './Logout';

function Question() {
  const url = window.location.href.split('/');
  const quizId = url[url.length - 2];
  const questionId = url[url.length - 1];
  const choices = [];
  const [questionList, setQuestionList] = useState('');

  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('');
  const [point, setPoint] = useState('');
  const [optionNum, setOptionNum] = useState('');
  const [answers, setAnswer] = useState([]);
  const [src, setSrc] = useState('');
  const [link, setLink] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;
    api.get(`admin/quiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
      },
      quizId,
    }).then((res) => {
      setQuestionList(res.questions);
      const current = res.questions[questionId];
      setQuestion(current.name);
      setDuration(current.time);
      setPoint(current.point);
      setType(current.type);
      setOptionNum(current.optionNum);
    });
  }, [quizId, questionId]);

  function selectChoice() {
    for (let i = 0; i < optionNum; i += 1) {
      choices.push(
        <div key={`choice${i}`}>
          <input type="text" name="choiceText" placeholder="please fill choice here" required="required" />
          <label htmlFor={`checkbox${i}`}>
            <input
              id={`checkbox${i}`}
              type="checkbox"
              name="choiceCheck"
              onClick={(e) => {
                if (e.target.checked === true) {
                  setCount(count + 1);
                }
                if (e.target.checked === false) {
                  setCount(count - 1);
                }
              }}
            />
            <span>Tick if this is a correct answer</span>
          </label>
        </div>,

      );
    }
  }

  function createdAnswer(title, checked) {
    const answer = {
      title,
      correct: checked,
    };
    return answer;
  }

  function updateQuestion() {
    const data = {
      name: question,
      type,
      point,
      time: duration,
      optionNum,
      img: src,
      url: link,
      answers,
    };
    return data;
  }

  function update(newAnswer) {
    const data = updateQuestion(newAnswer);
    questionList[questionId] = data;
    const api = new API('http://localhost:5005');
    const storage = window.localStorage;

    const body = {
      questions: questionList,
    };

    api.put(`admin/quiz/${quizId}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${storage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      quizId,
    }).then(() => {
      alert('Update Success');
    });
  }

  function getChoice() {
    const fm = document.forms[0];
    const titles = fm.elements.choiceText;
    const checks = fm.elements.choiceCheck;
    const flag = type;

    if (count === 0) {
      alert('Please select correct answer');
      fm.reset();
      setCount(0);
      return;
    }
    if (flag === 'single' && count > 1) {
      alert('Please select only one correct answer');
      fm.reset();
      setCount(0);
      return;
    }
    if (flag === 'multiple' && count === 1) {
      alert('Please select more correct answers');
      fm.reset();
      setCount(0);
      return;
    }

    const newAnswers = [];
    for (let i = 0; i < optionNum; i += 1) {
      const title = titles[i].value;
      const { checked } = checks[i];
      if (title === '') {
        alert('answer cannot be empty');
        setAnswer([]);
        return;
      }
      const answer = createdAnswer(title, checked);
      answers.push(answer);
    }
    setCount(0);
    fm.reset();
    setAnswer(newAnswers);
    update();
  }

  function readFile(e) {
    const FR = new FileReader();
    FR.addEventListener('load', (x) => {
      const { result } = x.target;
      document.getElementById('imgQuestion').src = result;
      setSrc(result);
    });
    FR.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className="editQuestion container">
      <Logout />
      <h1>Edit Question</h1>
      <p>Change question name</p>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <p>Set a duration in second</p>
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <p>Set question point</p>
      <input type="number" value={point} onChange={(e) => setPoint(e.target.value)} />
      <p>Choose question type</p>
      <div id="radio" className="input-field col s12">
        <select id="questionType" className="browser-default" onChange={(e) => setType(e.target.value)}>
          Choose number of questions
          <option>Single Question</option>
          <option>Multiple Question</option>
        </select>
      </div>
      <p>Choose number of choices</p>
      <button type="button" aria-label="minus" onClick={() => { if (optionNum > 2) { setOptionNum(optionNum - 1); } }}>&minus;</button>
      <span>{optionNum}</span>
      <button type="button" aria-label="add" onClick={() => { if (optionNum < 6) { setOptionNum(optionNum + 1); } }}>&#43;</button>
      <p>Set question choices and correct answer(s)</p>
      {selectChoice()}
      <form>
        { choices }
      </form>
      <p>Upload a image</p>
      <input type="file" onChange={(e) => readFile(e)} />
      <br />
      <img id="imgQuestion" alt="upload" />
      <br />
      <p>Add a url</p>
      <input type="text" value={link} placeholder="Enter link for video if any" onChange={(e) => setLink(e.target.value)} />
      <br />
      <button type="submit" onClick={() => getChoice()}>save</button>
    </div>
  );
}

export default Question;
