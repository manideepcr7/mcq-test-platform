import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TestPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selections, setSelections] = useState({});
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await axios.get(`/api/tests/${id}/questions`);
      setQuestions(data);
    };

    const askPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraEnabled(true);
      } catch (error) {
        alert('Camera and microphone permissions are required to take the test.');
      }
    };

    fetchQuestions();
    askPermissions();
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setSelections({ ...selections, [questionId]: answer });
  };

  const handleSubmit = async () => {
    const submissionData = {
      testId: id,
      selections: Object.keys(selections).map((key) => ({
        questionId: key,
        answer: selections[key],
      })),
    };

    await axios.post('/api/tests/submit', submissionData);
    navigate('/finish');
  };

  if (!cameraEnabled) {
    return <p>Please enable camera and microphone permissions to proceed.</p>;
  }

  return (
    <div>
      <h1>MCQ Test</h1>
      {questions.length > 0 && questions.map((question, idx) => (
        <div key={question._id}>
          <h2>{`Question ${idx + 1}`}</h2>
          <p>{question.questionText}</p>
          {question.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name={question._id}
                value={option}
                onChange={() => handleAnswerChange(question._id, option)}
              />
              {option}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Test</button>
    </div>
  );
};

export default TestPage;
