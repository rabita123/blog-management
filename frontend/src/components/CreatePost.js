import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/posts', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        author: '64f5c3d7e2c63f2b4c8e1234' // Temporary hardcoded author ID
      });
      navigate(`/post/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="6"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost; 