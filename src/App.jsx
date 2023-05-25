import React, { Profiler, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "aos/dist/aos.css";
import "./css/style.css";
import("preline");

import AOS from "aos";

import Home from "./pages/Home";
import UsersSignIn from "./pages/Users/UsersSignIn";
import UsersSignUp from "./pages/Users/UsersSignUp";
import Main from "./pages/Main/Main";
import CreateCollab from "./pages/Main/CreateCollab";
import Collaboration from "./pages/Main/Collaboration";
import Profile from "./pages/Profile/Profile";
import Meeting from "./pages/Meetings/Meeting";
import Profile2 from "./pages/Profile/Profile2";
import Page404 from "./pages/Page404";
import Notifications from "./pages/Notifications/Notifications";
import AdminMain from "./pages/Admin/AdminMain";
import Chat from "./pages/Chat/Chat";
import HomeMain from "./pages/Home/HomeMain";

function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<UsersSignIn />} />
        <Route path="/signup" element={<UsersSignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/createCollab" element={<CreateCollab />} />
        <Route path="/main/:uid" element={<Collaboration />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/profile/:userId" element={<Profile2 />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/main/:uid/:mid" element={<Meeting />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/home" element={<HomeMain />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
