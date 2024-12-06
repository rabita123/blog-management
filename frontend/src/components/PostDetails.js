import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/config';

function PostDetails() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.status === 404 
            ? 'Post not found' 
            : 'Error loading post'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      navigate('/', { state: { message: 'Post deleted successfully' } });
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <Link to="/" className="text-red-700 underline mt-2 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto p-4">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <div>
              <time dateTime={post.createdAt}>
                Posted on {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.createdAt !== post.updatedAt && (
                <span className="ml-2 text-sm">
                  (Updated: {new Date(post.updatedAt).toLocaleDateString()})
                </span>
              )}
            </div>
            {post.author && (
              <span>By {post.author.name || 'Unknown Author'}</span>
            )}
          </div>
        </header>

        <div className="prose max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-4">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700"
          >
            ← Back to Posts
          </Link>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Post
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Post
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default PostDetails; 