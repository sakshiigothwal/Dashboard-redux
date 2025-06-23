import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import AddUser from './components/pages/AddUser';
import BlogDetails from './components/pages/BlogDetails';
import BlogList from './components/pages/BlogList';
import HomePage from './components/pages/HomePage';
import LogInPage from './components/pages/LogInPage';
import Register from './components/pages/Register';
import User from './components/pages/User';
import UserDetails from './components/pages/UserDetails';
import Footer from './components/templates/Footer';
import Header from './components/templates/Header';
import { RootState } from './redux/store';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<Register />} />
          {/* only accessible if logged in */}
          <Route
            path="/users"
            element={isLoggedIn ? <User /> : <LogInPage />}
          />
          <Route
            path="/users/:id"
            element={isLoggedIn ? <UserDetails /> : <LogInPage />}
          />
          <Route
            path="/blogs"
            element={isLoggedIn ? <BlogList /> : <LogInPage />}
          />
          <Route
            path="/blogs/:id"
            element={isLoggedIn ? <BlogDetails /> : <LogInPage />}
          />
          <Route
            path="/add-user"
            element={isLoggedIn ? <AddUser /> : <LogInPage />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
