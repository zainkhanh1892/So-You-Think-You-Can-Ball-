import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from 'firebase/firestore';
import './signin.css';

const Signin = ({ onLogin, onGoogleLogin, authenticatedUser }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signUpError, setSignUpError] = useState(null);

  if (authenticatedUser) {
    return <Navigate to="/profile" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password } = e.target.elements;
    const auth = getAuth();
    try {
      await onLogin(identifier.value, password.value);
      setSignInError(null); // Clear any previous error
    } catch (error) {
      console.error('Login Error:', error);
      setSignInError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { newUsername, newFirstName, newLastName, newEmail, newPassword } = e.target.elements;
    const auth = getAuth();
    const db = getFirestore();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail.value, newPassword.value);
      const user = userCredential.user;
  
      // Add user profile data to Firestore
      const userDocRef = doc(db, "Ball", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        username: newUsername.value,
        firstName: newFirstName.value,
        lastName: newLastName.value,
        email: newEmail.value,
        experience: '',
        height: 0,
        weight: 0,
        wingspan: 0,
        state: '',
        county: '',
        city: '',
        position: [],
        games: 0,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        phone: '',
        team: null,
      });
  
      // Log in the user after sign-up
      await onLogin(newEmail.value, newPassword.value);
      setSignUpError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setSignUpError(error.message);
    }
  };

  return (
    <div className='signin'>
      <div className="signin-container">
        <div className="signin-content">
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="identifier">Username or Email</label>
              <input type="text" id="identifier" name="identifier" required className="input-field" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required className="input-field-pass" />
            </div>
            <button type="submit" className="btn">Sign In</button>
            <button type="button" className="google-btn" onClick={onGoogleLogin}>Sign In with Google</button>
            {signInError && <p className="error-message">{signInError}</p>} {/* Added error message display here */}
          </form>
          <p>Don't have an account? <a href="#" onClick={() => setShowSignUp(true)}>Create one!</a></p>
          {showSignUp && (
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label htmlFor="newUsername">Username</label>
                <input type="text" id="newUsername" name="newUsername" required className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="newFirstName">First Name</label>
                <input type="text" id="newFirstName" name="newFirstName" required className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="newLastName">Last Name</label>
                <input type="text" id="newLastName" name="newLastName" required className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="newEmail">Email</label>
                <input type="email" id="newEmail" name="newEmail" required className="input-field" />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Password</label>
                <input type="password" id="newPassword" name="newPassword" required className="input-field-pass" />
              </div>
              <button type="submit" className="btn">Create Account</button>
            </form>
          )}
          {signUpError && <p className="error-message">{signUpError}</p>}
        </div>
      </div>
    </div>
  );
}

export default Signin;
