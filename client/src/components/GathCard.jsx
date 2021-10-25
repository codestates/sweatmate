import React from "react";
import styled from "styled-components";
import UserThumbnail from "./UserThumbnail";
import { ReactComponent as Marker } from "../assets/textmarker.svg";

const CardContainer = styled.div`
  border-radius: 1rem;
  background-color: var(--color-white);
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 380px;
  min-width: 280px;
  > * {
    margin-bottom: 1.25rem;
  }
  .divider {
    margin: 0 0.4rem;
    overflow: hidden;
  }
`;

const InfoHeader = styled.div`
  width: 100%;
  height: 0.875rem;
  font-size: 0.8rem;
  color: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: space-between;
  > * {
    display: flex;
    align-items: center;
  }
`;

const InfoBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    margin-bottom: 0.625rem;
  }
  > #icon {
    font-size: 2rem;
  }
  > #title {
    font-size: 1.25rem;
    font-family: Interop-SemiBold;
  }
  > #location {
    font-size: 0.8rem;
    color: var(--color-gray);
    margin-bottom: 0;
    display: flex;
    align-items: center;
    > * {
      display: flex;
      align-items: center;
      .marker {
        margin-bottom: 0.12rem;
        margin-right: 0.2rem;
      }
    }
  }
`;

const InfoFooter = styled(InfoHeader)`
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  > *:first-of-type {
    margin-right: 0.4rem;
  }
`;
const GathCard = () => {
  const timeName = { morning: "오전", afternoon: "오후", evening: "저녁" };
  /* props로 들어올 모임 정보 */
  const gathering = {
    gatheringId: 12,
    title: "농구 함 때려볼 용산러들~!",
    description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
    creator: {
      id: "uuid",
      nickname: "농구에 미친 사람",
      image: "",
    },
    areaName: "용산구",
    placeName: "이촌한강공원 농구대",
    latitude: 33.450701,
    longitude: 126.570667,
    date: "2021-10-27",
    time: "evening",
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
        image: "imageUrl",
      },
    ],
  };

  return (
    <CardContainer>
      <InfoHeader>
        <div>
          <div>{`${gathering.date.split("-")[1]}월 ${gathering.date.split("-")[2]}일`}</div>
          <div className="divider">|</div>
          <div>{timeName[gathering.time]}</div>
        </div>
        <div>
          <div>{`${gathering.currentNum}명 모집 중`}</div>
          <div className="divider">|</div>
          <div>{`총 ${gathering.totalNum}명`}</div>
        </div>
      </InfoHeader>
      <InfoBody>
        <div id="icon">{gathering.sportEmoji}</div>
        <div id="title">{gathering.title}</div>
        <div id="location">
          <div>{gathering.areaName}</div>
          <div className="divider">|</div>
          <div>
            <Marker className="marker" fill="#969699" width="9" />
            {gathering.placeName}
          </div>
        </div>
      </InfoBody>
      <InfoFooter>
        <UserThumbnail size={1} user={gathering.creator} />
        <div>{gathering.creator.nickname}</div>
      </InfoFooter>
    </CardContainer>
  );
};

export default GathCard;
