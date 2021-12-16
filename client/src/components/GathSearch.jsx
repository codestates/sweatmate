import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import media from "styled-media-query";
import InputDatalist from "./InputDatalist";
import InputDatepicker from "./InputDatepicker";

import { useList } from "../hooks/useList";
import MapPreview from "./MapPreview";
import SearchInput from "./SearchInput";
import InputTotalNum from "./InputTotalNum";

const Container = styled.div`
  height: 13rem;
  width: 18.5rem;
`;

const Search = styled.input`
  width: 18.5rem;
  padding-left: 1rem;
  color: var(--color-black);
  padding-top: 0.5rem;
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 20rem;
  `};
`;

const SearchResult = styled.ul`
  position: absolute;
  width: 18.5rem;
  height: auto;
  max-height: 12rem;
  border: 1px solid var(--color-lightgray);
  border-radius: 1rem;
  background-color: var(--color-white);
  z-index: 5;
  overflow: scroll;
  margin-top: 1.25rem;
  ::-webkit-scrollbar {
    display: none;
  }
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 20rem;
  `}
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
`;

const SearchList = styled.li`
  display: flex;
  align-items: center;
  width: auto;
  height: 3rem;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-lightgray);
  cursor: pointer;
  padding: 1.2rem;
  :hover {
    background-color: var(--color-maingreen--25);
  }
  :last-child {
    border-style: none;
  }
`;

const MapContainer = styled.div`
  width: 18.5rem;
  height: 12rem;
  margin-top: 1rem;
`;

const GathSearch = ({
  step,
  isOnSearch,
  setOnSearch,
  inputValue,
  setInputValue,
  list,
  setList,
  isSelected,
  setIsSelected,
  gathering,
  setGathering,
}) => {
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalNum, setTotalNum] = useState("");
  const selectList = useList();

  const regExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;

  useEffect(() => {
    setGathering({
      ...gathering,
      sportName: (sport && sport.match(regExp).join("")) || "OO",
      sportEmoji: sport.replace(regExp, "") || "❓",
      date: date || new Date(),
      time: time || "언제",
      totalNum: totalNum || 0,
    });
  }, [sport, date, time, totalNum]);

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    if (step === 2) {
      setOnSearch(true);
      const {
        data: { documents },
      } = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${e.target.value}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_KEY}`,
          },
        }
      );
      setList(documents.filter((el) => el.address_name.includes("서울")));
    }
    if (step === 5 || step === 7 || step === 8) {
      step === 5 &&
        setGathering({
          ...gathering,
          timeDescription: e.target.value,
        });
      step === 7 &&
        setGathering({
          ...gathering,
          title: e.target.value,
        });
      step === 8 &&
        setGathering({
          ...gathering,
          description: e.target.value,
        });
    }
  };

  const handleSelect = (el) => {
    setOnSearch(false);
    setIsSelected(true);
    if (step === 2) {
      setInputValue(el.place_name);
      setGathering({
        ...gathering,
        placeName: el.place_name,
        areaName: el.address_name.split(" ")[1],
        latitude: el.y,
        longitude: el.x,
      });
    }
    if (step === 4) {
      setInputValue(el);
      const filtered = selectList.time.filter((a) => a.krName.includes(el.split(" ")[1]))[0].krName;
      setGathering([...gathering, filtered.split(" ")[1]]);
    }
  };

  const handleInputClick = () => {
    if (gathering.length === 0 || gathering.length === step) {
      setGathering(gathering.slice(0, gathering.length - 1));
      setOnSearch(true);
    }
    if (step === 3 || step === 4) {
      setOnSearch(true);
    }
    setInputValue("");
  };

  return (
    <Container>
      {step === 1 && (
        <SearchInput isSport name="운동" htmlFor="sport" hideDivider isInModal={true}>
          <InputDatalist
            id="sport"
            values={selectList.sport}
            placeholder="어떤 운동하세요?"
            item={sport}
            setItem={setSport}
          />
        </SearchInput>
      )}
      {(step === 2 || step === 5 || step === 7 || step === 8) && (
        <SearchInput
          isDate
          name={
            (step === 2 && "장소") ||
            (step === 5 && "시간") ||
            (step === 7 && "모임 제목 (한글 15자 이내)") ||
            (step === 8 && "모임 설명 (한글 20자 이내)")
          }
          hideDivider
          isInModal
        >
          <Search
            value={inputValue}
            placeholder={step === 5 ? "오후 2시" : "작성해주세요 :)"}
            onClick={handleInputClick}
            onChange={handleInputChange}
            isOnSearch={isOnSearch}
            maxLength={step === 8 ? 30 : 15}
          />
        </SearchInput>
      )}
      {step === 3 && (
        <SearchInput isDate name="날짜" htmlFor="date" hideDivider isInModal={true}>
          <InputDatepicker
            id="date"
            placeholder="날짜 입력"
            selectedDate={date}
            setSelectedDate={setDate}
          />
        </SearchInput>
      )}
      {step === 4 && (
        <SearchInput isSport name="시간대" htmlFor="time" hideDivider isInModal={true}>
          <InputDatalist
            id="time"
            values={selectList.time}
            placeholder="어떤 시간대에 하실건가요?"
            item={time}
            setItem={setTime}
          />
        </SearchInput>
      )}
      {step === 6 && (
        <SearchInput name="인원" htmlFor="totalNum" hideDivider isInModal={true}>
          <InputTotalNum
            inputId="totalNum"
            placeholder="인원 입력"
            total={totalNum}
            setTotal={setTotalNum}
            isInModal={true}
          />
        </SearchInput>
      )}

      {isOnSearch && (
        <>
          {step === 2 && list.length >= 1 && (
            <SearchResult>
              {list.map((el) => (
                <SearchList key={el.id} onClick={() => handleSelect(el)}>
                  {el.place_name}
                </SearchList>
              ))}
            </SearchResult>
          )}
          {step === 4 && (
            <SearchResult>
              {selectList.time
                .filter((el) => el.krName.includes(inputValue))
                .map((el) => (
                  <SearchList key={el.id} onClick={() => handleSelect(el.krName)}>
                    {el.krName}
                  </SearchList>
                ))}
            </SearchResult>
          )}
          {(step === 5 || step === 7 || step === 8) && (
            <SearchResult>
              <SearchList onClick={handleSelect}>{inputValue}</SearchList>
            </SearchResult>
          )}
        </>
      )}
      {isSelected && step === 2 && (
        <MapContainer>
          <MapPreview
            sportEngName={
              selectList.sport.filter((el) => el.sportName === gathering.sportName)[0].sportEngName
            }
            place={gathering.placeName}
            latitude={gathering.latitude}
            longitude={gathering.longitude}
          />
        </MapContainer>
      )}
    </Container>
  );
};

export default GathSearch;

GathSearch.propTypes = {
  step: PropTypes.number.isRequired,
  isOnSearch: PropTypes.bool.isRequired,
  setOnSearch: PropTypes.func.isRequired,
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setInputValue: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  setList: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  setIsSelected: PropTypes.func.isRequired,
  gathering: PropTypes.object.isRequired,
  setGathering: PropTypes.func.isRequired,
};
