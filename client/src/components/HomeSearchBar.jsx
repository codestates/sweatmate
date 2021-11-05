import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import media from "styled-media-query";
import { IoSearch } from "react-icons/io5";
import SearchInput from "./SearchInput";
import InputDatepicker from "./InputDatepicker";
import InputDatalist from "./InputDatalist";
import InputTotalNum from "./InputTotalNum";
import { useDispatch } from "react-redux";
import gathApi from "../api/gath";
import { searchGathAction } from "../store/actions";

const InputContainer = styled.form`
  margin-bottom: 2rem;
  height: 4rem;
  background-color: var(--color-white);
  border-radius: 1rem;
  display: flex;
  ${media.lessThan("medium")`
  margin-bottom: 1.25rem;
  width: calc(100% - 6rem);
  `}
  ${media.lessThan("small")`
  width: 100%;
  min-width: 20rem;
  `}
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  position: relative;
  #placeholder-icon {
    flex: 0 0 auto;
    color: var(--color-maingreen--100);
  }
  #placeholder-text {
    flex: 1 1 auto;
    line-height: 3rem;
    color: var(--color-gray);
    font-family: Interop-Light;
    font-size: 1.25rem;
    display: inline;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const InputList = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  display: flex;
`;

const SearchIcon = styled(IoSearch)`
  width: ${(prop) => prop.size}rem;
  height: ${(prop) => prop.size}rem;
  padding: ${(prop) => prop.size * 0.25}rem;
  display: inline-block;
`;

const SearchBtnView = styled(SearchIcon)`
  background-color: var(--color-maingreen--75);
  color: var(--color-white);
  border-radius: 0.6rem;
  cursor: not-allowed;
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const SearchBtnContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  position: relative;
`;

const SubmitInput = styled.input`
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  width: calc(100% - 1rem);
  border-radius: 0.6rem;
  z-index: 1;
  :hover {
    cursor: pointer;
    background-color: var(--color-white);
    opacity: 0.2;
  }
`;

const HomeSearchBar = () => {
  const dispatch = useDispatch();
  const [sportInput, setSportInput] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [totalNumInput, setTotalNumInput] = useState(null);
  const [searchable, setSearchable] = useState(false);
  const [list, setList] = useState({
    sport: [],
    area: [],
    time: [
      { id: 1, timeName: "오전" },
      { id: 2, timeName: "오후" },
      { id: 3, timeName: "저녁" },
    ],
  });

  useEffect(() => {
    // 운동, 지역 리스트 받아오기
    const getList = async () => {
      try {
        const sportList = await gathApi.getSportList();
        const areaList = await gathApi.getAreaList();
        setList({ ...list, sport: sportList.data, area: areaList.data });
      } catch (err) {
        // console.error(err);
      }
    };
    getList();
    // 모임 전체 리스트 받아오기
    const getAllGathering = async () => {
      try {
        const res = await gathApi.getAllGath();
        // 리덕스 스토어의 검색 조건, 모임 리스트 업데이트
        dispatch(searchGathAction(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    getAllGathering();
  }, []);

  useEffect(() => {
    if (sportInput && areaInput) {
      setSearchable(true);
    } else {
      setSearchable(false);
    }
  }, [sportInput, areaInput]);

  const handleSearchModalOn = () => {
    // dispatch(searchModalOnAction);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // 검색 조건 정제
      const refinedSportInput = sportInput.match(/[A-Za-z가-힣]*/).join("");
      const refinedDateInput = dateInput
        .match(/[0-9]*/g)
        .filter((el) => el.length > 0)
        .join("-");
      // 모임 검색
      const res = await gathApi.findGath({
        sport: refinedSportInput,
        area: areaInput,
        date: refinedDateInput,
        time: timeInput,
        totalNum: totalNumInput,
      });
      // 리덕스 스토어의 검색 조건, 모임 리스트 업데이트
      dispatch(searchGathAction(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <InputList className="pc">
        <SearchInput isSport name="운동" for="sport">
          <InputDatalist
            id="sport"
            values={list.sport}
            placeholder="어떤 운동하세요?"
            item={sportInput}
            setItem={setSportInput}
          />
        </SearchInput>
        <SearchInput name="지역" for="area">
          <InputDatalist
            id="area"
            values={list.area}
            placeholder="지역 입력"
            item={areaInput}
            setItem={setAreaInput}
          />
        </SearchInput>
        <SearchInput isDate name="날짜" for="date">
          <InputDatepicker id="date" placeholder="날짜 입력" setDisplayedDate={setDateInput} />
        </SearchInput>
        <SearchInput isTime name="시간" for="time">
          <InputDatalist
            id="time"
            values={list.time}
            placeholder="시간 입력"
            item={timeInput}
            setItem={setTimeInput}
          />
        </SearchInput>
        <SearchInput name="인원" for="totalNum">
          <InputTotalNum
            inputId="totalNum"
            placeholder="인원 입력"
            total={totalNumInput}
            setTotal={setTotalNumInput}
          />
        </SearchInput>
      </InputList>
      <SearchBtnContainer className="pc">
        {searchable && <SubmitInput type="submit" value="" />}
        <SearchBtnView size={3} className="search-gathering" disabled={!searchable} />
      </SearchBtnContainer>
      <Placeholder className="mobile" onClick={handleSearchModalOn}>
        <SearchIcon id="placeholder-icon" size={3} />
        <p id="placeholder-text">어떤 운동하세요?</p>
      </Placeholder>
    </InputContainer>
  );
};

export default HomeSearchBar;
