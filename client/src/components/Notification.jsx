import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { IoChevronForward, IoClose } from "react-icons/io5";

const NotiContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  :hover {
    background-color: var(--color-maingreen--10);
    #go {
      visibility: visible;
    }
  }
  cursor: pointer;
  ${(props) =>
    props.isEmpty &&
    css`
      cursor: unset;
      :hover {
        background-color: unset;
      }
      #go,
      #delete {
        visibility: hidden !important;
      }
    `}
`;

const NotiContent = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  border-radius: 0.6rem;
  margin-right: 0.5rem;
`;

const NotiTitle = styled.div`
  font-size: 1rem;
  line-height: var(--lineHeight-relaxed);
  font-family: Interop-SemiBold;
  color: var(--color-darkgray);
  margin-bottom: 0.25rem;
`;

const NotiMessage = styled.p`
  font-size: 0.875rem;
  line-height: var(--lineHeight-loose);
  font-family: Interop-Regular;
  max-width: 20rem;
  min-width: 15rem;
  word-wrap: break-word;
  word-break: keep-all;
  ${(props) =>
    props.disabled &&
    css`
      color: var(--color-gray);
    `}
`;

const GoMark = styled.div`
  flex: 0 0 auto;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  color: var(--color-darkgray);
  visibility: hidden;
  :hover {
    color: var(--color-maingreen--100);
  }
`;

const DeleteBtn = styled.button`
  flex: 0 0 auto;
  font-size: 1.25rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  color: var(--color-gray);
  :hover {
    color: var(--color-red);
    opacity: 0.9;
  }
`;

function Notification({ isEmpty, item }) {
  return (
    <NotiContainer isEmpty={isEmpty}>
      <NotiContent onClick={() => {}}>
        {item.title && <NotiTitle>{item.title}</NotiTitle>}
        <NotiMessage disabled={isEmpty}>{item.message}</NotiMessage>
      </NotiContent>
      <GoMark id="go">
        <IoChevronForward />
      </GoMark>
      <DeleteBtn id="delete" onClick={() => {}}>
        <IoClose />
      </DeleteBtn>
    </NotiContainer>
  );
}

Notification.defaultProps = {
  isEmpty: false,
  item: {
    gatheringId: null,
    id: null,
    message: "메시지가 없습니다.",
    title: null,
    type: null,
    url: null,
  },
};

Notification.propTypes = {
  isEmpty: PropTypes.bool,
  item: PropTypes.shape({
    gatheringId: PropTypes.number,
    id: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default Notification;

/* 
<NotificationWrapper>
  {notificationList.length === 0 && (
    <NotificationItem>
      <Message>메시지가 없습니다.</Message>
    </NotificationItem>
  )}
  {notificationList.map((item) => (
    <NotificationItem key={item.id}>
      <Message>
        {item.title}
        <br />
        {item.message}
      </Message>
      {item.url && (
        <GoLink
          to={item.url}
          onClick={() => {
            closeAll();
            handleNotiBtnClick(item.id);
          }}
        >
          <IoChevronForward />
        </GoLink>
      )}
      <DeleteBtn type="button" onClick={() => handleNotiBtnClick(item.id)}>
        <IoClose />
      </DeleteBtn>
    </NotificationItem>
  ))}
</NotificationWrapper>; 
*/
