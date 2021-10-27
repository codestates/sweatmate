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
  const { isGathCreateModal } = useSelector(({ modalReducer }) => modalReducer);
  const isModal = isGathCreateModal;
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/chat/:id" component={Chat} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/users/:id" component={Mypage} />
        <Route path="/map" component={Map} />
        <Redirect from="*" to="/" />
      </Switch>
      <Footer />
      {isModal && <Modal>{isGathCreateModal && <GathCreate />}</Modal>}
    </BrowserRouter>
  );
};

export default App;
