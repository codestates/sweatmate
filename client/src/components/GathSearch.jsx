import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
import MapPreview from "./MapPreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import media from "styled-media-query";
import gathApi from "../api/gath";

const Container = styled.div`
  width: 50rem;
  height: 13rem;
`;

const Search = styled.input`
  width: 23rem;
  height: 5rem;
  border: 1px solid var(--color-lightgray);
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  border-bottom-left-radius: ${(props) => (props.isOnSearch ? "0rem" : "2rem")};
  border-bottom-right-radius: ${(props) => (props.isOnSearch ? "0rem" : "2rem")};
  background-color: var(--color-white);
  padding: 1.2rem;
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  ${media.between("medium", "large")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 16rem;
    `}
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 20rem;
  `}
`;

const Count = styled.div`
  width: 23rem;
  height: 5rem;
  border: 1px solid var(--color-lightgray);
  border-radius: 10rem;
  background-color: var(--color-white);
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  ${media.between("medium", "large")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 16rem;
    `}
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 20rem;
  `}
  button {
    font-size: 2rem;
  }
  input {
    text-align: center;
  }
`;

const SearchResult = styled.ul`
  position: absolute;
  width: 23rem;
  height: auto;
  max-height: 15rem;
  border: 1px solid var(--color-lightgray);
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  background-color: var(--color-white);
  z-index: 5;
  padding: 1.2rem;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  ${media.between("medium", "large")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 16rem;
    `}
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
  :last-child {
    border-style: none;
  }
`;

const StyledDate = styled.div`
  .react-datepicker {
    width: 23rem;
    /* height: 476px; */
    border-radius: 1rem;
    background: var(--color-white);
    border: 1px solid var(--color-lightgray);
    border-top-left-radius: 0rem;
    border-top-right-radius: 0rem;
    padding: 0.5rem 0rem;
    filter: drop-shadow(2px 2px 6px var(--color-shadow));
    ${media.between("medium", "large")`
      /* screen width is between 768px (medium) and 1170px (large) */
      width: 16rem;
    `}
    ${media.lessThan("medium")`
      /* screen width is between 768px (medium) and 1170px (large) */
      width: 20rem;
    `}
    .react-datepicker__header {
      background: none;
      border: none;
      font-size: 25px;
      .react-datepicker__current-month {
        color: var(--color-black);
        font-weight: 300;
        font-size: 1.2rem;
      }
      .react-datepicker__day-names {
        margin-top: 1.5rem;
        > * {
          color: var(--color-black);
          width: auto;
          margin: 0 0.52rem;
          font-size: 0.8rem;
        }
      }
    }
    .react-datepicker__month-container {
      width: 100%;
      height: 100%;

      .react-datepicker__day {
        color: var(--color-gray);
        font-size: 0.8rem;
        width: 2rem;
        line-height: 1.6rem;
        margin: 0;
        border-radius: 0;
      }
    }
    .react-datepicker__navigation--previous {
      left: 20%;
      top: 1.3rem;
      border: none;
      background: url() no-repeat right center;
      color: var(--color-mainblue) !important;
      width: 20px;
      height: 20px;
      outline: none;
      ${media.lessThan("large")`
        /* screen width is between 768px (medium) and 1170px (large) */
        left: 10%;
      `}
    }
    .react-datepicker__navigation--next {
      right: 20%;
      top: 1.3rem;
      border: none;
      background: url() no-repeat left center;
      color: var(--color-mainblue) !important;
      width: 20px;
      height: 20px;
      outline: none;
      ${media.lessThan("large")`
        /* screen width is between 768px (medium) and 1170px (large) */
        right: 10%;
      `}
    }
    .react-datepicker__day--selected {
      color: #a9d3ab !important;
      border-radius: 0 !important;
      background-color: var(--color-mainblue) !important;
      border: 2px solid #a9d3ab !important;
    }
    .react-datepicker__day--in-range {
      background: #132c14 !important;
      border-top: 2px solid #a9d3ab !important;
      border-bottom: 2px solid #a9d3ab !important;
      color: #a9d3ab !important;
    }
    .react-datepicker__day--in-selecting-rage {
      border-radius: 0 !important;
    }
    .react-datepicker .react-datepicker__month-container .react-datepicker__day {
      color: #7a7585;
      font-size: 1.34rem;
      width: 3.7rem;
      line-height: 3.3rem;
      margin: 0;
      border-radius: 0;
    }
    .react-datepicker .react-datepicker__day--selected,
    .react-datepicker__day--range-end {
      color: var(--color-white) !important;
      border-radius: 0 !important;
      background-color: var(--color-mainblue) !important;
      outline: none;
    }
    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__month-text--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range,
    .react-datepicker__quarter-text--selected,
    .react-datepicker__quarter-text--in-selecting-range,
    .react-datepicker__quarter-text--in-range,
    .react-datepicker__year-text--selected,
    .react-datepicker__year-text--in-selecting-range,
    .react-datepicker__year-text--in-range {
      color: var(--color-white) !important;
      border: 1px solid var(--color-mainblue) !important;
    }
    .react-datepicker__day-highlighted-start-date.react-datepicker__day-highlighted-end-date {
      border-radius: 10px !important;
      border: 2px solid #a9d3ab !important;
    }
    .react-datepicker__day-highlighted-start-date {
      border-radius: 10px 0 0 10px !important;
      border-top: 2px solid #a9d3ab !important;
      border-left: 2px solid #a9d3ab !important;
      border-bottom: 2px solid #a9d3ab !important;
      border-right: none !important;
    }
    .react-datepicker__day-highlighted-end-date {
      border-radius: 0 10px 10px 0 !important;
      border-top: 2px solid #a9d3ab !important;
      border-right: 2px solid #a9d3ab !important;
      border-bottom: 2px solid #a9d3ab !important;
      border-left: none !important;
    }
    .react-datepicker__day--today {
      position: relative;
      &:after {
        content: "Today";
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--color-lightblue);
        font-size: 0.6rem;
      }
      &.react-datepicker__day-highlighted-start-date {
        border-radius: 10px 0 0 10px !important;
        border-top: 2px solid #a9d3ab !important;
        border-left: 2px solid #a9d3ab !important;
        border-bottom: 2px solid #a9d3ab !important;
        border-right: none !important;
        &.react-datepicker__day-highlighted-end-date {
          border-radius: 10px !important;
          border: 2px solid #a9d3ab !important;
        }
      }
    }
  }
