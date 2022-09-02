import React, { useEffect, useState } from 'react';
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import FollowProfileButton from '../Layout/FollowProfileButton';

const useStyles = makeStyles((theme) => ({
  textBox: {
    maxHeight: '70px',
  },
  body1: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
}));

const NotificationFollow = ({ notification }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [following, setFollowing] = useState(false);
  const { userReducer } = useSelector((state) => state);

  const clickFollowButton = (callApi) => {
    dispatch(
      callApi(
        userReducer.currentUserDetails._id,
        notification.user._id
      )
    );
    setFollowing(!following);
  };

  const checkFollow = (user) => {
    // console.log(user.followers);
    const matchFollowers = user?.following.some(
      (follow) => follow === notification.user._id
    );
    return matchFollowers;
  };

  useEffect(() => {
    if (
      userReducer &&
      Object.keys(userReducer).length === 0 &&
      userReducer.constructor === Object
    ) {
      return true;
    }
    const follow = checkFollow(userReducer.currentUserDetails);
    // console.log(follow);
    setFollowing(follow);
  }, [userReducer.currentUserDetails.following, dispatch]);

  return (
    <>
      <a href={`/users/${notification.user._id}`}>
        <ListItemAvatar>
          <Avatar
            alt="Avatar Picture"
            src={notification.user.photo.url}
          />
        </ListItemAvatar>
      </a>
      <ListItemText
        className={classes.textBox}
        primary={
          <Typography
            component="p"
            variant="body1"
            className={classes.body1}
          >
            {notification.user.name} - started follow you.{' '}
            <Moment fromNow style={{ color: '#1769aa' }}>
              {notification.created}
            </Moment>
          </Typography>
        }
      />
      <FollowProfileButton
        following={following}
        onButtonClick={clickFollowButton}
        widthProps="25%"
        variantProps="contained"
      />
    </>
  );
};

export default NotificationFollow;

NotificationFollow.propTypes = {
  notification: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
