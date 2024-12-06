import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/config';

function PostForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Will be undefined for new posts
  const isEditing = Boolean(id);

  useEffect(() => {
    // If editing, fetch existing post data
    if (isEditing) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/posts/${id}`);
          const { title, content, tags } = response.data;
          setFormData({
            title,
            content,
            tags: tags?.join(', ') || ''
          });
        } catch (err) {
          setError('Failed to fetch post data');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags
          ? formData.tags.split(',').map(tag => tag.trim())
          : []
      };

      let response;
      if (isEditing) {
        response = await api.put(`/posts/${id}`, postData);
      } else {
        response = await api.post('/posts', postData);
      }

      navigate(`/post/${response.data._id}`, {
        state: { message: `Post ${isEditing ? 'updated' : 'created'} successfully` }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse max-w-2xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              minLength="10"
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate tags with commas (e.g., technology, programming, web)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm; 