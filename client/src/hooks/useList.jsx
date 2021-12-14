import { useState, useEffect } from "react";
import gathApi from "../api/gath";

export function useList() {
  const [list, setList] = useState({
    sport: [],
    area: [],
    time: [
      { id: 1, timeName: "오전" },
      { id: 2, timeName: "오후" },
      { id: 3, timeName: "저녁" },
    ],
  });
  useEffect(() => {
    // 운동, 지역 리스트 받아오기
    const getList = async () => {
      try {
        const sportList = await gathApi.getSportList();
        const areaList = await gathApi.getAreaList();
        setList({ ...list, sport: sportList.data, area: areaList.data });
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  }, []);
  return list;
}
