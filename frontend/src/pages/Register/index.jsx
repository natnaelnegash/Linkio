import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useUserContext } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { redirect, useNavigate } from "react-router";
import { useUserStore } from "../../lib/userStore";

const Register = () => {
  const navigator = useNavigate();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { userAccessToken, setUserAccessToken } = useUserContext();
  const [loading, setLoading] = useState(false);
  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      localStorage.setItem("UserAccessToken", res.user.accessToken);
      setUserAccessToken(res.user.accessToken);
      toast.success("Successfully Registered");
      navigator("/");
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        toast.error("Email-already-in-use");
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        toast.error("Password should be at least 6 characters");
      } else if (error.message.includes("invalid-email")) {
        toast.error("Invalid-email");
      } else {
        toast.error(error.message);
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form onSubmit={handleRegister}>
                  <label className="fieldset-label">Username</label>
                  <input
                    value={username}
                    type="usename"
                    className="input"
                    placeholder="Username"
                    name="username"
                  />
                  <label className="fieldset-label">Email</label>
                  <input
                    value={email}
                    type="email"
                    className="input"
                    placeholder="Email"
                    name="email"
                  />
                  <label className="fieldset-label">Password</label>
                  <input
                    value={password}
                    type="password"
                    className="input"
                    placeholder="Password"
                    name="password"
                  />
                  <div>
                    <a href="/login" className="link link-hover">
                      Have an account? Login
                    </a>
                  </div>
                  <button disabled={loading} className="btn btn-neutral mt-4">
                    {loading ? "..." : "Register"}
                  </button>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
