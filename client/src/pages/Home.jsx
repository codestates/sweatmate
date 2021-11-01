import React, { useState } from "react";
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
import { signInAction, signOutAction } from "../store/actions";

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

const SearchBtn = styled(IoSearch)`
  background-color: var(--color-maingreen--75);
  color: var(--color-white);
  padding: 0.75rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 0.6rem;
  :hover {
    opacity: 0.8;
  }
`;

const SearchBtnContainer = styled.div`
  flex: 0 0 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(20rem, auto));
`;

const Home = () => {
  const sport = [
    {
      id: 1,
      sportEmoji: "⚽",
      sportName: "축구",
      sportEngName: "soccer",
    },
    {
      id: 2,
      sportEmoji: "🏀",
      sportName: "농구",
      sportEngName: "basketball",
    },
    {
      id: 3,
      sportEmoji: "⚾",
      sportName: "야구",
      sportEngName: "baseball",
    },
    {
      id: 4,
      sportEmoji: "🎾",
      sportName: "테니스",
      sportEngName: "tennis",
    },
    {
      id: 5,
      sportEmoji: "🎱",
      sportName: "당구",
      sportEngName: "pool",
    },
    {
      id: 6,
      sportEmoji: "🎳",
      sportName: "볼링",
      sportEngName: "bowling",
    },
    {
      id: 7,
      sportEmoji: "🏐",
      sportName: "배구",
      sportEngName: "volleyball",
    },
    {
      id: 8,
      sportEmoji: "🏓",
      sportName: "탁구",
      sportEngName: "Ping-Pong",
    },
    {
      id: 9,
      sportEmoji: "🏸",
      sportName: "배드민턴",
      sportEngName: "badminton",
    },
    {
      id: 10,
      sportEmoji: "⛳",
      sportName: "골프",
      sportEngName: "golf",
    },
  ];
  const area = [
    { id: 1, areaName: "강남구" },
    { id: 2, areaName: "강동구" },
    { id: 3, areaName: "강서구" },
    { id: 4, areaName: "강북구" },
    { id: 5, areaName: "관악구" },
    { id: 6, areaName: "광진구" },
    { id: 7, areaName: "구로구" },
    { id: 8, areaName: "금천구" },
    { id: 9, areaName: "동대문구" },
    { id: 10, areaName: "도봉구" },
    { id: 11, areaName: "동작구" },
    { id: 12, areaName: "마포구" },
    { id: 13, areaName: "서대문구" },
    { id: 14, areaName: "성동구" },
    { id: 15, areaName: "성북구" },
    { id: 16, areaName: "서초구" },
    { id: 17, areaName: "송파구" },
    { id: 18, areaName: "영등포구" },
    { id: 19, areaName: "용산구" },
    { id: 20, areaName: "양천구" },
    { id: 21, areaName: "은평구" },
    { id: 22, areaName: "종로구" },
    { id: 23, areaName: "중구" },
    { id: 24, areaName: "중랑구" },
    { id: 25, areaName: "노원구" },
  ];
  const time = [
    { id: 1, timeName: "오전" },
    { id: 2, timeName: "오후" },
    { id: 3, timeName: "저녁" },
  ];
  const [isSearched, setIsSearched] = useState(false);
  const [conditions, setConditions] = useState({
    sport: null,
    area: null,
    date: null,
    time: null,
    totalNum: null,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 검색 요청 (비동기 함수로 전환 필요)
    setIsSearched(true);
    setConditions({ ...conditions, ...event.target.value });
  };

  const handleOnMapClick = () => {
    // TODO: 검색 실행 여부에 따른 별도의 조건으로 검색 및 지도에 표시 요청
  };
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const checkValidUser = async () => {
      try {
        const res = await authApi.me();
        if (res.status === 200) {
          dispatch(signInAction(res.data.data));
        }
      } catch (error) {
        if (error.response.status === 403) {
          dispatch(signOutAction);
          history.push("/");
        }
      }
    };
    checkValidUser();
  }, [dispatch, history]);

  /* 모임 정보 Dummy */
  const gatherings = [
    {
      gatheringId: 12,
      title: "농구 함 때려볼 용산러들~!",
      description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
      creator: {
        id: "uuid",
        nickname: "농구에 미친 사람",
        image: null,
      },
      areaName: "용산구",
      placeName: "운동장",
      latitude: 33.450701,
      longitude: 126.570667,
      date: "2021-10-27",
      time: "저녁",
      timeDescription: "19시",
      totalNum: 4,
      currentNum: 2,
      sportName: "농구",
      sportEmoji: "🏀",
      done: false,
      users: [
        {
          id: "uuid",
          nickname: "농구킹",
          image: null,
        },
      ],
    },
    {
      gatheringId: 12,
      title: "농구 함 때려볼 용산러들~!",
      description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
      creator: {
        id: "uuid",
        nickname: "농구에 미친 사람",
        image: null,
      },
      areaName: "용산구",
      placeName: "운동장",
      latitude: 33.450701,
      longitude: 126.570667,
      date: "2021-10-27",
      time: "저녁",
      timeDescription: "19시",
      totalNum: 4,
      currentNum: 2,
      sportName: "농구",
      sportEmoji: "🏀",
      done: false,
      users: [
        {
          id: "uuid",
          nickname: "농구킹",
          image: null,
        },
      ],
    },
    {
      gatheringId: 12,
      title: "농구 함 때려볼 용산러들~!",
      description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
      creator: {
        id: "uuid",
        nickname: "농구에 미친 사람",
        image: null,
      },
      areaName: "용산구",
      placeName: "운동장",
      latitude: 33.450701,
      longitude: 126.570667,
      date: "2021-10-27",
      time: "저녁",
      timeDescription: "19시",
      totalNum: 4,
      currentNum: 2,
      sportName: "농구",
      sportEmoji: "🏀",
      done: false,
      users: [
        {
          id: "uuid",
          nickname: "농구킹",
          image: null,
        },
      ],
    },
    {
      gatheringId: 12,
      title: "농구 함 때려볼 용산러들~!",
      description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
      creator: {
        id: "uuid",
        nickname: "농구에 미친 사람",
        image: null,
      },
      areaName: "용산구",
      placeName: "운동장",
      latitude: 33.450701,
      longitude: 126.570667,
      date: "2021-10-27",
      time: "저녁",
      timeDescription: "19시",
      totalNum: 4,
      currentNum: 2,
      sportName: "농구",
      sportEmoji: "🏀",
      done: false,
      users: [
        {
          id: "uuid",
          nickname: "농구킹",
          image: null,
        },
      ],
    },
    {
      gatheringId: 12,
      title: "농구 함 때려볼 용산러들~!",
      description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
      creator: {
        id: "uuid",
        nickname: "농구에 미친 사람",
        image: null,
      },
      areaName: "용산구",
      placeName: "운동장",
      latitude: 33.450701,
      longitude: 126.570667,
      date: "2021-10-27",
      time: "저녁",
      timeDescription: "19시",
      totalNum: 4,
      currentNum: 2,
      sportName: "농구",
      sportEmoji: "🏀",
      done: false,
      users: [
        {
          id: "uuid",
          nickname: "농구킹",
          image: null,
        },
      ],
    },
  ];

  return (
    <HomeContainer>
      <SearchContainer>
        <SearchTitle>💦 어떤 운동 모임을 찾으시나요? 🔍</SearchTitle>
        <InputContainer onSubmit={handleSubmit}>
          <InputList>
            <SearchInput isLong name="운동" for="sport">
              <InputDatalist id="sport" values={sport} placeholder="어떤 운동하세요?" />
            </SearchInput>
            <SearchInput name="지역" for="area">
              <InputDatalist id="area" values={area} placeholder="지역 입력" />
            </SearchInput>
            <SearchInput isLong name="날짜" for="date">
              <InputDatepicker id="date" placeholder="날짜 입력" />
            </SearchInput>
            <SearchInput name="시간" for="time">
              <InputDatalist id="time" values={time} placeholder="시간 입력" />
            </SearchInput>
            <SearchInput name="인원" for="totalNum">
              <InputTotalNum inputId="totalNum" placeholder="인원 입력" />
            </SearchInput>
          </InputList>
          <SearchBtnContainer>
            <SearchBtn type="submit" value="Submit" className="search-gathering" />
          </SearchBtnContainer>
        </InputContainer>
        <SearchTitle>💪🏻 운동 모임, 직접 만들어 보실래요? 🔥</SearchTitle>
        <Btn className="create-gathering" onClick={() => {}}>
          모임 만들기
        </Btn>
      </SearchContainer>
      <ListContainer>
        {isSearched ? (
          <ListSubTitle>검색 결과</ListSubTitle>
        ) : (
          <ListSubTitle>스웻메이트에는 지금</ListSubTitle>
        )}
        <ListHeader>
          {isSearched ? (
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
          {gatherings.map((gath, idx) => (
            <GathCard key={idx} gathering={gath} />
          ))}
        </Gatherings>
      </ListContainer>
    </HomeContainer>
  );
};

export default Home;
