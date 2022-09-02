import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import Loader from '../Layout/Loader';
import io from 'socket.io-client';

import { markMessageAsRead } from '../../store/actions/messageActions';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: 'flex',
    height: 'calc(100vh - 66px)',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 102px)',
    },
  },
}));

let socket;

const Chat = ({ widthProps }) => {
  const classes = useStyles();
  const { chatReducer, userReducer } = useSelector((state) => state);
  const { currentUserDetails } = userReducer;
  const { chat } = chatReducer;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => socketInitializer(), [router.query.id]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.emit('setup', currentUserDetails);
    // socket.emit('join room', chat._id);
    // dispatch(markMessageAsRead(chat._id));
  };

  // useEffect(() => {
  //   socket.emit("setup", currentUserDetails);
  //   socket.emit("join room", chat._id);
  //   dispatch(markMessageAsRead(chat._id));
  // }, [router.query.id]);

  return (
    <div
      style={{ width: `${widthProps}` }}
      className={classes.chatContainer}
    >
      {chat &&
      Object.keys(chat).length > 0 &&
      chat.constructor === Object ? (
        <>
          <ChatHeader />
          <ChatMessages chat={chat} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  widthProps: PropTypes.string.isRequired,
};
