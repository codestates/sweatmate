import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ReactComponent as DefaultProfile } from "../assets/defaultProfile.svg";
import { FaCrown } from "react-icons/fa";

/*
  UserProfile 컴포넌트 활용 가이드 
  * size props로 닉네임 텍스트의 폰트 사이즈를 rem 단위의 '숫자'로 부여합니다. [ex: size={0.8}]
    size 속성을 부여하지 않을 경우 폰트 사이즈가 기본 값인 1(단위 rem)로 설정됩니다.
    위 속성의 1.4배 크기로 프로필 이미지의 크기가 설정됩니다.
  * user props에 표시할 유저 정보를 부여합니다. [ex: user={유저 정보를 담은 객체}]
  * isDisabled props를 부여해 컴포넌트 클릭 시 발생하는 클릭 이벤트를 비활성화합니다.
    비활성화할 경우 isDisabled만 표기, 비활성화하지 않을 경우 isDisabled props 자체를 표기하지 않습니다.
  * 컴포넌트가 모임 참여자 리스트에 사용되었을 경우 모임 생성자와 모임 참여자를 구분하는 isCreator props를 부여합니다.
    위 속성이 존재할 경우, 모임 생성자와 모임 참여자를 구분하는 아이콘이 프로필 이미지 위에 표시됩니다.
  * 유저 닉네임을 hideName props를 부여하여 숨길 수 있습니다.
    위 속성이 존재할 경우, 유저 닉네임 없이 유저 프로필만 표시됩니다.
  * 닉네임 폰트 색상 변경을 위해서는 컴포넌트 자체에 color 속성을 부여합니다. [기본 값: var(--color-black)]
*/

const ProfileContainer = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Interop-SemiBold;
  font-size: calc(${(props) => props.size} * 1rem);
  ${(props) => {
    if (props.size <= 0.8) return "font-family: Interop-Medium";
  }};
  > #image {
    width: calc(${(props) => props.size} * 1.4rem);
    height: calc(${(props) => props.size} * 1.4rem);
    margin-right: calc(${(props) => props.size} * 0.8rem);
    ${(props) => {
      if (props.size <= 0.8) return "margin-right: 0.64rem";
      if (props.size >= 1.25) return "margin-right: 1rem";
    }};
    position: relative;
  }
  > #nickname {
    width: fit-content;
    height: ${(props) => props.size};
    padding-top: calc(${(props) => props.size} * 0.1rem);
    line-height: calc(${(props) => props.size} * 1.4rem);
    ${(props) => {
      if (props.size <= 0.8) return "font-size: 0.8rem";
      if (props.size >= 1.25) return "font-size: 1.25rem";
    }};
    position: relative;
  }
  :hover {
    ${(props) => {
      if (!props.disabled) return "opacity: 0.8";
    }};
  }
  #crownmark {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 40%;
    height: 40%;
    border-radius: 50%;
    font-size: 0.35em;
    color: var(--color-white);
    background-color: var(--color-maingreen--100);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Image = styled.div`
  background-image: url(${(props) => props.url});
  background-size: cover;
  width: 100%;
  height: 0;
  padding-top: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

const DefaultImage = styled(DefaultProfile)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

const BackgroundLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const UserProfile = ({ size, user, isDisabled, isCreator, hideName }) => {
  return (
    <ProfileContainer size={size} disabled={isDisabled}>
      <div id="image">
        {user.image ? <Image url={user.image} /> : <DefaultImage />}
        {isCreator && (
          <div id="crownmark">
            <FaCrown />
          </div>
        )}
        {!isDisabled && <BackgroundLink to={`/users/${user.id}`} />}
      </div>
      {!hideName && (
        <div id="nickname">
          {user.nickname}
          {!isDisabled && <BackgroundLink to={`/users/${user.id}`} />}
        </div>
      )}
    </ProfileContainer>
  );
};

UserProfile.defaultProps = {
  isDisabled: false,
  isCreator: false,
  hideName: false,
};

UserProfile.propTypes = {
  size: PropTypes.number.isRequired,
  user: PropTypes.exact({
    id: PropTypes.string,
    nickname: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  isDisabled: PropTypes.bool,
  isCreator: PropTypes.bool,
  hideName: PropTypes.bool,
};

export default UserProfile;
