import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/config';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Auth token:', token);
        
        const response = await api.get(`/posts?page=${page}&limit=5`);
        console.log('Posts response:', response.data);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse border rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No posts found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map(post => (
          <article 
            key={post._id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link 
                  to={`/post/${post._id}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="font-medium">
                  By {post.author?.username || 'Unknown'}
                </span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                {post.views > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{post.views} views</span>
                  </>
                )}
                {post.likes > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{post.likes} likes</span>
                  </>
                )}
              </div>

              <div className="prose max-w-none mb-4">
                <p className="text-gray-600 line-clamp-3">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  to={`/post/${post._id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read more 
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList; 