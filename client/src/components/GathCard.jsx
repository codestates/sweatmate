import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UserProfile from "./UserProfile";
import { FaMapMarkerAlt } from "react-icons/fa";

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
  .text {
    padding-top: 0.1em;
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
    height: 100%;
    display: flex;
    align-items: baseline;
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
      #marker {
        padding-right: 0.2rem;
      }
    }
  }
`;

const InfoFooter = styled.div`
  width: 100%;
  color: var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
`;

const GathCard = ({ gathering }) => {
  const timeName = { morning: "오전", afternoon: "오후", evening: "저녁" };

  return (
    <CardContainer>
      <InfoHeader>
        <div>
          <div className="text">{`${gathering.date.split("-")[1]}월 ${
            gathering.date.split("-")[2]
          }일`}</div>
          <div className="divider">|</div>
          <div className="text">{timeName[gathering.time]}</div>
        </div>
        <div>
          <div className="text">{`${gathering.currentNum}명 모집 중`}</div>
          <div className="divider">|</div>
          <div className="text">{`총 ${gathering.totalNum}명`}</div>
        </div>
      </InfoHeader>
      <InfoBody>
        <div id="icon">{gathering.sportEmoji}</div>
        <div id="title">{gathering.title}</div>
        <div id="location">
          <div className="text">{gathering.areaName}</div>
          <div className="divider">|</div>
          <div>
            <FaMapMarkerAlt id="marker" />
            <div className="text">{gathering.placeName}</div>
          </div>
        </div>
      </InfoBody>
      <InfoFooter>
        <UserProfile size={0.8} user={gathering.creator} isDisabled />
      </InfoFooter>
    </CardContainer>
  );
};

GathCard.propTypes = {
  gathering: PropTypes.exact({
    gatheringId: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    creator: PropTypes.exact({
      id: PropTypes.string,
      nickname: PropTypes.string,
      image: PropTypes.string,
    }),
    areaName: PropTypes.string,
    placeName: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    date: PropTypes.string,
    time: PropTypes.string,
    timeDescription: PropTypes.string,
    totalNum: PropTypes.number,
    currentNum: PropTypes.number,
    sportName: PropTypes.string,
    sportEmoji: PropTypes.string,
    done: PropTypes.bool,
    users: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string,
        nickname: PropTypes.string,
        image: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default GathCard;
