import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MapPreview from "./MapPreview";
import UserProfile from "./UserProfile";

const DetailContainer = styled.div``;

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-family: Interop-Medium;
  color: var(--color-darkgray);
`;

const Description = styled.p`
  font-size: 0.875rem;
  font-family: Interop-Regular;
  color: var(--color-gray);
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-family: Interop-Regular;
  color: var(--color-darkgray);
`;

const ContentBody = styled.div``;

const GathDetail = ({ gathering }) => {
  return (
    <DetailContainer>
      <Title>{gathering.title}</Title>
      <Description>{gathering.description}</Description>
      <InnerContainer>
        <ContentBox>
          <SubTitle>어떤 운동인가요?</SubTitle>
          <ContentBody>{`${gathering.sportName}${gathering.sportEmoji}`}</ContentBody>
        </ContentBox>
        <ContentBox>
          <SubTitle>언제 하나요?</SubTitle>
          <ContentBody>
            {`${gathering.date} ${gathering.time}
            ${gathering.timeDescription}`}
          </ContentBody>
        </ContentBox>
        {/* <ContentBox>
          <SubTitle>몇 명이서 하나요?</SubTitle>
          <ContentBody>{`${gathering.currentNum}명 모집 중 | 총 ${gathering.totalNum}명`}</ContentBody>
        </ContentBox> */}
      </InnerContainer>
      <InnerContainer>
        <ContentBox>
          <SubTitle>어디서 하나요?</SubTitle>
          <MapPreview />
        </ContentBox>
        <ContentBox>
          <SubTitle>함께 하는 사람들</SubTitle>
          <ContentBody>
            {`${gathering.currentNum}명 모집 중 | 총 ${gathering.totalNum}명`}
            <div>
              {gathering.users.map((user, idx) => (
                <div key={idx}>
                  <UserProfile
                    size={1.25}
                    user={user}
                    isCreator={user.id === gathering.creator.id}
                  />
                </div>
              ))}
            </div>
          </ContentBody>
        </ContentBox>
      </InnerContainer>
    </DetailContainer>
  );
};

GathDetail.propTypes = {
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

export default GathDetail;
