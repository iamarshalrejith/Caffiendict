import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Authentication = ({ handleCloseModal }) => {
  const [isRegistration, setIsRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signUp, login } = useAuth(); // ✅ Correctly use 'signUp'

  async function handleAuthenticate() {
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 6 ||
      isAuthenticating
    ) {
      setError("Enter a valid email and password (6+ chars).");
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      if (isRegistration) {
        await signUp(email, password);  // ✅ Using correct function
      } else {
        await login(email, password);
      }

      handleCloseModal(); // Close modal after success
    } catch (err) {
      console.error(err.message);
      setError(err.message); // Show Firebase error
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>
      <p>{isRegistration ? "Create an account!" : "Sign in to your account!"}</p>

      {error && <p className="error-text">{error}</p>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        autoComplete="email"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="**********"
        type="password"
        autoComplete="current-password"
      />

      <button
        onClick={handleAuthenticate}
        disabled={isAuthenticating || !email.includes("@") || password.length < 6}
      >
        <p>{isAuthenticating ? "Authenticating..." : "Submit"}</p>
      </button>

      <hr />

      <div className="register-content">
        <p>{isRegistration ? "Already have an account?" : "Don't have an account?"}</p>
        <button onClick={() => setIsRegistration(!isRegistration)}>
          <p>{isRegistration ? "Sign in" : "Sign up"}</p>
        </button>
      </div>
    </>
  );
};

export default Authentication;
