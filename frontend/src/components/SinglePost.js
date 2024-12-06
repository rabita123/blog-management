import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/config';

function SinglePost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4">
        <span className="text-gray-600">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex gap-4">
        <button onClick={() => navigate(`/edit/${post._id}`)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default SinglePost; 