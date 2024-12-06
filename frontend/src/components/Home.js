import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostList from './PostList';

function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Our Blog Platform
            </h1>
            <p className="text-xl mb-8">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            {!user && (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          {user && (
            <Link
              to="/new-post"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Post
            </Link>
          )}
        </div>
        <PostList />
      </div>
    </div>
  );
}

export default Home; 