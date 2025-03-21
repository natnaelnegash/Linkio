import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useUserContext } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { redirect, useNavigate } from "react-router";
import { useUserStore } from "../../lib/userStore";

const Login = () => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setUserAccessToken } = useUserContext();
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res.user.uid);
      localStorage.setItem("UserAccessToken", res.user.accessToken);
      setUserAccessToken(res.user.accessToken);
      toast.success("Successfully Logged In");
      navigator("/");
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        console.error(error.message);
        // toast.error("Email-already-in-use");
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        console.error(error.message);
        // toast.error("Password should be at least 6 characters");
      } else if (error.message.includes("invalid-email")) {
        console.error(error.message);
        // toast.error("Invalid-email");
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
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form onSubmit={handleLogin}>
                  <label className="fieldset-label">Username</label>
                  <input
                    value={email}
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                  />
                  <label className="fieldset-label">Password</label>
                  <input
                    value={password}
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                  />
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <a href="/register" className="link link-hover">
                    Don't have an account? Register
                  </a>
                  <button disabled={loading} className="btn btn-neutral mt-4">
                    {loading ? "..." : "Login"}
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

export default Login;
