import React from 'react';
import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCred;
      if (isSignup) {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        alert("✅Account created!");
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
        alert("✅Logged in!");
      }
      onLogin(userCred.user); // pass user back to App
    } catch (err) {
      console.error(err);
      alert("❌ Auth failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleAuth} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">{isSignup ? "Sign Up" : "Log In"} as NGO</h2>
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {isSignup ? "Create Account" : "Log In"}
        </button>
        <p
          onClick={() => setIsSignup(!isSignup)}
          className="text-blue-600 text-sm underline cursor-pointer text-center"
        >
          {isSignup ? "Already have an account? Log in" : "New here? Sign up"}
        </p>
      </form>
    </div>
  );
}
