import React, { useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import {
  getUserDetails,
  getCurrentUserDetails,
} from '../../store/actions/userActions';
import { wrapper } from '../../store/store';
import { authCookie } from '../../store/actions/authActions';
import UserProfileDetails from '../../components/User/UserProfileDetails';
import { listByUser } from '../../store/actions/postActions';
import PostList from '../../components/Post/PostList';
import getNotificationByUser from '../../store/actions/notificationActions';
import { getChatsByUser } from '../../store/actions/chatActions';
import Navbar from '../../components/Layout/Navbar';

const useStyles = makeStyles((theme) => ({
  userDetailsContainer: {
    display: 'flex',
    width: '50%',
    flexDirection: 'column',
    zIndex: '100',
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      top: '20%',
    },
  },
}));

const UserProfile = () => {
  const { userReducer, postReducer } = useSelector((state) => state);
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <div className={classes.userDetailsContainer}>
        <UserProfileDetails
          userReducer={userReducer}
          postReducer={postReducer}
        />
        <PostList postReducer={postReducer} />
      </div>
    </>
  );
};

export default UserProfile;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { token } = await parseCookies(ctx);
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const { id } = ctx.params;

    await store.dispatch(authCookie(ctx.req.headers.cookie));
    await store.dispatch(
      getCurrentUserDetails(ctx.req.headers.cookie, ctx.req)
    );
    await store.dispatch(
      getUserDetails(id, ctx.req.headers.cookie, ctx.req)
    );
    await store.dispatch(
      listByUser(ctx.req.headers.cookie, id, ctx.req)
    );
    await store.dispatch(
      getChatsByUser(ctx.req.headers.cookie, ctx.req)
    );
    await store.dispatch(
      getNotificationByUser(ctx.req.headers.cookie, ctx.req)
    );
    return {
      props: {},
    };
  }
);
