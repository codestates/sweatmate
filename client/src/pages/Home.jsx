import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GathCard from "../components/GathCard";
import media from "styled-media-query";
import OnMapBtn from "../components/OnMapBtn";
import Btn from "../components/Btn";
import { IoSearch } from "react-icons/io5";
import SearchInput from "../components/SearchInput";
import InputDatepicker from "../components/InputDatepicker";
import InputDatalist from "../components/InputDatalist";
import InputTotalNum from "../components/InputTotalNum";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import gathApi from "../api/gath";
import { gathCreateModalOnAction, signinAction, signoutAction } from "../store/actions";

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > * {
    padding: 2rem;
    ${media.lessThan("medium")`
      padding: 2rem 1rem;
    `}
  }
`;

const SearchContainer = styled.div`
  background-color: var(--color-maingreen--25);
  min-height: 20rem;
  flex: 0 0 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .create-gathering {
    width: 16rem;
    background-color: var(--color-maingreen--75);
    color: var(--color-white);
    margin-bottom: 4rem;
  }
`;

const SearchTitle = styled.h1`
  font-family: Interop-Regular;
  font-size: 1.25rem;
  color: var(--color-darkgray);
  line-height: var(--lineHeight-loose);
  margin: 4rem 0 2rem;
`;

const InputContainer = styled.form`
  margin: 0 auto;
  height: 4rem;
  background-color: var(--color-white);
  border-radius: 1rem;
  display: flex;
`;

const InputList = styled.div`
  display: flex;
  align-items: center;
  display: flex;
`;

const SearchBtnView = styled(IoSearch)`
  background-color: var(--color-maingreen--75);
  color: var(--color-white);
  padding: 0.75rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 0.6rem;
  cursor: not-allowed;
  ${(props) =>
    props.disabled &&
    `opacity : 0.5;
    cursor: not-allowed;`}
`;

const SearchBtnContainer = styled.div`
  flex: 0 0 1;
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

const ListContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${media.lessThan("small")`
    flex-direction: column;
    align-items: flex-start;
    > a {
      margin-top: 1rem;
    }
  `}
  #onMapBtn {
    flex: 0 0 1;
  }
`;

const ListTitle = styled.h1`
  font-family: Interop-Medium;
  font-size: 1.4rem;
  line-height: var(--lineHeight-loose);
  margin: 0 1rem 0 0;
`;

const ListSubTitle = styled.h3`
  font-family: Interop-Regular;
  color: var(--color-gray);
  font-size: 1.125rem;
  margin: 0;
  ${media.lessThan("medium")`
    margin-bottom: 0.5rem;
  `}
`;

const Gatherings = styled.div`
  display: grid;
  grid-gap: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, auto));
`;

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [list, setList] = useState({
    sport: [],
    area: [],
    time: [
      { id: 1, timeName: "오전" },
      { id: 2, timeName: "오후" },
      { id: 3, timeName: "저녁" },
    ],
  });
  const [gathList, setGathList] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [sportInput, setSportInput] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [totalNumInput, setTotalNumInput] = useState(null);
  const [conditions, setConditions] = useState({
    sport: sportInput,
    area: areaInput,
    date: dateInput,
    time: timeInput,
    totalNum: totalNumInput,
  });
  const [searchable, setSearchable] = useState(false);

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
  }, [dispatch, history]);

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
        setGathList(res.data.gatherings);
      } catch (err) {
        // console.error(err);
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

  useEffect(() => {
    setIsSearched(false);
  }, [sportInput, areaInput, dateInput, timeInput, totalNumInput]);

  useEffect(() => {
    // 모임 검색
    const findGathering = async () => {
      try {
        // 검색 조건 정제 (운동, 날짜)
        const refinedSportInput = conditions.sport.match(/[A-Za-z가-힣]*/).join("");
        const refinedDateInput = conditions.date.match(/[0-9]*/).join("-");
        console.log({ ...conditions, sport: refinedSportInput, date: refinedDateInput });
        const res = await gathApi.findGath({
          ...conditions,
          sport: refinedSportInput,
          date: refinedDateInput,
        });
        setGathList(res.data.gatherings);
      } catch (err) {
        // console.error(err);
      }
    };
    if (isSearched) findGathering();
  }, [isSearched]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 검색 조건 업데이트
    setConditions({
      sport: sportInput,
      area: areaInput,
      date: dateInput,
      time: timeInput,
      totalNum: totalNumInput,
    });
    // 검색 완료로 상태 변경
    setIsSearched(true);
  };

  const handleOnMapClick = () => {
    // TODO: 검색 실행 여부에 따른 별도의 조건으로 검색 및 지도에 표시 요청
  };
  const handleCreateGath = () => {
    dispatch(gathCreateModalOnAction);
  };

  return (
    <HomeContainer>
      <SearchContainer>
        <SearchTitle>💦 어떤 운동 모임을 찾으시나요? 🔍</SearchTitle>
        <InputContainer onSubmit={handleSubmit}>
          <InputList>
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
          <SearchBtnContainer>
            {searchable && <SubmitInput type="submit" value="" />}
            <SearchBtnView className="search-gathering" disabled={!searchable} />
          </SearchBtnContainer>
        </InputContainer>
        <SearchTitle>💪🏻 운동 모임, 직접 만들어 보실래요? 🔥</SearchTitle>
        <Btn className="create-gathering" onClick={handleCreateGath}>
          모임 만들기
        </Btn>
      </SearchContainer>
      <ListContainer>
        {conditions.sport && conditions.area ? (
          <ListSubTitle>검색 결과</ListSubTitle>
        ) : (
          <ListSubTitle>스웻메이트에는 지금</ListSubTitle>
        )}
        <ListHeader>
          {conditions.sport && conditions.area ? (
            <ListTitle>
              {conditions.date && `${conditions.date} `}
              {conditions.time && `${conditions.time} `}
              {`${conditions.area}의 `}
              {conditions.totalNum && `${conditions.totalNum}인 `}
              {`${conditions.sport} 모임`}
            </ListTitle>
          ) : (
            <ListTitle>이런 운동 모임들이 있어요!</ListTitle>
          )}
          <OnMapBtn id="onMapBtn" onClick={handleOnMapClick} />
        </ListHeader>
        <Gatherings>
          {gathList.map((gath, idx) => (
            <GathCard key={idx} gathering={gath} />
          ))}
        </Gatherings>
      </ListContainer>
    </HomeContainer>
  );
};

export default Home;
