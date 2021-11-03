import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "styled-media-query";
import GathCard from "../components/GathCard";
import { MdOutlinePending, MdOutlineCheckCircle } from "react-icons/md";
import { signinAction, signoutAction } from "../store/actions";
import authApi from "../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import gatheringApi from "../api/gathering";
import Loading from "../components/Loading";

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
const LoadingContainer = styled.div`
  width: 100%;
  height: 20rem;
`;
const Gatherings = styled.div`
  display: grid;
  grid-gap: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, auto));
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

const Schedule = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isPassed, setIsPassed] = useState(false);
  const [gatherings, setGatherings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useSelector(({ authReducer }) => authReducer);

  const dispatch = useDispatch();
  const history = useHistory();

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

  const handleUpcomingClick = () => {
    setIsUpcoming(true);
    setIsPassed(false);
  };
  const handlePassedClick = () => {
    setIsUpcoming(false);
    setIsPassed(true);
  };

  useEffect(() => {
    const getGatherings = async () => {
      setIsLoading(true);
      if (isUpcoming) {
        try {
          const res = await gatheringApi.upcoming(id);
          if (res.status === 200) {
            setGatherings(res.data.gatherings);
          }
        } catch (err) {
          console.log(err);
        }
      } else if (isPassed) {
        try {
          const res = await gatheringApi.passed(id);
          if (res.status === 200) {
            setGatherings(res.data.gatherings);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    id && getGatherings();
  }, [isUpcoming, isPassed, id]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [gatherings]);

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
      {isLoading && (
        <LoadingContainer>
          <Loading isTransparent />
        </LoadingContainer>
      )}

      {!isLoading &&
        (gatherings.length === 0 ? (
          <EmptyContainer>일정이 없어요 💦</EmptyContainer>
        ) : (
          <Gatherings>
            {gatherings.map((gath) => (
              <GathCard key={gath.id} gathering={gath} />
            ))}
          </Gatherings>
        ))}
    </Container>
  );
};

export default Schedule;
