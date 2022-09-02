import React from 'react';
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  textBox: {
    maxHeight: '70px',
    overflowY: 'scroll',
  },
  body1: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
  body2: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
    },
  },
}));

const NotificationComment = ({ notification }) => {
  const classes = useStyles();
  return (
    <>
      <ListItemAvatar>
        <Avatar
          alt="Avatar Picture"
          src={notification.user.photo.url}
        />
      </ListItemAvatar>
      <ListItemText
        className={classes.textBox}
        primary={
          <Typography
            component="p"
            variant="body1"
            className={classes.body1}
          >
            {notification.user.name} - comment your post.{' '}
            <Moment fromNow style={{ color: '#1769aa' }}>
              {notification.created}
            </Moment>
          </Typography>
        }
        secondary={
          <div
            style={{
              color: '#BFBFBF',
            }}
          >
            <Typography
              component="p"
              variant="body2"
              className={classes.body2}
            >
              {notification.user.name}
              {` - ${notification.text}`}
            </Typography>
          </div>
        }
      />
      {/* <div className={classes.textBox}>
        <p>{notification.user.name} - comment your post.</p>
        <p>
          {notification.user.name} - {notification.text}
        </p>
      </div> */}

      <Avatar
        style={{
          margin: '10px 0px 10px 10px',
          width: '80px',
          height: '80px',
        }}
        variant="rounded"
        src={notification.post?.photo.url}
      />
    </>
  );
};

export default NotificationComment;

NotificationComment.propTypes = {
  notification: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
