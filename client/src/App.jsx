import React from "react";
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

const App = () => {
  const { isGathCreateModal, isGathDetailModal } = useSelector(({ modalReducer }) => modalReducer);
  const isModal = isGathCreateModal || isGathDetailModal;
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
      {isModal && (
        <Modal>
          {isGathCreateModal && <GathCreate />}
          {isGathDetailModal && <div>모임 상세 모달</div>}
        </Modal>
      )}
    </BrowserRouter>
  );
};

export default App;
