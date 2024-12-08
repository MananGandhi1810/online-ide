import React, { useState } from 'react';
import axios from 'axios';

const UploadProblem = () => {
  const [form, setForm] = useState({ title: '', description: '', input: '', output: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/problem/upload', form);
    // handle post-upload tasks (e.g., showing success message)
  };

  return (
    <div>
      <h1>Upload New Problem</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleInputChange} />
        <textarea name="description" placeholder="Description" onChange={handleInputChange}></textarea>
        <textarea name="input" placeholder="Input" onChange={handleInputChange}></textarea>
        <textarea name="output" placeholder="Output" onChange={handleInputChange}></textarea>
        <button type="submit">Upload Problem</button>
      </form>
    </div>
  );
};

export default UploadProblem;