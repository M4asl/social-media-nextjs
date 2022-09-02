import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { follow } from '../../store/actions/userActions';
import { USER_FIND_PEOPLE } from '../../store/constants/userConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '43vh',
    zIndex: 100,
    position: 'sticky',
    top: '55%',
    left: '6%',
    color: '#141414',
    borderRadius: '15px',
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 2px 12px 0 rgba( 255, 255, 255, 0.2 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    padding: '8px',
    overflowY: 'scroll',
  },
  backgroundChat: {
    background: theme.palette.background.secondary,
    borderRadius: '15px',
  },
}));

export default function Suggestion({ userReducer }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [usersToFollow, setUsersToFollow] = useState([]);
  useEffect(() => {
    if (userReducer.usersToFollow) {
      setUsersToFollow(userReducer.usersToFollow);
    }
  }, [dispatch, userReducer.usersToFollow]);
  const clickFollow = (user, id) => {
    dispatch(follow(userReducer.currentUserDetails._id, user._id));
    const toFollow = usersToFollow.filter((user) => user._id !== id);

    dispatch({ type: USER_FIND_PEOPLE, payload: toFollow });
  };

  return (
    <Card className={classes.root}>
      {usersToFollow.length > 0 ? (
        usersToFollow.map((user) => (
          <List key={user._id}>
            <ListItem className={classes.backgroundChat}>
              <ListItemAvatar>
                <Avatar alt="Avatar Picture" src={user.photo.url} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
              <Button
                style={{
                  padding: '6px 0px',
                  minWidth: '40px',
                  borderRadius: '12px',
                }}
                aria-label="Follow"
                variant="contained"
                color="secondary"
                onClick={() => {
                  clickFollow(user, user._id);
                }}
              >
                <PersonAddIcon />
              </Button>
            </ListItem>
          </List>
        ))
      ) : (
        <Typography
          color="textPrimary"
          variant="h5"
          style={{ padding: '8px' }}
        >
          No users to suggestion.
        </Typography>
      )}
    </Card>
  );
}

Suggestion.propTypes = {
  userReducer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
