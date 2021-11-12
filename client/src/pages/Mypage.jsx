import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // ES6
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import media from "styled-media-query";
import { TiPencil } from "react-icons/ti";
// import { FaUserCircle } from "react-icons/fa";
// import { GrMail } from "react-icons/gr";
// import { IoLocationSharp } from "react-icons/io5";
// import { ImManWoman } from "react-icons/im";
// import { RiLeafLine } from "react-icons/ri";

import Btn from "../components/Btn";
import authApi from "../api/auth";
import gathApi from "../api/gath";
import userApi from "../api/user";
import {
  confirmModalOnAction,
  signinAction,
  signoutAction,
  updateInfoAction,
} from "../store/actions";
import { ReactComponent as DefaultProfile } from "../assets/defaultProfile.svg";
import ProfileEdit from "../components/ProfileEdit";
import ConfirmModal from "../components/ConfirmModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 48rem;
  margin: auto;
  ${media.lessThan("medium")`
    max-width: none;
    padding: 2rem 1rem;
  `}
`;

const ProfileContainer = styled.form`
  margin: ${(props) => (props.isMyPage ? "4rem 0rem 2rem 0rem" : "4rem 0rem 4rem 0rem")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 80%;
  height: auto;
  ${media.lessThan("medium")`
    flex-direction: column;
  `};
`;

const ProfileImage = styled.img`
  width: 15rem;
  border-radius: 100%;
  aspect-ratio: 1;
  margin: auto 0.5rem auto 2.5rem;
  ${media.lessThan("medium")`
    margin: auto 2.5rem 2rem 2.5rem;
  `};
  border: 1px solid var(--color-gray);
`;

const StyledDefaultProfile = styled(DefaultProfile)`
  width: 15rem;
  height: 15rem;
  border: 1px solid var(--color-gray);
  border-radius: 100%;
  aspect-ratio: 1;
  margin: auto 0rem auto 2.5rem;
  ${media.lessThan("medium")`
    margin: auto 2.5rem 2rem 2.5rem;
  `};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  width: 18rem;
  font-size: 1rem;
`;

const EditDetails = styled.details`
  position: absolute;
  width: 6.3rem;
  height: 7rem;
  margin-top: 17rem;
  margin-left: 3.5rem;
  ${media.lessThan("medium")`
    margin-top: 12rem;
    margin-left: -7rem;
  `};
`;

const EditSummary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 1rem;
  font-family: Interop-Regular;
  width: 4rem;
  height: 2rem;
  color: var(--color-maingreen--100);
  background-color: var(--color-darkwhite);
  list-style: none;
  cursor: pointer;
  border: 1px solid var(--color-maingreen--100);
  border-radius: 0.5rem;
  margin-bottom: -0.5rem;
`;

const ImageEditInputs = styled.div`
  display: flex;
  gap: 0.2rem;
  padding: 0rem 0.5rem;
  flex-direction: column;
  background-color: var(--color-darkwhite);
  border: 1px solid var(--color-maingreen--100);
  border-radius: 0.5rem;
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 2rem;
    color: var(--color-maingreen--100);
    list-style: none;
    cursor: pointer;
  }
`;

const EditTooltip = styled.div`
  width: 1rem;
  height: 1rem;
  border: 0.6rem solid transparent;
  border-bottom-color: var(--color-maingreen--100);
  margin-left: 0.5rem;
  margin-bottom: -0.2rem;
  div {
    position: absolute;
    margin: -0.3rem auto auto -0.48rem;
    border: 0.45rem solid transparent;
    border-bottom-color: var(--color-darkwhite);
    width: 0.8rem;
    height: 0.8rem;
    z-index: 99;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  min-width: 16rem;
  height: auto;
  ${media.lessThan("medium")`
    margin-left: -2rem;
  `};
`;

const Info = styled.span`
  display: flex;
  align-items: center;
  width: auto;
  height: 2rem;
  padding: 0.25rem 0.5rem;
`;

// const MySkillContainer = styled(ProfileContainer)`
//   display: flex;
//   flex-direction: column;
//   height: auto;
// `;

// const SkillInfo = styled.div`
//   width: 100%;
//   height: 5rem;
//   border: 1px solid blue;
// `;

// const AddSkill = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 5rem;
//   border: 1px solid blue;
// `;

// const Title = styled.h1`
//   font-family: Interop-Light;
//   font-size: 2rem;
//   margin-top: 5rem;
// `;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  * {
    align-items: center;
    justify-content: center;
  }
  ${media.lessThan("medium")`
  margin-top: 1rem;
  `};
