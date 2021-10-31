import axios from "axios";
import React, { useEffect } from "react";
import PropTypes from "prop-types"; // ES6
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signInAction, signOutAction } from "../store/actions";
const { kakao } = window;

const Map = ({ keyword, lat, lng }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const checkValidUser = async () => {
      const res = await authApi.me();
      if (res.status === 200) {
        dispatch(signInAction(res.data.data));
      } else if (res.status === 202) {
        dispatch(signOutAction);
        history.push("/");
      }
    };
    checkValidUser();
  }, [dispatch, history]);

  useEffect(() => {
    axios
      .get(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${keyword}`, {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_API}`,
        },
      })
      .then((res) => {
        // const firstResult = res.data.documents[0];
        const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
          // 지도를 생성할 때 필요한 기본 옵션
          center: new kakao.maps.LatLng(lng, lat), // 지도의 중심좌표.
          level: 5, // 지도의 레벨(확대, 축소 정도)
        };
        const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        const imageSrc = "../noto_basketball.png"; // 마커이미지의 주소입니다
        const imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
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
      });
  }, []);

  return (
    <>
      <div
        id="map"
        style={{
          width: "30rem",
          height: "20rem",
        }}
      ></div>
    </>
  );
};

Map.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  keyword: PropTypes.string.isRequired,
};

export default Map;
