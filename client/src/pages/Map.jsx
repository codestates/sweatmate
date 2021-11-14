import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types"; // ES6
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineAim } from "react-icons/ai";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import debounce from "lodash/debounce";
import media from "styled-media-query";

import authApi from "../api/auth";
import gathApi from "../api/gath";
import { searchGathAction, signinAction, signoutAction } from "../store/actions";
import GathCard from "../components/GathCard";
import Btn from "../components/Btn";

const { kakao } = window;

const MapContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 73px);
  height: calc(var(--vh, 1vh) * 100 - 73px);
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  text-align: center;
  ${media.lessThan("medium")`
    height: calc(100vh - 57px);
    height: calc(var(--vh, 1vh) * 100 - 57px);
  `};
`;

const GathList = styled.div`
  box-sizing: content-box;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  overflow: scroll;
  transition: margin 0.7s ease-in-out;
  -moz-transition: margin 0.7s ease-in-out;
  -webkit-transition: margin 0.7s ease-in-out;
  ::-webkit-scrollbar {
    display: none;
  }
  ${media.greaterThan("medium")`
    flex-direction: column;
    position: absolute;
    top: 0rem;
    right: 1rem;
    width: 21rem;
    height: 100%;
    margin: ${(props) => (props.listView ? "0rem 0rem" : "0rem -21rem")};
    > div:first-child {
    margin-top: 0.8rem;
    }
  `};
  ${media.lessThan("medium")`
    flex-direction: row;
    position: absolute;
    left: 0rem;
    bottom: ${(props) => (props.conditions ? "5.5rem" : "0.5rem")}; 
    width: 100%;
    margin: ${(props) => (props.listView ? "0rem 0rem" : "-18rem 0rem")};
    > * {
      margin: 0rem 0.3rem;
    }
    > div:first-child {
      margin-left: 0.8rem;
    }
  `};
