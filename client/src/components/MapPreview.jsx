import axios from "axios";
import React, { useEffect } from "react";
import PropTypes from "prop-types"; // ES6
import styled from "styled-components";
const { kakao } = window;

const MapContainer = styled.div`
  width: 23rem;
  height: 15rem;
  border-radius: 1rem;
`;

const Map = ({ sportName, place, latitude, longitude }) => {
  useEffect(() => {
    axios
      .get(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${place}`, {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_REST_KEY}`,
        },
      })
      .then((res) => {
        // const firstResult = res.data.documents[0];
        const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
          // 지도를 생성할 때 필요한 기본 옵션
          center: new kakao.maps.LatLng(longitude, latitude), // 지도의 중심좌표.
          level: 4, // 지도의 레벨(확대, 축소 정도)
        };
        const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        const imageSrc = `${process.env.PUBLIC_URL}/markers/marker-${sportName}.png`; // 마커이미지의 주소입니다
        const imageSize = new kakao.maps.Size(45, 60); // 마커이미지의 크기입니다
        const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        const markerPosition = options.center;

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        // 마커가 지도 위에 표시되도록 설정합니다.

        marker.setMap(map);

        const iwContent = `<div class="infowindow" style="padding:5px;">${place} <a href="https://map.kakao.com/link/search/${place}" style="color:blue" target="_blank">🗺</a> </div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        const iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); // 인포윈도우 표시 위치입니다

        // 인포윈도우를 생성합니다
        const infowindow = new kakao.maps.InfoWindow({
          position: iwPosition,
          content: iwContent,
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "click", function () {
          // 마커 위에 인포윈도우를 표시합니다
          infowindow.open(map, marker);
        });
      });
  }, []);

  return (
    <>
      <MapContainer id="map"></MapContainer>
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
