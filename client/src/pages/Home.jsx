import React from "react";
import GathCard from "../components/GathCard";
import Btn from "../components/Btn";

const Home = () => {
  /* 모임 정보 Dummy */
  const gathering = {
    gatheringId: 12,
    title: "농구 함 때려볼 용산러들~!",
    description: "용산에서 즐기면서 농구하는 사람들 한 판 같이 합시다~",
    creator: {
      id: "uuid",
      nickname: "농구에 미친 사람",
      image: "",
    },
    areaName: "용산구",
    placeName: "이촌한강공원 농구대",
    latitude: 33.450701,
    longitude: 126.570667,
    date: "2021-10-27",
    time: "evening",
    timeDescription: "19시",
    totalNum: 4,
    currentNum: 2,
    sportName: "농구",
    sportEmoji: "🏀",
    done: false,
    users: [
      {
        id: "uuid",
        nickname: "농구킹",
        image: "imageUrl",
      },
    ],
  };

  return (
    <div>
      <GathCard gathering={gathering} />
      <Btn value="버튼버튼버튼" />
    </div>
  );
};

export default Home;
