import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GathCard from "../components/GathCard";
import media from "styled-media-query";
import OnMapBtn from "../components/OnMapBtn";

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
  height: 20rem;
  flex: 0 0 1;
  background-color: var(--color-maingreen--25);
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
  const [sportInput, setSportInput] = useState(null);
  const [areaInput, setAreaInput] = useState(null);
  const [dateInput, setDateInput] = useState(null);
  const [timeInput, setTimeInput] = useState(null);
  const [totalNumInput, setTotalNumInput] = useState(null);

  useEffect(() => {
    setSportInput("농구🏀");
    setAreaInput("용산구");
    setDateInput("2021-11-25");
    setTimeInput("오후");
    setTotalNumInput(4);
  }, []);

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
      <SearchContainer />
      <ListContainer>
        {sportInput && areaInput ? (
          <ListSubTitle>검색 결과</ListSubTitle>
        ) : (
          <ListSubTitle>스웻메이트에는 지금</ListSubTitle>
        )}
        <ListHeader>
          {sportInput && areaInput ? (
            <ListTitle>
              {dateInput &&
                `${dateInput.split("-")[0]}년 ${dateInput.split("-")[1]}월 ${
                  dateInput.split("-")[2]
                }일 `}
              {timeInput && `${timeInput} `}
              {`${areaInput}의 `}
              {totalNumInput && `${totalNumInput}인 `}
              {`${sportInput} 모임`}
            </ListTitle>
          ) : (
            <ListTitle>이런 운동 모임들이 있어요!</ListTitle>
          )}
          <OnMapBtn id="onMapBtn" />
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
