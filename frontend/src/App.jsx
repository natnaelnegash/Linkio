import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { useUserContext } from "./context/UserContext";
import Login from "./pages/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

function App() {
  // const { userAccessToken } = useUserContext();
  // const [token, setToken] = useState();
  // const navigator = useNavigate();
  // useEffect(() => {
  //   setToken(userAccessToken);
  //   if (userAccessToken) {
  //     navigator("/dashboard");
  //   } else {
  //     navigator("/login");
  //   }
  // }, []);
  const { currentUser, isLoading, fetchUserData } = useUserStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserData(user.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserData]);
  console.log(currentUser);
  return <div>{currentUser ? <Dashboard /> : <Login />}</div>;
  // if (isLoading) return (<h1>Loadingggg</h1>)
}

export default App;
