/* eslint-disable  */

import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Btn from "./Btn";
import media from "styled-media-query";
import { ImGoogle } from "react-icons/im";
import { SiKakao } from "react-icons/si";
import { useDispatch } from "react-redux";
import { modalOffAction, signinOnAction, signupOnAction } from "../store/actions";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;
  padding: 1rem;
  * {
    width: 20rem;
    height: 3rem;
    margin: 0.5rem 0rem;
  }
  input {
    border-bottom: 1px solid var(--color-gray);
    :first-of-type {
      margin-top: 1rem;
    }
    :last-of-type {
      margin-bottom: 1rem;
    }
  }

  button {
    color: var(--color-darkgray);
  }
  .kakao {
    * {
      width: 3rem;
      padding: 0;
      margin-right: 0.5rem;
    }
  }
  .google {
    * {
      width: 1rem;
      padding: 0;
      margin-right: 0.5rem;
    }
  }
`;

const Logo = styled.img`
  width: calc(5.36 * 2.5rem);
  height: 2.5rem;
`;

const Input = styled.input`
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: var(--color-black);
  ::placeholder {
    color: var(--color-gray);
  }
`;

const Button = styled(Btn)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  min-height: 3rem;
  font-size: 1rem;
  border: 1.5px solid var(--color-maingreen--100);
  filter: drop-shadow(2px 2px 3px var(--color-shadow));
  * {
    font-size: 0.5rem;
  }
`;

const FlexGuideContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-darkgray);

  * {
    display: flex;
    align-items: start;
    :first-child {
      flex: 1.75 0 0;
      justify-content: end;
      padding-right: 1rem;
    }
    :last-child {
      flex: 1 0 0;
      justify-content: start;
      padding-right: 1rem;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .kakao {
    max-width: 9.5rem;
    height: 3rem;
    border: 1.5px solid #f7e600;
    margin-right: 0.5rem;
  }

  .google {
    max-width: 9.5rem;
    height: 3rem;
    border: 1.5px solid #4384f3;
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-red);
  font-size: 0.8rem;
  padding-left: 1rem;
`;

const Signing = ({ type }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    retypedPassword: "",
    nickname: "",
  });
  const [error, setError] = useState(true);

  const handleTypeChange = () => {
    if (type === "로그인") {
      dispatch(modalOffAction);
      dispatch(signupOnAction);
    } else {
      dispatch(modalOffAction);
      dispatch(signinOnAction);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  return (
    <Form>
      <Logo src={`${process.env.PUBLIC_URL}/assets/long-logo.png`} />
      <Input name="email" placeholder="이메일" onchange={handleInputChange}></Input>
      {
        error && (
          <>
            <ErrorMessage>이메일을 입력하세요</ErrorMessage>
            <ErrorMessage>특수문자는 $!@%!만 사용</ErrorMessage>
          </>
        ) /* TODO: error를 구체적인 에러 케이스로 변경 필요 (DB데이터 받아오기 등) */
      }
      <Input name="password" placeholder="비밀번호"></Input>
      {
        error && (
          <>
            <ErrorMessage>이메일 또는 비밀번호가 틀립니다.</ErrorMessage>
            <ErrorMessage>비밀번호를 입력하세요</ErrorMessage>
            <ErrorMessage>특수문자는 $!@%!만 사용</ErrorMessage>
          </>
        ) /* TODO: error를 구체적인 에러 케이스로 변경 필요 (DB데이터 받아오기 등) */
      }
      {type === "회원가입" && (
        <>
          <Input
            name="retypedPassword"
            placeholder="비밀번호 재입력"
            onchange={handleInputChange}
          ></Input>
          {
            error && (
              <ErrorMessage>비밀번호가 일치하지 않습니다!</ErrorMessage>
            ) /* TODO: error를 구체적인 에러 케이스로 변경 필요 (비밀번호 재입력 일치 여부) */
          }
          <Input name="nickname" placeholder="닉네임" onchange={handleInputChange}></Input>
          {
            error && (
              <ErrorMessage>비밀번호가 일치하지 않습니다!</ErrorMessage>
            ) /* TODO: error를 구체적인 에러 케이스로 변경 필요 (닉네임 중복 검사) */
          }
        </>
      )}
      <Button bgColor={"var(--color-white)"} color={"var(--color-maingreen--100) !important"}>
        {type === "로그인" ? "로그인" : "회원가입"}
      </Button>
      {type === "로그인" && <button>비밀번호를 잊어버리셨나요?</button>}
      <FlexGuideContainer>
        <span>{type === "로그인" ? "계정이 없으신가요?" : "이미 가입하셨나요?"}</span>
        <button onClick={handleTypeChange}>{type === "로그인" ? "회원가입" : "로그인"}</button>
      </FlexGuideContainer>
      <FlexContainer>
        <Button className="kakao" bgColor={"var(--color-white)"} color={"#F7E600 !important"}>
          <SiKakao />
          로그인
        </Button>
        <Button className="google" bgColor={"var(--color-white)"} color={"#4384f3 !important"}>
          <ImGoogle fontSize="0.5rem" />
          로그인
        </Button>
      </FlexContainer>
    </Form>
  );
};

export default Signing;

// Signing.propTypes = {
//   type: PropTypes.string.isRequired,
// };
/* eslint-enable */
