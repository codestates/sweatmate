import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";

const Container = styled.div`
  width: 100%;
  * {
    margin: 0;
    padding: 0;
  }
  .react-datepicker-wrapper {
    margin-top: 0.25rem;
    padding: 0 1rem 0.75rem;
  }
  .react-datepicker__input-container {
    > input {
      width: 100%;
      ::placeholder {
        color: var(--color-gray);
        font-family: Interop-Light;
      }
    }
    > button {
      display: none;
    }
  }
  .react-datepicker-popper {
    padding-top: 0.75rem;
  }
  .react-datepicker {
    background-color: var(--color-white);
    border: none;
    border-radius: 1rem;
    filter: drop-shadow(0px 6px 10px var(--color-shadow));
  }
  .react-datepicker__month-container {
    > * {
      border: 0;
    }
  }
  .react-datepicker__month {
    margin: 0.5rem;
  }
  .react-datepicker__header {
    border-radius: 1rem 1rem 0 0;
    background-color: transparent;
    font-family: Interop-Medium;
  }
  .react-datepicker__navigation {
    margin: 0.5rem 0;
  }
  .react-datepicker__current-month {
    color: var(--color-darkgray);
    margin: 0.5rem 0;
  }
  .react-datepicker__day-names {
    margin-top: -0.5rem;
    border-bottom: 1px solid var(--color-lightgray);
  }
  .react-datepicker__day-name {
    font-size: 1rem;
    width: 2rem;
    line-height: 2rem;
    margin: 0.25rem;
    color: var(--color-darkgray);
  }
  .react-datepicker__week {
    > * {
      border-radius: 0.4rem;
      color: var(--color-darkgray);
      font-family: Interop-Medium;
      font-size: 1rem;
      width: 2rem;
      line-height: 2rem;
      margin: 0.25rem;
    }
    .react-datepicker__day {
      :hover {
        background-color: var(--color-maingreen--10);
      }
    }
    .react-datepicker__day--selected {
      color: var(--color-white);
      background-color: var(--color-maingreen--75);
      :hover {
        color: var(--color-white);
        background-color: var(--color-maingreen--75);
        opacity: 0.8;
      }
    }
    .react-datepicker__day--today {
      border: 2px solid var(--color-maingreen--75);
      line-height: calc(2rem - 2px);
    }
  }
`;

const CustomHeader = styled.div`
  margin: 1rem;
  font-size: 1.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .month-navigation-arrow {
    font-size: 1.5rem;
  }
  .left {
    margin-right: 2rem;
  }
  .right {
    margin-left: 2rem;
  }
  .month-navigation-button {
    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
    border-radius: 0.4rem;
    color: var(--color-gray);
    :hover {
      color: var(--color-darkgray);
      background-color: var(--color-darkwhite);
    }
  }
`;

const MonthYearContainer = styled.div`
  color: var(--color-darkgray);
  display: flex;
  font-size: 1.125rem;
  > * {
    margin-right: 0.6rem;
    :last-of-type {
      margin-right: 0;
    }
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
  color: var(--color-lightgray);
  :hover {
    color: var(--color-gray);
  }
`;

const HomeDatepicker = ({ placeholder, setDisplayedDate }) => {
  const display = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleClearClick = () => {
    setSelectedDate(null);
  };
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  useEffect(() => {
    if (!selectedDate) return setDisplayedDate("");
    const formatedArr = `${selectedDate}`.split(" ").slice(1, 4);
    const formatedDate = `${formatedArr[2]}년 ${months[formatedArr[0]]}월 ${
      formatedArr[1][0] === "0" ? formatedArr[1].slice(1) : formatedArr[1]
    }일`;
    setDisplayedDate(formatedDate);
  }, [selectedDate]);
  return (
    <Container>
      <DatePicker
        ref={display}
        showPopperArrow={false}
        minDate={new Date()}
        dateFormat="yyyy년 MM월 dd일"
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
        }}
        locale={ko}
        placeholderText={placeholder}
        disabledKeyboardNavigation
        isClearable
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <CustomHeader>
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="month-navigation-button left"
            >
              <FiChevronLeft className="month-navigation-arrow" />
            </button>
            <MonthYearContainer>
              <span>{`${getYear(date)}년`}</span>
              <span>{`${getMonth(date) + 1}월`}</span>
            </MonthYearContainer>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="month-navigation-button right"
            >
              <FiChevronRight className="month-navigation-arrow" />
            </button>
          </CustomHeader>
        )}
      ></DatePicker>
      {selectedDate && (
        <ClearBtn onClick={handleClearClick}>
          <IoCloseCircle />
        </ClearBtn>
      )}
    </Container>
  );
};

HomeDatepicker.propTypes = {
  placeholder: PropTypes.string.isRequired,
  setDisplayedDate: PropTypes.func.isRequired,
};

export default HomeDatepicker;
