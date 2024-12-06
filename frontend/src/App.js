import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import PostDetails from './components/PostDetails';
import PostForm from './components/PostForm';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route 
              path="/new-post" 
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 