`;

const StyledGathCard = styled(GathCard)`
  border: 3px solid var(--color-white);
  &.hovered {
    border: 3px solid var(--color-maingreen--50);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0.8rem;
  left: 0rem;
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  z-index: 10;
  margin: ${(props) => (props.listView ? "0rem 0rem" : "0rem -6rem")};
  transition: margin 0.7s ease-in-out;
  -moz-transition: margin 0.7s ease-in-out;
  -webkit-transition: margin 0.7s ease-in-out;
`;

const GoHomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  background-color: var(--color-white);
  color: var(--color-maingreen--100);
  width: 3rem;
  border-right: 1px solid var(--color-maingreen--25);
  font-size: 1.2rem;
`;

const FilterButton = styled.button`
  height: 3.5rem;
  background-color: var(--color-white);
  color: var(--color-maingreen--100);
  width: 4rem;
  border-top-right-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  cursor: unset;
`;

const SearchHereButton = styled(Btn)`
  position: absolute;
  bottom: 1rem;
  left: calc((100vw - 15rem) * 0.5);
  right: calc((100vw - 15rem) * 0.5);
  background-color: var(--color-maingreen--100);
  color: var(--color-white);
  width: 15rem;
  height: 4rem;
  border-radius: 5rem;
  z-index: 10;
  span {
    margin-right: 0.5rem;
  }
  ${media.lessThan("medium")`
    left: 2%;
    width: 96%;  
    border-radius: 1rem;
    bottom: 0.7rem;
  `};
`;

const Center = styled.button`
  position: absolute;
  width: 2rem;
  height: 2rem;
  left: calc((100vw - 2rem) * 0.5);
  right: calc((100vw - 2rem) * 0.5);
  top: calc((100vh - 5rem) * 0.5);
  top: calc((var(--vh, 1vh) * 100 - 5rem) * 0.5);
  bottom: calc((100vh - 5rem) * 0.5);
  bottom: calc((var(--vh, 1vh) * 100 - 5rem) * 0.5);
  color: var(--color-red);
  border-radius: 100%;
  z-index: 10;
`;

const CustomOverlayFlexContainer = styled(CustomOverlayMap)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  max-width: 20rem;
  height: auto;
  padding: 0.5rem;
  background-color: white;
  border-radius: 1rem;
  div {
    width: auto;
    height: 1.5rem;
    font-family: Interop-Light;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: var(--color-gray);
    z-index: 999;
  }
  div:first-child {
    width: auto;
    font-family: Interop-Bold;
    border-bottom: 1px solid var(--color-lightgray);
    font-size: 0.8rem;
    color: var(--color-maingreen--100);
    z-index: 999;
  }
  div:last-child {
    position: absolute;
    top: -0.8rem;
    right: -0.8rem;
    font-size: 1.5rem;
    color: var(--color-maingreen--100);
    z-index: 999;
  }
`;

const GathMap = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { conditions, gatherings } = useSelector(({ gathReducer }) => gathReducer);
  const [map, setMap] = useState();
  const [points, setPoints] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [listView, setListView] = useState(true);
  const [address, setAddress] = useState(conditions.area);
  // const [isSearched, setIsSearched] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false);

  const bounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    points &&
      points.length > 0 &&
      points.forEach((point) => {
        bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
      });
    return bounds;
  }, [points]);

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
    if (Object.values(conditions).every((el) => Boolean(el) === false)) {
      const findGath = async () => {
        const { data } = await gathApi.getAllGath();
        dispatch(searchGathAction({ conditions: data.conditions, gatherings: data.gatherings }));
      };
      findGath();
    } else {
      const findGath = async () => {
        const { data } = await gathApi.findGath(conditions);
        const newConditions = {
          sportName: conditions.sport,
          areaName: conditions.area,
          date: conditions.date,
          time: conditions.time,
          totalNum: conditions.totalNum,
        };

        dispatch(searchGathAction({ conditions: newConditions, gatherings: data.gatherings }));
      };
      findGath();
    }
  }, []);

  useEffect(() => {
    const collectPoints = () => {
      const newPoints =
        gatherings &&
        gatherings.length > 0 &&
        gatherings.map((el) => ({
          lat: Number(el.latitude),
          lng: Number(el.longitude),
        }));
      setPoints(newPoints);
    };
    collectPoints();
  }, []);

  useEffect(() => {
    const newConditions = {
      sportName: conditions.sport,
      areaName: address,
      date: conditions.date,
      time: conditions.time,
      totalNum: conditions.totalNum,
    };
    dispatch(searchGathAction({ conditions: newConditions, gatherings }));
  }, [address]);

  useEffect(() => {
    // if (isLoaded) {
    if (map) map.setBounds(bounds);
    const newConditions = {
      sportName: conditions.sport,
      areaName: conditions.area,
      date: conditions.date,
      time: conditions.time,
      totalNum: conditions.totalNum,
    };
    dispatch(searchGathAction({ conditions: newConditions, gatherings }));
    // }
    // }, [isLoaded]);
  }, []);

  const handleDragStart = () => {
    setListView(false);
  };

  const handleDragEnd = () => {
    setListView(true);
  };

  const handleCenterChange = debounce(() => {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
    searchAddrFromCoords(map.getCenter(), debounce(displayCenterInfo, 50));

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, "idle", function () {
      searchAddrFromCoords(map.getCenter(), debounce(displayCenterInfo, 50));
    });

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const infoDiv = result[0].region_2depth_name;
        setAddress(infoDiv);
      }
    }
  }, 50);

  const handleSearchHere = async () => {
    const findGath = async () => {
      const { data: wholeData } = await gathApi.getAllGath();
      if (conditions.sport || conditions.area) {
        const newConditions = {
          sportName: conditions.sport,
          areaName: address,
          date: conditions.date,
          time: conditions.time,
          totalNum: conditions.totalNum,
        };
        const { data } = await gathApi.findGath(conditions);
        const newGatherings =
          data.gatherings && data.gatherings.length > 0 ? [...data.gatherings] : wholeData;
        if (data.gatherings.length === 0)
          dispatch(searchGathAction({ conditions: newConditions, gatherings: newGatherings }));
        else dispatch(searchGathAction({ conditions: newConditions, gatherings: newGatherings }));
      } else {
        const newConditions = {
          sportName: conditions.sport,
          areaName: conditions.area,
          date: conditions.date,
          time: conditions.time,
          totalNum: conditions.totalNum,
        };
        const newGatherings = [...wholeData.gatherings];
        dispatch(searchGathAction({ conditions: newConditions, gatherings: newGatherings }));
      }
    };
    findGath();
  };

  return (
    <MapContainer id={"marker"}>
      <Map
        center={{
          lat: 37.54861162159671,
          lng: 127.00215843848797,
        }}
        style={{ width: "100vw", height: "100%" }}
        level={8} // 지도의 확대 레벨
        onCreate={(e) => {
          setMap(e);
          // setIsLoaded(true);
        }}
        onIdle={handleCenterChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {gatherings.length > 0 &&
          gatherings.map((el, idx) => (
            <>
              <MapMarker
                key={idx.toString() + "marker"}
                position={{ lat: el.latitude, lng: el.longitude }}
                image={{
                  src: `${process.env.PUBLIC_URL}/markers/marker-${el.sportEngName}.png`, // 마커이미지의 주소입니다
                  size: {
                    width: 30,
                    height: 40,
                  }, // 마커이미지의 크기입니다
                  options: {
                    offset: {
                      x: 27,
                      y: 69,
                    }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                  },
                }}
                onMouseOver={debounce(() => {
                  setHovered(idx);
                }, 20)}
                onMouseOut={debounce(() => {
                  setHovered(null);
                }, 20)}
                onClick={() => {
                  document
                    .getElementsByClassName("gathcard")
                    [idx].scrollIntoView({ behavior: "smooth" });
                }}
              ></MapMarker>
              {hovered === idx && (
                <CustomOverlayFlexContainer
                  key={idx.toString() + "overlay"}
                  position={{ lat: Number(el.latitude), lng: Number(el.longitude) }}
                  xAnchor={0.7}
                  onClick={() => {
                    window.open(`https://map.kakao.com/link/search/${el.placeName}`);
                  }}
                >
                  <div>{el.title}</div>
                  <div>{el.description}</div>
                  <div>{el.sportEmoji}</div>
                </CustomOverlayFlexContainer>
              )}
            </>
          ))}
      </Map>
      <GathList id="gathlist" listView={listView} conditions={conditions.sport}>
        {gatherings &&
          gatherings.length > 0 &&
          gatherings.map((el, idx) =>
            hovered === idx ? (
              <StyledGathCard
                key={idx.toString() + "card"}
                gathering={el}
                className="hovered gathcard"
                onMouseEnter={(e) => {
                  if (e.target === e.currentTarget) setHovered(idx);
                }}
                onMouseLeave={(e) => {
                  if (e.target === e.currentTarget) setHovered(null);
                }}
              />
            ) : (
              <StyledGathCard
                key={idx.toString() + "card"}
                gathering={el}
                className="gathcard"
                onMouseEnter={(e) => {
                  if (e.target === e.currentTarget) setHovered(idx);
                }}
                onMouseLeave={(e) => {
                  if (e.target === e.currentTarget) setHovered(null);
                }}
              />
            )
          )}
      </GathList>
      <ButtonContainer listView={listView}>
        <GoHomeButton to="/home">
          <IoIosArrowBack />
        </GoHomeButton>
        <FilterButton>홈</FilterButton>
      </ButtonContainer>
      <Center>
        <AiOutlineAim />
      </Center>
      {conditions.sport && (
        <SearchHereButton onClick={handleSearchHere}>
          <span>{`📍 여기에서 재검색 `}</span>
        </SearchHereButton>
      )}
    </MapContainer>
  );
};

GathMap.defaultProps = {
  sportName: "soccer",
  place: "이촌한강공원",
  latitude: 126.970526590861,
  longitude: 37.5172404421072,
};

GathMap.propTypes = {
  sportName: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default GathMap;
