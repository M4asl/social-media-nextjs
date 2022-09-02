import { makeStyles } from '@material-ui/core';
import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ChatColumn from '../../components/Chats/ChatColumn';
import Chat from '../../components/Chats/ChatContainer';
import Navbar from '../../components/Layout/Navbar';
import { authCookie } from '../../store/actions/authActions';
import { getChatsByUser } from '../../store/actions/chatActions';
import {
  getCurrentUserDetails,
  getUsersList,
} from '../../store/actions/userActions';
import { wrapper } from '../../store/store';

const useStyles = makeStyles(() => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: '#bfbfbf',
      borderRadius: '15px',
    },
    '*::-webkit-scrollbar-track': {
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      borderRadius: '15px',
      backgroundColor: '#bfbfbf',
    },
    '*::-webkit-scrollbar-thumb': {
      borderRadius: '15px',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
      backgroundColor: '#2d2d2d',
    },
  },
  chatContainer: {
    position: 'absolute',
    top: '66px',
    zIndex: '100',
    display: 'flex',
    width: '100%',
  },
}));

const Chats = () => {
  const classes = useStyles();
  const router = useRouter();
  const { chatReducer } = useSelector((state) => state);
  const [chatsList, setChatsList] = useState([]);

  useEffect(() => {
    setChatsList(chatReducer.chats);
    if (chatsList && chatsList[0] && chatsList[0]._id) {
      router.push(`/chats/${chatsList[0]._id}`);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={classes.chatContainer}>
        <ChatColumn widthProps="30%" />
        <Chat widthProps="70%" />
      </div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const { token } = await parseCookies({ req });
      if (!token) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      const userData = '';
      await store.dispatch(authCookie(req.headers.cookie));
      await store.dispatch(
        getCurrentUserDetails(req.headers.cookie, req)
      );
      await store.dispatch(getChatsByUser(req.headers.cookie, req));
      await store.dispatch(
        getUsersList(userData, req.headers.cookie, req)
      );
      return {
        props: {},
      };
    }
);

export default Chats;
