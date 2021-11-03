import axios from "axios";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // ES6
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signinAction, signoutAction } from "../store/actions";
import styled from "styled-components";
import gathApi from "../api/gath";
import GathCard from "../components/GathCard";
import { IoIosArrowBack } from "react-icons/io";
import Btn from "../components/Btn";

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
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, auto));
  top: 5.5rem;
  right: 1rem;
  width: 20rem;
  height: 90%;

  z-index: 10;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 5.5rem;
  left: 0rem;
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  * {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  height: 3.5rem;
  background-color: var(--color-white);
  color: var(--color-maingreen--100);
`;

const GoHomeButton = styled(Button)`
  width: 3rem;
  border-right: 1px solid var(--color-maingreen--25);
`;

const FilterButton = styled(Button)`
  width: 8rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
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
  span {
    margin-right: 0.5rem;
  }
`;

const Map = ({ sportName, place, latitude, longitude }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [gatherings, setGatherings] = useState([]);
  const [sports, setSports] = useState([]);
  const conditionsForMap = useSelector(({ gathReducer }) => gathReducer);

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
  }, []);

  useEffect(() => {
    // 운동, 지역 리스트 받아오기
    const getList = async () => {
      try {
        const { data: sportList } = await gathApi.getSportList();
        setSports(sportList);
      } catch (err) {
        // console.error(err);
      }
    };
    getList();
  }, []);

  useEffect(() => {
    const findGathering = async () => {
      try {
        const {
          data: { gatherings },
        } = await gathApi.findGath(conditionsForMap);
        setGatherings(gatherings);
      } catch (err) {
        console.error(err);
      }
    };
    findGathering();
  }, [sports]);

  useEffect(() => {
    const showMap = async () => {
      axios
        .get(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${place}`, {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_KEY}`,
          },
        })
        .then((res) => {
          // const firstResult = res.data.documents[0];
          const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
          const options = {
            // 지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(longitude, latitude), // 지도의 중심좌표.
            level: 9, // 지도의 레벨(확대, 축소 정도)
          };
          const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
          return map;
        })
        .then((map) => {
          for (let i = 0; i < gatherings.length; i++) {
            const enName = sports.filter((el) => el.sportName === gatherings[i].sportName)[0]
              .sportEngName;

            const imageSrc = `${process.env.PUBLIC_URL}/markers/marker-${enName}.png`; // 마커이미지의 주소입니다
            const imageSize = new kakao.maps.Size(45, 60); // 마커이미지의 크기입니다
            const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
              id: gatherings[i].id,
              map: map,
              position: new kakao.maps.LatLng(gatherings[i].latitude, gatherings[i].longitude),
              title: gatherings[i].title,
              image: markerImage,
            });
            // 마커가 지도 위에 표시되도록 설정합니다.
            marker.setMap(map);
            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, "click", function () {
              // 마커 위에 인포윈도우를 표시합니다
              console.log(marker);
              customOverlay.setMap(map);
            });
          }

          // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          const content = `<div id="overlay">
            <div class="customoverlay">
              <a href="https://map.kakao.com/link/map/11394059" target="_blank">
                <span class="title">${`한강공원 오버레이`}</span>
              </a>
            </div>
          </div>
          `;

          // 커스텀 오버레이가 표시될 위치입니다
          const position = new kakao.maps.LatLng(longitude, latitude);

          // 커스텀 오버레이를 생성합니다
          const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: content,
            yAnchor: 5,
          });

          // const contentUpperSection = document.querySelector(".customoverlay").parent;
          document.querySelector("#overlay").style.border = "1px solid red";
        });
    };

    showMap();
  }, [gatherings]);

  return (
    <>
      <MapContainer id="map"></MapContainer>
      <GathList>
        {gatherings.map((el, idx) => (
          <GathCard key={idx} gathering={el} />
        ))}
      </GathList>
      <ButtonContainer>
        <GoHomeButton>
          <IoIosArrowBack />
        </GoHomeButton>
        <FilterButton>돌아가기</FilterButton>
      </ButtonContainer>
      <SearchHereButton>
        {"📍"}
        <span />
        {"이 위치에서 재검색"}
      </SearchHereButton>
    </>
  );
};

Map.defaultProps = {
  sportName: "soccer",
  place: "이촌한강공원",
  latitude: 126.970526590861,
  longitude: 37.5172404421072,
};

Map.propTypes = {
  sportName: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default Map;
