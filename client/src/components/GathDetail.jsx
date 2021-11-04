import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";
import MapPreview from "./MapPreview";
import UserProfile from "./UserProfile";
import Btn from "./Btn";
import { FaMapMarkerAlt } from "react-icons/fa";

const DetailContainer = styled.div`
  width: calc(100vw - 6rem);
  height: calc(100vh - 8rem);
  max-width: 50rem;
  ${media.lessThan("medium")`
    width: 100vw;
    height: 100vh;
  `};
  color: var(--color-black);
  display: flex;
  flex-direction: column;
  .join {
    background-color: var(--color-maingreen--75);
    color: var(--color-white);
  }
  .disabled {
    opacity: 0.5;
    :hover {
      opacity: 0.5;
    }
  }
  .to-chat {
    background-color: var(--color-maingreen--25);
    color: var(--color-maingreen--100);
    border: 1px solid var(--color-maingreen--25);
    :hover {
      border: 1px solid var(--color-maingreen--75);
      opacity: 1;
    }
  }
  #sport,
  #date,
  #time {
    font-size: 1rem;
    display: flex;
  }
  #place,
  #users {
    font-size: 1rem;
    display: flex;
    margin-bottom: 1rem;
    color: var(--color-darkgray);
  }
  .icon {
    flex: 0 0 1;
    margin-right: 0.8em;
  }
  .marker {
    font-size: 1.2em;
    flex: 0 0 1;
    margin-right: 0.4em;
  }
  .text {
    flex: 1 1 1;
  }
  .divider {
    line-height: 1em;
    margin: 0 0.6em;
    overflow: hidden;
    color: var(--color-lightgray);
  }
`;

const DetailHeader = styled.div`
  flex: 0 0 auto;
  background-color: inherit;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 2rem 2rem 1.5rem;
  ${media.between("small", "medium")`
    padding: 4rem 2rem 1.5rem;
  `};
  ${media.lessThan("small")`
    padding: 4rem 1rem 1rem;
  `};
`;

const GathTitle = styled.h1`
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-family: Interop-Medium;
`;

const GathDescription = styled.p`
  font-size: 1rem;
  font-family: Interop-Regular;
  word-wrap: break-word;
  color: var(--color-darkgray);
`;

const DetailBody = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: flex-start;
  width: 100%;
  ${media.lessThan("medium")`
    flex-direction: column;
    justify-content: flex-start;
  `};
  overflow: scroll;
`;

const BodyColumn = styled.div`
  width: 100%;
  :last-of-type {
    max-width: 14rem;
  }
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
  ${media.between("small", "medium")`
    width: calc(100% - 4rem);
    `};
  ${media.lessThan("small")`
    width: calc(100% - 2rem);
    margin: 0 1rem;
  `};
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  ${media.lessThan("medium")`
    margin-top: 1rem;
  `};
`;

const InfoTitle = styled.h3`
  margin: 0.5rem 0 0.75rem;
  font-size: 0.925rem;
  font-family: Interop-Regular;
  color: var(--color-gray);
`;

const InfoBody = styled.div`
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  filter: drop-shadow(1px 1px 3px var(--color-shadow));
  background-color: var(--color-white);
  margin-bottom: 1rem;
  :last-of-type {
    ${media.lessThan("medium")`
      margin-bottom: 0;
    `};
  }
`;

// const BodyText = styled.h4`
//   margin-bottom: 0.5rem;
//   font-size: 0.875rem;
//   font-family: Interop-Regular;
//   color: var(--color-darkgray);
// `;

const MapBox = styled.div`
  border-radius: 1rem;
  width: 100%;
  height: 12.5rem;
  ${media.lessThan("medium")`
    height: 15rem;
  `};
  > * {
    filter: drop-shadow(1px 1px 3px var(--color-shadow)) !important;
  }
`;

const UserBox = styled.div`
  border-radius: 1rem;
  margin: 0.25rem 0;
  padding: 0.5rem 0;
  color: var(--color-darkgray);
`;

