'use client';

import React, { useState } from 'react';
import axios from 'axios';

const ATSScorePage = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      setError('Please upload a resume.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/api/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAtsScore(response.data.ats_score);
      setError('');
    } catch (err) {
      setError('Failed to fetch ATS score. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="ats-container">
      <h1 className="ats-header">ATS Score</h1>
      <form className="ats-form" onSubmit={handleSubmit}>
        <div className="ats-input-container">
          <label className="ats-label">Resume (PDF):</label>
          <input type="file" className="ats-file-input" onChange={handleFileChange} accept=".pdf" />
        </div>
        <div className="ats-input-container">
          <label className="ats-label">Job Description:</label>
          <input
            type="text"
            className="ats-input"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter job description"
          />
        </div>
        <button type="submit" className="ats-submit-button">
          Submit
        </button>
      </form>

      {atsScore !== null && (
        <div className="ats-score">
          <h2>ATS Score: {atsScore}</h2>
        </div>
      )}

      {error && <div className="ats-error">{error}</div>}

      <style jsx>{`
        .ats-container {
          background-color: #f3f3f8;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        .ats-header {
          color: #6a0dad;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .ats-form {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }

        .ats-input-container {
          margin-bottom: 15px;
        }

        .ats-label {
          display: block;
          font-size: 1.1rem;
          color: #6a0dad;
          margin-bottom: 5px;
        }

        .ats-input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #6a0dad;
          border-radius: 5px;
          outline: none;
          box-sizing: border-box;
        }

        .ats-file-input {
          font-size: 1rem;
          padding: 8px;
          border: 1px solid #6a0dad;
          border-radius: 5px;
          background-color: #f3f3f8;
          color: #6a0dad;
        }

        .ats-submit-button {
          background-color: #6a0dad;
          color: white;
          font-size: 1.1rem;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .ats-submit-button:hover {
          background-color: #530b8c;
        }

        .ats-score {
          margin-top: 20px;
          font-size: 1.5rem;
          color: #6a0dad;
        }

        .ats-error {
          margin-top: 10px;
          color: red;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ATSScorePage;
