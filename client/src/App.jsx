import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Schedule from "./pages/Schedule";
import Mypage from "./pages/Mypage";
import Map from "./pages/Map";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import Modal from "./components/Modal";
import GathCreate from "./components/GathCreate";
import MoveTopBtn from "./components/MoveTopBtn";
import Signing from "./components/Signing";
import GathDetail from "./components/GathDetail";

const App = () => {
  const [currentHeight, setCurrentHeight] = useState(window.innerHeight);
  const { isGathCreateModal, isGathDetailModal, isSignupModal, isSigninModal, currentGathInfo } =
    useSelector(({ modalReducer }) => modalReducer);
  const isModal = isGathCreateModal || isGathDetailModal || isSignupModal || isSigninModal;

  useEffect(() => {
    let timer;
    window.addEventListener("resize", (event) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setCurrentHeight(event.target.innerHeight);
      }, 200);
    });
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      window.removeEventListener("resize", (event) => {
        setCurrentHeight(event.target.innerHeight);
      });
    };
  }, []);

  useEffect(() => {
    const vh = currentHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    return () => {
      document.documentElement.style.removeProperty("--vh", `${vh}px`);
    };
  }, [currentHeight]);

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/chat" component={Chat} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/users/:id" component={Mypage} />
        <Route path="/map" component={Map} />
        <Redirect from="*" to="/" />
      </Switch>
      <Route path="/" exact component={Footer} />
      <Route path="/home" component={Footer} />
      <Route path="/schedule" component={Footer} />
      <Route path="/users/:id" component={Footer} />
      <Route path="/" component={MoveTopBtn} />
      <Route path="/home" component={MoveTopBtn} />
      <Route path="/schedule" component={MoveTopBtn} />
      <Route path="/users/:id" component={MoveTopBtn} />
      {isModal && (
        <Modal bgColor={isGathDetailModal && "var(--color-darkwhite)"}>
          {isGathCreateModal && <GathCreate />}
          {isGathDetailModal && <GathDetail gathering={currentGathInfo} />}
          {isSignupModal && <Signing type={"회원가입"} />}
          {isSigninModal && <Signing type={"로그인"} />}
        </Modal>
      )}
    </BrowserRouter>
  );
};

export default App;
