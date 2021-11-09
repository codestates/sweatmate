import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DataListInput from "react-plain-datalist-input";
// import media from "styled-media-query";
import { FaUserCircle } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import { IoLocationSharp } from "react-icons/io5";
import { ImManWoman } from "react-icons/im";
import { RiLeafLine } from "react-icons/ri";

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  width: 19rem;
  font-size: 1.2rem;
`;

const InfoEdit = styled.input`
  width: 100%;
  height: 2.2rem;
  border: 2px solid gray;
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const SelectContainer = styled(InfoContainer)`
  .datalist-input {
    padding-top: 0.3rem;
    padding-left: 0.3rem;
    width: 100%;
    height: 2.2rem;
    border: 2px solid gray;
    border-radius: 0.5rem;
  }
  .datalist-items {
    width: 17rem;
    margin-top: 1rem;
    position: absolute;
    max-height: 11rem;
    overflow: scroll;
    border: 2px solid var(--color-lightgray);
    border-radius: 0.5rem;
    background-color: var(--color-darkwhite);
    margin-left: -0.4rem;
    div.datalist-active-item.datalist-active-item-default {
      padding-left: 0.3rem;
      background-color: var(--color-darkwhite);
      width: 17rem;
      height: 2.2rem;
      :hover {
        background-color: var(--color-maingreen--25);
      }
    }
    div {
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      width: 17rem;
      background-color: var(--color-darkwhite);
      height: 2.2rem;
      :hover {
        background-color: var(--color-maingreen--25);
      }
    }
  }
`;
const InfoSelect = styled(DataListInput)``;

const ProfileEdit = ({ type, values }) => {
  const onSelect = useCallback((selectedItem) => {}, []);
  const onInput = useCallback((selectedItem) => {}, []);

  const items = useMemo(
    () =>
      values.map((oneItem) => ({
        // required: what to show to the user
        label: oneItem.name,
        // required: key to identify the item within the array
        key: oneItem.id,
        // feel free to add your own app logic to access those properties in the onSelect function
        someAdditionalValue: oneItem.someAdditionalValue,
        // or just keep everything
        ...oneItem,
      })),
    [values]
  );

  const func = (type) => {
    switch (type) {
      case "nickname":
        if (type !== "nickname") break;
        return (
          <>
            <GrMail style={{ display: "inline" }} />
            <InfoEdit name={type} placeholder="이메일" />
          </>
        );
      case "email":
        if (type !== "email") break;
        return (
          <>
            <FaUserCircle style={{ display: "inline" }} />
            <InfoEdit name={type} placeholder="닉네임" />
          </>
        );
      case "area":
        if (type !== "area") break;
        return (
          <SelectContainer>
            <IoLocationSharp style={{ display: "inline" }} />
            <InfoSelect
              name={type}
              placeholder="지역"
              items={items}
              onSelect={onSelect}
              onInput={onInput}
              suppressReselect={false}
            />
          </SelectContainer>
        );
      case "gender":
        if (type !== "gender") break;
        return (
          <SelectContainer>
            <ImManWoman style={{ display: "inline" }} />
            <InfoSelect
              name={type}
              placeholder="성별"
              items={items}
              onSelect={onSelect}
              onInput={onInput}
              suppressReselect={false}
            />
          </SelectContainer>
        );
      case "age":
        if (type !== "age") break;
        return (
          <SelectContainer>
            <RiLeafLine style={{ display: "inline" }} />
            <InfoSelect
              name={type}
              placeholder="나이"
              items={items}
              onSelect={onSelect}
              onInput={onInput}
              suppressReselect={false}
              clearInputOnClick={true}
            />
          </SelectContainer>
        );
      default:
        break;
    }
  };
  return <InfoContainer>{func(type)}</InfoContainer>;
};

export default ProfileEdit;

ProfileEdit.propTypes = {
  type: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.any),
};
