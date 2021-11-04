import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types"; // ES6
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import authApi from "../api/auth";
import { signinAction, signoutAction } from "../store/actions";
import styled from "styled-components";
import gathApi from "../api/gath";
import GathCard from "../components/GathCard";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineAim } from "react-icons/ai";
import Btn from "../components/Btn";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import debounce from "lodash/debounce";

const { kakao } = window;

const MapContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 73px);
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  text-align: center;
`;

const GathList = styled.div`
  border-radius: 1rem;
  position: absolute;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: none;
  top: 0.8rem;
  right: 1rem;
  width: 20rem;
  height: 97%;
  z-index: 10;
  overflow: scroll;

  margin: ${(props) => (props.listView ? "0rem 0rem" : "0rem -20rem")};
  transition: margin 0.7s ease-in-out;
  -moz-transition: margin 0.7s ease-in-out;
  -webkit-transition: margin 0.7s ease-in-out;
  .hovered {
    border: 3px solid var(--color-maingreen--50);
  }
  * {
    max-height: 13rem;
  }
  ::-webkit-scrollbar {
    display: none;
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
`;

const Center = styled.button`
  position: absolute;
  width: 2rem;
  height: 2rem;
  left: calc((100vw - 2rem) * 0.5);
  right: calc((100vw - 2rem) * 0.5);
  top: calc((100vh - 5rem) * 0.5);
  bottom: calc((100vh - 5rem) * 0.5);
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
  max-width: 12rem;
  height: auto;
  padding: 0.5rem;
  background-color: white;
  border-radius: 1rem;
  div {
    width: 12rem;
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
    right: -5.8rem;
    font-size: 1.5rem;
    color: var(--color-maingreen--100);
    z-index: 999;
  }
`;

const GathMap = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [gatherings, setGatherings] = useState([]);
  const conditionsForMap = useSelector(({ gathReducer }) => gathReducer);
  const [map, setMap] = useState();
  const [points, setPoints] = useState([]);
  const [state, setState] = useState({});
  const [hovered, setHovered] = useState(null);
  const [listView, setListView] = useState(true);
  const [address, setAddress] = useState("");

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

    const findGathering = async () => {
      try {
        const {
          data: { gatherings },
        } = await gathApi.findGath(conditionsForMap);
        setGatherings(() => gatherings);
      } catch (err) {
        console.error(err);
      }
    };
    findGathering();
  }, []);

  const bounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    points.forEach((point) => {
      bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
    });
    return bounds;
  }, [points]);

  // 지도에 모임 좌표 정보 모으기
  const collectPoints = useCallback(() => {
    const newPoints = gatherings.map((el) => ({
      lat: parseFloat(el.latitude),
      lng: parseFloat(el.longitude),
    }));
    setPoints(() => newPoints);
  }, [points]);

  // 주소-좌표 변환 객체를 생성합니다
  const geocoder = new kakao.maps.services.Geocoder();

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  const handleDrag = (e) => {
    setListView((prev) => !prev);
    const callback = (mouseEvent) => {
      console.log(mouseEvent);
      return searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const detailAddr = result[0].road_address;
          console.log(detailAddr);
          return detailAddr;
        }
      });
    };
    console.log(setAddress, callback);
    // setAddress(searchDetailAddrFromCoords(state.center, callback));
  };

  return (
    <MapContainer id={"marker"}>
      <Map
        center={{
          lat: 37.54861162159671,
          lng: 127.18215843848797,
        }}
        style={{ width: "100vw", height: "100%" }}
        level={9} // 지도의 확대 레벨
        onCreate={(map) => {
          if (points.length === 0) collectPoints();
          setMap(map);
        }}
        onCenterChanged={debounce((map) => {
          setState({
            level: map.getLevel(),
            center: {
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            },
          });
        }, 15)}
        onDragStart={handleDrag}
        onDragEnd={handleDrag}
      >
        {gatherings.map((el, idx) => (
          <MapMarker
            key={`${el.id}`}
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
            onMouseOver={() => {
              setHovered(idx);
            }}
            onMouseOut={() => {
              setHovered(null);
            }}
            onClick={() => {
              window.open(`https://map.kakao.com/link/search/${el.placeName}`);
            }}
          ></MapMarker>
        ))}
        {gatherings.map(
          (el, idx) =>
            hovered === idx && (
              <CustomOverlayFlexContainer
                key={idx}
                position={{ lat: Number(el.latitude), lng: Number(el.longitude) }}
                xAnchor={0.7}
              >
                <div>{el.title}</div>
                <div>{el.description}</div>
                <div>{el.sportEmoji}</div>
              </CustomOverlayFlexContainer>
            )
        )}
        <GathList listView={listView}>
          {gatherings.map((el, idx) =>
            hovered === idx ? (
              <GathCard
                key={idx}
                gathering={el}
                className="hovered"
                onMouseOver={() => {
                  setHovered(idx);
                }}
                onMouseOut={() => {
                  setHovered(null);
                }}
              />
            ) : (
              <GathCard
                key={idx}
                gathering={el}
                onMouseOver={() => {
                  setHovered(idx);
                }}
                onMouseOut={() => {
                  setHovered(null);
                }}
              />
            )
          )}
        </GathList>
        <ButtonContainer listView={listView}>
          <GoHomeButton>
            <IoIosArrowBack />
          </GoHomeButton>
          <FilterButton>홈</FilterButton>
        </ButtonContainer>
        <Center>
          <AiOutlineAim />
        </Center>
        <SearchHereButton
          onClick={() => {
            if (map) map.setBounds(bounds);
          }}
        >
          {"📍"}
          <span />
          {"이 위치에서 재검색"}
          {address}
        </SearchHereButton>
        {console.log("state", state)}{" "}
      </Map>
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
