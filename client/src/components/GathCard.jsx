import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UserProfile from "./UserProfile";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { gathDetailModalOnAction } from "../store/actions";

const CardContainer = styled.div`
  border-radius: 1rem;
  background-color: var(--color-white);
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* max-width: 25rem; */
  min-width: 20rem;
  > * {
    margin-bottom: 1.25rem;
  }
  .divider {
    margin: 0 0.4em 0.1em;
    overflow: hidden;
  }
  .hovered {
    background-color: var(--color-maingreen--50);
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
    overflow: hidden;
    height: 100%;
    display: flex;
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
    height: 0.875rem;
    overflow: hidden;
    font-size: 0.8rem;
    color: var(--color-gray);
    margin-bottom: 0;
    display: flex;
    > * {
      display: flex;
      #marker {
        margin-right: 0.15em;
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

const GathCard = ({ gathering, ...rest }) => {
  const { isGathCreateModal } = useSelector(({ modalReducer }) => modalReducer);
  const dispatch = useDispatch();
  const handleGathDetailModalOn = () => {
    if (!isGathCreateModal) dispatch(gathDetailModalOnAction(gathering));
  };
  return (
    <CardContainer onClick={handleGathDetailModalOn} {...rest}>
      <InfoHeader>
        <div>
          <div>{`${gathering.date.split("-")[1]}월 ${gathering.date.split("-")[2]}일`}</div>
          <div className="divider">|</div>
          <div>{gathering.time}</div>
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
            <FaMapMarkerAlt id="marker" />
            <div>{gathering.placeName}</div>
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

export default GathCard;
