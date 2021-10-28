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
import { useSelector, useDispatch } from "react-redux";
import { gathCreateModalOnAction, confirmModalOnAction } from "./store/actions";
import Modal from "./components/Modal";
import GathCreate from "./components/GathCreate";
import ConfirmModal from "./components/ConfirmModal";

const App = () => {
  const { isGathCreateModal, isConfirmModal } = useSelector(({ modalReducer }) => modalReducer);
  const dispatch = useDispatch();
  const handleGathCreateModalOn = (e) => {
    dispatch(gathCreateModalOnAction);
  };
  const handleConfirmModalOn = (e) => {
    dispatch(confirmModalOnAction);
  };
  const contentExample = {
    title: "정말 채팅방에서 나가시겠습니까?",
    body: "채팅방에서 나가시는 경우, 해당 모임 참여도 함께 취소됩니다.",
    func: () => {
      console.log("채팅방 나가기 완료");
    },
  };
  return (
    <BrowserRouter>
      <Header />
      <div>
        <button onClick={handleGathCreateModalOn}>모임 생성 모달 열기</button>
        <button onClick={handleConfirmModalOn}>컨펌 모달 열기</button>
      </div>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/chat/:id" component={Chat} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/users/:id" component={Mypage} />
        <Route path="/map" component={Map} />
        <Redirect from="*" to="/" />
      </Switch>
      <Route path="/" exact component={Footer} />
      <Route path="/home" component={Footer} />
      <Route path="/schedule" component={Footer} />
      <Route path="/users/:id" component={Footer} />
      {isGathCreateModal && <Modal>{isGathCreateModal && <GathCreate />}</Modal>}
      {isConfirmModal && <ConfirmModal content={contentExample} />}
    </BrowserRouter>
  );
};

export default App;
