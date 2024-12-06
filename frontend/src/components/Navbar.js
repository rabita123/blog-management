import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">BlogApp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to="/new-post"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                >
                  Create Post
                </Link>
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{user.username}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-600 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/new-post"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Create Post
              </Link>
              <div className="px-3 py-2">
                <span className="block text-gray-700 font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="mt-1 text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 