const DetailFooter = styled(DetailHeader)`
  padding: 1.5rem 2rem 2rem;
  ${media.lessThan("small")`
    padding: 1rem 1rem 2rem ;
  `};
  .disabled {
    cursor: not-allowed;
  }
`;

const GathDetail = ({ gathering }) => {
  const { id } = useSelector(({ authReducer }) => authReducer);
  return (
    <DetailContainer>
      <DetailHeader>
        <GathTitle>{gathering.title}</GathTitle>
        <GathDescription>{gathering.description}</GathDescription>
      </DetailHeader>
      <DetailBody>
        <BodyColumn>
          <InfoContainer>
            <InfoTitle>어떤 운동인가요?</InfoTitle>
            <InfoBody>
              <div id="sport">
                <div className="icon">{gathering.sportEmoji}</div>
                <div className="text">{gathering.sportName}</div>
              </div>
            </InfoBody>
          </InfoContainer>
          <InfoContainer>
            <InfoTitle>언제 하나요?</InfoTitle>
            {/* <BodyText>날짜</BodyText> */}
            <InfoBody>
              <div id="date">
                <div className="icon">🗓</div>
                <div className="text">{`${gathering.date.split("-")[0]}년 ${
                  gathering.date.split("-")[1]
                }월 ${gathering.date.split("-")[2]}일`}</div>
              </div>
            </InfoBody>
            {/* <BodyText>시간</BodyText> */}
            <InfoBody>
              <div id="time">
                <div className="icon">⏰</div>
                <div className="text">{gathering.time}</div>
                <div className="divider">|</div>
                {gathering.timeDescription && (
                  <div className="text">{gathering.timeDescription}</div>
                )}
              </div>
            </InfoBody>
          </InfoContainer>
          <InfoContainer>
            <InfoTitle>어디서 하나요?</InfoTitle>
            <div id="place">
              <FaMapMarkerAlt className="marker" />
              <div>{gathering.placeName}</div>
            </div>
            <MapBox>
              <MapPreview
                sportEngName={gathering.sportEngName}
                place={gathering.placeName}
                latitude={gathering.latitude}
                longitude={gathering.longitude}
              />
            </MapBox>
          </InfoContainer>
        </BodyColumn>
        <BodyColumn id="user-column">
          <InfoContainer>
            <InfoTitle>함께 하는 사람들</InfoTitle>
            <div id="users">
              {gathering.currentNum < gathering.totalNum ? (
                <div>{`${gathering.totalNum - gathering.currentNum}명 모집 중`}</div>
              ) : (
                <div>모집 완료</div>
              )}
              <div className="divider">|</div>
              <div>{`총 ${gathering.totalNum}명`}</div>
            </div>
            {gathering.users.map((user, idx) => (
              <UserBox key={idx}>
                <UserProfile size={1.5} user={user} isCreator={user.id === gathering.creator.id} />
              </UserBox>
            ))}
          </InfoContainer>
        </BodyColumn>
      </DetailBody>
      <DetailFooter>
        {gathering.users.map((user) => user.id).includes(id) ? (
          <Btn className="to-chat" onClick={() => {}}>
            채팅 바로가기
          </Btn>
        ) : (
          <>
            {gathering.currentNum === gathering.totalNum ? (
              <Btn className="join disabled">모임 참여하기</Btn>
            ) : (
              <Btn className="join" onClick={() => {}}>
                모임 참여하기
              </Btn>
            )}
          </>
        )}
      </DetailFooter>
    </DetailContainer>
  );
};

GathDetail.propTypes = {
  gathering: PropTypes.exact({
    id: PropTypes.number,
    placeName: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    timeDescription: PropTypes.string,
    totalNum: PropTypes.number,
    currentNum: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    done: PropTypes.bool,
    creator: PropTypes.exact({
      id: PropTypes.string,
      nickname: PropTypes.string,
      image: PropTypes.string,
    }),
    users: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string,
        nickname: PropTypes.string,
        image: PropTypes.string,
      })
    ),
    areaName: PropTypes.string,
    sportName: PropTypes.string,
    sportEngName: PropTypes.string,
    sportEmoji: PropTypes.string,
  }).isRequired,
};

export default GathDetail;
