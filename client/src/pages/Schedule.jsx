import React, { useState } from "react";
import styled from "styled-components";
import media from "styled-media-query";
import GathCard from "../components/GathCard";
import { MdOutlinePending, MdOutlineCheckCircle } from "react-icons/md";

const Container = styled.div`
  min-height: calc(100vh - 73px - 343.72px);
  width: 100%;
  max-width: 48rem;
  margin: auto;
  padding: 4rem 2rem;
  ${media.lessThan("medium")`
    max-width: none;
    padding: 2rem 1rem;
  `}
`;
const BtnContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  ${media.lessThan("medium")`
    margin-bottom: 1rem;
  `}
`;
const Btn = styled.button`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  color: var(--color-gray);
  background-color: var(--color-darkwhite);
  border: 1px solid var(--color-lightgray);
  transition: background-color 100ms ease-out, color 100ms ease-out, border-color 100ms ease-out;
  svg {
    margin-right: 0.5rem;
    transition: color 100ms ease-out;
  }
`;
const Upcoming = styled(Btn)`
  &.active,
  :hover {
    color: var(--color-black);
    background-color: var(--color-yellow--10);
    border-color: var(--color-yellow);
    svg {
      color: var(--color-yellow);
    }
  }
`;
const Passed = styled(Btn)`
  &.active,
  :hover {
    color: var(--color-black);
    background-color: var(--color-green--10);
    border-color: var(--color-green);
    svg {
      color: var(--color-green);
    }
  }
`;
const Gatherings = styled.div`
  display: grid;
  grid-gap: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, auto));
`;
const EmptyContainer = styled.div`
  height: 20rem;
  background-image: url("/schedule_assets/empty-bg.svg");
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.4;
`;

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

const Schedule = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isPassed, setIsPassed] = useState(false);

  const handleUpcomingClick = () => {
    setIsUpcoming(true);
    setIsPassed(false);
  };
  const handlePassedClick = () => {
    setIsUpcoming(false);
    setIsPassed(true);
  };

  return (
    <Container>
      <BtnContainer>
        <Upcoming type="button" className={isUpcoming && "active"} onClick={handleUpcomingClick}>
          <MdOutlinePending />
          다가오는 일정
        </Upcoming>
        <Passed type="button" className={isPassed && "active"} onClick={handlePassedClick}>
          <MdOutlineCheckCircle />
          지나간 일정
        </Passed>
      </BtnContainer>
      {
        // gatherings.length !== 0 && //
        isUpcoming && (
          <Gatherings>
            {gatherings.map((gath, idx) => (
              <GathCard key={idx} gathering={gath} />
            ))}
          </Gatherings>
        )
      }
      {
        // gatherings.length === 0 && //
        isPassed && <EmptyContainer>지나간 일정이 없어요 💦</EmptyContainer>
      }
    </Container>
  );
};

export default Schedule;
