import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
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
import { signinAction, signoutAction } from "../store/actions";
import { ReactComponent as DefaultProfile } from "../assets/defaultProfile.svg";
import ProfileEdit from "../components/ProfileEdit";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 4rem 0rem 2rem 0rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  height: auto;
  ${media.lessThan("medium")`
    flex-direction: column;
  `};
`;

const ProfileImage = styled.img`
  width: 18rem;
  border-radius: 100%;
  aspect-ratio: 1;
  margin: auto 3.5rem auto 2.5rem;
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
  font-size: 1.2rem;
`;

const EditDetails = styled.details`
  position: absolute;
  width: 6.3rem;
  height: 7rem;
  margin-top: 19rem;
  margin-left: 5rem;
  ${media.lessThan("medium")`
    margin-top: 15rem;
    margin-left: -9rem;
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
  border: 2px solid var(--color-maingreen--100);
  border-radius: 0.5rem;
  margin-bottom: -0.5rem;
`;

const ImageEditInputs = styled.div`
  display: flex;
  gap: 0.2rem;
  padding: 0rem 0.5rem;
  flex-direction: column;
  background-color: var(--color-darkwhite);
  border: 2px solid var(--color-maingreen--100);
  border-radius: 0.5rem;
  input {
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
    margin: -0.3rem auto auto -0.45rem;
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
  min-width: 22rem;
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
  margin-top: 5rem;
  margin-bottom: 4rem;
  * {
    align-items: center;
    justify-content: center;
  }
`;

const Button = styled(Btn)`
  border: 3px solid var(--color-maingreen--100);
  width: calc((100% - 1rem) / 2);
  width: 36rem;
  ${media.lessThan("medium")`
    width:18rem;
  `};
`;

const EditModeButton = styled(Button)`
  border: 3px solid var(--color-maingreen--100);
  margin-bottom: 5rem;
  width: 36rem;
  ${media.lessThan("medium")`
  flex-direction: column;
  width: 17rem;
  `};
`;

const CancelButton = styled(Button)`
  width: 17rem;
  border: 3px solid var(--color-red);
  ${media.lessThan("medium")`
  width: 8rem;
  `};
`;

const DeleteButton = styled(Button)`
  width: 17rem;
  border: 3px solid var(--color-red);
  ${media.lessThan("medium")`
    width: 8rem;
  `};
`;

const EditButton = () => (
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
        <label tabIndex="0" role="menuitem">
          <input type="button" value="이미지 선택" />
        </label>
        <label tabIndex="0" role="menuitem">
          <input type="button" value="이미지 삭제" />
        </label>
      </ImageEditInputs>
    </details-menu>
  </EditDetails>
);

const Mypage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { nickname, image } = useSelector(({ authReducer }) => authReducer);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    age: "",
    areaName: "",
    email: "",
    gender: "",
    image: image,
    nickname: nickname,
    sports: [],
  });
  const [area, setArea] = useState([{ id: 1, name: "송파구" }]);
  const gender = [
    { id: 1, name: "남" },
    { id: 2, name: "여" },
  ];
  const age = [
    { id: 1, name: "10" },
    { id: 2, name: "20" },
    { id: 3, name: "30" },
    { id: 4, name: "40" },
    { id: 5, name: "50" },
    { id: 6, name: "60" },
  ];

  useEffect(() => {
    const checkUserInfo = async (id) => {
      const res = await userApi.getUerInfo(id);
      setUserInfo({
        age: res.data.age,
        areaName: res.data.areaName,
        email: res.data.email,
        gender: res.data.gender,
        image: res.data.image,
        nickname: res.data.nickname,
        sports: [],
      });
    };

    const checkValidUser = async () => {
      try {
        const res = await authApi.me();
        if (res.status === 200) {
          dispatch(signinAction(res.data));
          checkUserInfo(res.data.id);
        }
      } catch (error) {
        if (error.response.status === 403) {
          dispatch(signoutAction);
          history.push("/");
        }
      }
    };
    checkValidUser();
  }, []);

  useEffect(() => {
    const getAreaList = async () => {
      const res = await gathApi.getAreaList();
      const areaList = res.data.map((el) => ({ id: el.id, name: el.areaName }));
      setArea(areaList);
    };
    getAreaList();
  }, []);

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditMode((prev) => !prev);
  };

  return (
    <Container>
      <ProfileContainer>
        {image ? <ProfileImage src={image} /> : <DefaultProfile />}
        {!isEditMode && <EditButton />}
        <ProfileInfo>
          {!isEditMode ? (
            <>
              <ProfileEdit type="email" values={[]} />
              <ProfileEdit type="nickname" values={[]} />
              <ProfileEdit type="area" values={area} />
              <ProfileEdit type="gender" values={gender} />
              <ProfileEdit type="age" values={age} />
            </>
          ) : (
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
                <Info>{userInfo.age || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <ImManWoman style={{ display: "inline" }} /> */}
                👫🏻
                <Info>{userInfo.gender || "❓"}</Info>
              </InfoContainer>
              <InfoContainer>
                {/* <RiLeafLine style={{ display: "inline" }} /> */}⏰
                <Info>{userInfo.age || "❓"}</Info>
              </InfoContainer>
            </>
          )}
        </ProfileInfo>
      </ProfileContainer>
      {/* <MySkillContainer>
        <Title>{nickname || "OOO"}님의 관심 운동</Title>
        <SkillInfo></SkillInfo>
        <AddSkill>+</AddSkill>
      </MySkillContainer> */}
      {isEditMode ? (
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
      ) : (
        <ButtonContainer>
          <CancelButton color={"var(--color-red)"} onClick={handleEditClick}>
            취소
          </CancelButton>
          <DeleteButton
            color={"var(--color-white)"}
            bgColor={"var(--color-red)"}
            onClick={handleEditClick}
          >
            계정 삭제
          </DeleteButton>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default Mypage;