`;

const Button = styled(Btn)`
  border: 1px solid var(--color-maingreen--100);
  width: calc((100% - 1rem) / 2);
  width: 36rem;
  ${media.lessThan("medium")`
    width:18rem;
  `};
`;

const EditModeButton = styled(Button)`
  border: 1px solid var(--color-maingreen--100);
  margin-bottom: 3rem;
  width: 35rem;
  ${media.lessThan("medium")`
    flex-direction: column;
    width: 17rem;
  `};
`;

const DeleteButton = styled(EditModeButton)`
  border: 1px solid var(--color-red);
`;

const CancelButton = styled(Button)`
  width: 17rem;
  border: 1px solid var(--color-gray);
  ${media.lessThan("medium")`
    width: 8rem;
  `};
`;

const SaveButton = styled.label`
  text-align: center;
  font-family: Interop-SemiBold;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  :hover {
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  cursor: pointer;
  width: 17rem;
  font-size: 1.2rem;
  min-width: fit-content;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  ${media.lessThan("medium")`
    font-size: 1.15rem;
    padding: 0.875rem 1.25rem;
    border-radius: 0.6rem;
    `};
  ${media.lessThan("small")`
    font-size: 1rem;
    padding: 0.75rem 1rem;
  `};
  ${media.lessThan("medium")`
    width: 8rem;
  `};
`;

const EditButton = ({ setUserInfo, setPhoto, image }) => {
  const handlePhotoChange = (e) => {
    const fileInfo = e.target.files[0];
    const imageUrl = URL.createObjectURL(fileInfo);

    setPhoto(fileInfo);
    setUserInfo((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handlePhotoDelete = () => {
    setUserInfo((prev) => ({
      ...prev,
      image: "",
    }));
  };

  return (
    <EditDetails>
      <EditSummary>
        <TiPencil />
        편집
      </EditSummary>
      <details-menu role="menu">
        <EditTooltip>
          <EditTooltip />
        </EditTooltip>
        <ImageEditInputs>
          <label htmlFor="photo" tabIndex="0" role="menuitem">
            이미지 선택
            <input
              id="photo"
              type="file"
              style={{ display: "none" }}
              accept="image/*,audio/*,video/mp4,video/x-m4v,application/pdf"
              onChange={handlePhotoChange}
            />
          </label>
          <label tabIndex="0" role="menuitem" onClick={handlePhotoDelete}>
            이미지 삭제
          </label>
        </ImageEditInputs>
      </details-menu>
    </EditDetails>
  );
};

const Mypage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id: param } = useParams();
  const { id, nickname, image, area, gender, age } = useSelector(({ authReducer }) => authReducer);
  const { isConfirmModal } = useSelector(({ modalReducer }) => modalReducer);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMyPage, setIsMyPage] = useState(false);
  const [userInfo, setUserInfo] = useState({
    image: image,
    nickname: nickname,
    email: "",
    area: area,
    gender: gender,
    age: age,
  });
  const [areaList, setAreaList] = useState([{ id: 1, name: "송파구" }]);
  const genderList = [
    { id: 1, name: "남" },
    { id: 2, name: "여" },
  ];
  const ageList = [
    { id: 1, name: "10" },
    { id: 2, name: "20" },
    { id: 3, name: "30" },
    { id: 4, name: "40" },
    { id: 5, name: "50" },
    { id: 6, name: "60" },
  ];
  const [photo, setPhoto] = useState("");

  const content = {
    title: "정말로 계정을 삭제하시나요 ❓",
    body: "모든 유저 & 모임 정보가 사라집니다❗️",
    func: () => {
      handleDeleteAccount();
    },
  };

  useEffect(() => {
    const checkValidUser = async () => {
      try {
        const res = await authApi.me();
        if (res.status === 200) {
          dispatch(signinAction(res.data));
        }
      } catch (error) {
        if (error.response.status === 403) {
          dispatch(signoutAction);
          history.push("/");
        }
      }
    };
    checkValidUser();

    const checkMyPage = async () => {
      const res = await userApi.getUserInfo(param);
      setUserInfo({
        age: res.data.age,
        area: res.data.areaName,
        email: res.data.email,
        gender: res.data.gender,
        image: res.data.image,
        nickname: res.data.nickname,
      });
      setIsMyPage(id === param);
    };
    checkMyPage();
  }, [param]);

  useEffect(() => {
    const getAreaList = async () => {
      const res = await gathApi.getAreaList();
      const areaList = res.data.map((el) => ({ id: el.id, name: el.areaName }));
      setAreaList(areaList);
    };
    getAreaList();
  }, []);

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", photo);
    formData.append("nickname", userInfo.nickname);
    formData.append("areaName", userInfo.area);
    formData.append("gender", userInfo.gender);
    formData.append("age", userInfo.age);
    try {
      const res = await userApi.modifyUserInfo(id, formData);
      dispatch(updateInfoAction(res));
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await userApi.deleteUserAccount(id);
      if (res.status === 200) history.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = (prev) => ({
    ...prev,
    image: image,
  });

  return (
    <Container>
      <ProfileContainer onSubmit={handleSubmit}>
        {userInfo.image ? <ProfileImage src={userInfo.image} /> : <StyledDefaultProfile />}
        {isEditMode && <EditButton setUserInfo={setUserInfo} setPhoto={setPhoto} image={image} />}
        <ProfileInfo>
          {!isEditMode ? (
            <>
              <InfoContainer>
                {/* <FaUserCircle style={{ display: "inline" }} />  */}
                👤
                <Info>{userInfo.nickname || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <GrMail style={{ display: "inline" }} />  */}
                ✉️
                <Info>{userInfo.email || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <IoLocationSharp style={{ display: "inline" }} /> */}
                📍
                <Info>{userInfo.area || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <ImManWoman style={{ display: "inline" }} /> */}
                👫🏻
                <Info>{userInfo.gender || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <RiLeafLine style={{ display: "inline" }} /> */}⏱
                <Info>{userInfo.age || "❓"}</Info>
              </InfoContainer>
            </>
          ) : (
            <>
              <ProfileEdit
                id="nickname"
                name="nickname"
                type="nickname"
                values={[]}
                setUserInfo={setUserInfo}
                nickname={userInfo.nickname}
              />
              <ProfileEdit
                id="email"
                name="email"
                type="email"
                values={[]}
                email={userInfo.email}
              />
              <ProfileEdit
                id="area"
                name="area"
                type="area"
                values={areaList}
                setUserInfo={setUserInfo}
              />
              <ProfileEdit
                id="gender"
                name="gender"
                type="gender"
                values={genderList}
                setUserInfo={setUserInfo}
              />
              <ProfileEdit
                id="age"
                name="age"
                type="age"
                values={ageList}
                setUserInfo={setUserInfo}
              />
            </>
          )}
        </ProfileInfo>
        <button id="submitdata" style={{ display: "none" }}></button>
      </ProfileContainer>
      {/* <MySkillContainer>
        <Title>{nickname || "OOO"}님의 관심 운동</Title>
        <SkillInfo></SkillInfo>
        <AddSkill>+</AddSkill>
      </MySkillContainer> */}
      {isMyPage &&
        (isEditMode ? (
          <>
            <ButtonContainer>
              <CancelButton
                color={"var(--color-gray)"}
                onClick={() => {
                  setUserInfo(handleCancelClick);
                  setIsEditMode(false);
                }}
              >
                취소
              </CancelButton>
              <SaveButton
                htmlFor="submitdata"
                type="submit"
                color={"var(--color-white)"}
                bgColor={"var(--color-maingreen--75)"}
              >
                저장
              </SaveButton>
            </ButtonContainer>
            <ButtonContainer>
              <DeleteButton
                type="button"
                className="edit"
                color={"var(--color-red)"}
                onClick={() => dispatch(confirmModalOnAction)}
              >
                계정 삭제
              </DeleteButton>
            </ButtonContainer>
          </>
        ) : (
          <ButtonContainer>
            <EditModeButton
              type="button"
              className="edit"
              color={"var(--color-maingreen--100)"}
              bgColor={"var(--color-white)"}
              onClick={handleEditClick}
            >
              프로필 수정
            </EditModeButton>
          </ButtonContainer>
        ))}
      {isConfirmModal && <ConfirmModal content={content} />}
    </Container>
  );
};

export default Mypage;

EditButton.propTypes = {
  setUserInfo: PropTypes.func,
  setPhoto: PropTypes.func,
  image: PropTypes.string,
};
