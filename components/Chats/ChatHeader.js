import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import React from 'react';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  chatHeaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '9%',
    background: 'rgba( 255, 255, 255, 0.25 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    [theme.breakpoints.down('sm')]: {
      height: '15%',
    },
  },
  textBox: {
    display: 'flex',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  chatHeaderInfo: {
    overflow: 'hidden',
  },
}));

const ChatHeader = () => {
  const classes = useStyles();
  const { chatReducer, userReducer } = useSelector((state) => state);
  const currentUserId = userReducer.currentUserDetails._id;
  const { chat } = chatReducer;
  return (
    <div className={classes.chatHeaderContainer}>
      <List className={classes.chatHeaderInfo}>
        <ListItem>
          {chat.isGroupChat ? (
            <ListItemAvatar style={{ marginRight: '16px' }}>
              <AvatarGroup max={2} spacing="small">
                {chat.users
                  .filter((user) => user._id !== currentUserId)
                  .map((user) => (
                    <Avatar
                      key={user._id}
                      alt="Avatar Picture"
                      src={user.photo.url}
                    />
                  ))}
              </AvatarGroup>
            </ListItemAvatar>
          ) : (
            <ListItemAvatar>
              {chat.users
                .filter((user) => user._id !== currentUserId)
                .map((user) => (
                  <Avatar
                    key={user._id}
                    alt="Avatar Picture"
                    src={user.photo.url}
                  />
                ))}
            </ListItemAvatar>
          )}
          <div className={classes.textBox}>
            {chat.users
              .slice(0, 2)
              .filter((user) => user._id !== currentUserId)
              .map((user, i) => (
                <Typography variant="subtitle2" key={user._id}>
                  {(i ? ', ' : '') + user.name}
                </Typography>
              ))}
            {chat.users.length > 3 && (
              <Typography variant="subtitle2">
                + {chat.users.length - 3} other users
              </Typography>
            )}
          </div>
        </ListItem>
      </List>
    </div>
  );
};

export default ChatHeader;
