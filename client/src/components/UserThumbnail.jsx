import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ReactComponent as Blank } from "../assets/defaultProfile.svg";

const ThumbnailContainer = styled(Link)`
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
  border-radius: 50%;
  overflow: hidden;
`;

const Image = styled.div`
  background-image: url(${(props) => props.url});
  background-size: cover;
  width: 100%;
  height: 0;
  padding-top: 100%;
`;

const BlankImage = styled(Blank)`
  margin-bottom: 10%;
  width: 100%;
  height: 120%;
`;

const UserThumbnail = ({ size, user }) => {
  return (
    <ThumbnailContainer size={size} to={`/users/${user.id}`}>
      {user.image ? <Image url={user.image} /> : <BlankImage />}
    </ThumbnailContainer>
  );
};

UserThumbnail.propTypes = {
  size: PropTypes.number.isRequired,
  user: PropTypes.exact({
    id: PropTypes.string,
    nickname: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default UserThumbnail;