`;

const StyledDatePicker = styled(DatePicker)`
  font-family: Interop-Bold;
  padding: 0.65rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
  color: var(--color-gray);
  border: 1px solid var(--color-gray);
  font-size: 1rem;
  width: 80%;
  text-align: center;
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
  selectedOptions,
  setSelectedOptions,
}) => {
  const [sports, setSports] = useState([]);
  useEffect(() => {
    const getSports = async () => {
      const { data: sportList } = await gathApi.getSportList();
      setSports(sportList);
    };
    getSports();
  }, []);

  const time = [
    {
      id: 1,
      krName: "🕘 오전",
      enName: "morning",
    },
    {
      id: 2,
      krName: "🕛 오후",
      enName: "afternoon",
    },
    {
      id: 3,
      krName: "🕕 저녁",
      enName: "evening",
    },
  ];

  useEffect(() => {
    if (step === 6) {
      setInputValue(2);
      setSelectedOptions([...selectedOptions, inputValue]);
    }
  }, []);

  const handleInputChange = async (e) => {
    if (step === 2) setOnSearch(true);
    setInputValue(e.target.value);
    if (step === 2) {
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
  };

  const handleSelect = (el) => {
    setOnSearch(false);
    setIsSelected(true);
    if (selectedOptions.length === 0) {
      setInputValue(el.sportName + " " + el.sportEmoji);
      setSelectedOptions([...selectedOptions, el.sportName + " " + el.sportEmoji]);
    }
    if (selectedOptions.length === 1) {
      setInputValue(el.place_name);
      setSelectedOptions([...selectedOptions, el]);
    }
    if (selectedOptions.length === 2) {
      const selectedDate =
        el.getFullYear() +
        "-" +
        (String(el.getMonth() + 1).length === 1 ? "0" + (el.getMonth() + 1) : el.getMonth() + 1) +
        "-" +
        (String(el.getDate() + 1).length === 1 ? "0" + el.getDate() : el.getDate());
      setInputValue(selectedDate);
      setSelectedOptions([...selectedOptions, selectedDate]);
    }
    if (selectedOptions.length === 3) {
      setInputValue(el);
      const filtered = time.filter((a) => a.krName.includes(el.split(" ")[1]))[0].krName;
      setSelectedOptions([...selectedOptions, filtered.split(" ")[1]]);
    }
    if (
      selectedOptions.length === 4 ||
      selectedOptions.length === 6 ||
      selectedOptions.length === 7
    ) {
      setInputValue(el.target.innerText);
      setSelectedOptions([...selectedOptions, el.target.innerText]);
    }
  };

  const handleInputClick = () => {
    if (selectedOptions.length === 0 || selectedOptions.length === step) {
      setSelectedOptions(selectedOptions.slice(0, selectedOptions.length - 1));
      setOnSearch(true);
    }
    if (step === 3 || step === 4) {
      setOnSearch(true);
    }
  };

  const handleCount = (e) => {
    if (e.target.innerText === "+") {
      setInputValue((prevState) => prevState + 1);
    } else if (e.target.innerText === "-") {
      inputValue > 2 && setInputValue((prevState) => prevState - 1);
    }
  };

  const handleCountChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Container>
      {((step >= 1 && step <= 5) || step === 7 || step === 8) && (
        <Search
          value={inputValue}
          placeholder={step === 1 ? "선택해주세요 :)" : step === 5 ? "오후 2시" : "작성해주세요 :)"}
          onClick={handleInputClick}
          onChange={handleInputChange}
          isOnSearch={isOnSearch}
        />
      )}
      {step === 6 && (
        <Count>
          <button onClick={handleCount}>-</button>
          <input value={inputValue} onChange={handleCountChange} />
          <button onClick={handleCount}>+</button>
        </Count>
      )}

      {isOnSearch && (
        <>
          {step === 1 && (
            <SearchResult>
              {sports
                .filter((el) => el.sportName.includes(inputValue))
                .map((el) => (
                  <SearchList key={el.id} onClick={() => handleSelect(el)}>
                    {el.sportName + " " + el.sportEmoji}
                  </SearchList>
                ))}
            </SearchResult>
          )}
          {step === 2 && list.length >= 1 && (
            <SearchResult>
              {list.map((el) => (
                <SearchList key={el.id} onClick={() => handleSelect(el)}>
                  {el.place_name}
                </SearchList>
              ))}
            </SearchResult>
          )}
          {step === 3 && (
            <StyledDate>
              <StyledDatePicker dateFormat="yyyy/MM/dd" onChange={handleSelect} inline />
            </StyledDate>
          )}
          {step === 4 && (
            <SearchResult>
              {time
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
        <MapPreview
          sportName={
            sports.filter((el) => el.sportName === selectedOptions[0].split(" ")[0])[0].sportEngName
          }
          place={selectedOptions[selectedOptions.length - 1].place_name}
          latitude={parseFloat(selectedOptions[selectedOptions.length - 1].x)}
          longitude={parseFloat(selectedOptions[selectedOptions.length - 1].y)}
        />
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
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
