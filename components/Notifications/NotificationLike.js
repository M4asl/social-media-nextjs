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
  },
  body1: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
}));

const NotificationLike = ({ notification }) => {
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
        primary={
          <Typography
            component="p"
            variant="body1"
            className={classes.body1}
          >
            {notification.user.name} - like your post.{' '}
            <Moment fromNow style={{ color: '#1769aa' }}>
              {notification.created}
            </Moment>
          </Typography>
        }
      />
      {notification.post.photo && (
        <Avatar
          style={{
            margin: '10px 0px 10px 10px',
            width: '80px',
            height: '80px',
          }}
          variant="rounded"
          src={notification.post?.photo.url}
        />
      )}
    </>
  );
};

export default NotificationLike;

NotificationLike.propTypes = {
  notification: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
