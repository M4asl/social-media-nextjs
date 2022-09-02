import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { AvatarGroup } from '@material-ui/lab';
import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '83%',
    padding: '0px 8px',
    zIndex: 100,
    fontWeight: '500',
    background: 'rgba( 255, 255, 255, 0.25 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    overflowY: 'scroll',
    [theme.breakpoints.down('xs')]: {
      height: '70%',
    },
  },
  backgroundChatUnactive: {
    background: theme.palette.background.secondary,
    borderRadius: '15px',
    margin: '12px 0px',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      width: '35px',
      background: 'transparent',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: '50%',
      padding: '0px',
    },
  },
  backgroundChatActive: {
    background: theme.palette.background.default,
    borderRadius: '15px',
    margin: '12px 0px',
    [theme.breakpoints.down('xs')]: {
      width: '35px',
      background: 'transparent',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: '50%',
      padding: '0px',
    },
  },
  textBox: {
    display: 'flex',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  noChatContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '97%',
  },
  avatar: {
    [theme.breakpoints.down('xs')]: {
      width: '35px',
      height: '35px',
    },
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'inline-block',
  },
}));

let socket;

const ChatList = () => {
  const classes = useStyles();
  const router = useRouter();

  const { chatReducer, userReducer } = useSelector((state) => state);
  const [chats, setChats] = useState(chatReducer.chats);
  const [chatId, setChatId] = useState(router.query.id);
  const currentUserId = userReducer.currentUserDetails._id;

  // chats.map((chat) => {
  //   const userToFind =
  //     chat?.latestMessage?.readBy.includes(currentUserId);
  //   console.log(userToFind);
  // });

  useEffect(() => socketInitializer(), []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });
  };

  useEffect(() => {
    setChats(chatReducer.chats);
  }, [chatReducer.chats]);

  useEffect(() => {
    setChatId(router.query.id);
  }, [router.query.id]);

  const handleClick = (index) => {
    // console.log(index);
    setChatId(index);
    socket.emit('close room', router.query.id);
  };

  return (
    <div className={classes.root}>
      {chats.length < 1 && (
        <div className={classes.noChatContainer}>
          <Typography
            style={{
              fontSize: '1.3rem',
              color: '#141414',
              letterSpacing: '0.02rem',
            }}
          >
            Create new chat.
          </Typography>
        </div>
      )}
      <List>
        {chats.map((chat) => (
          <Link href={`/chats/${chat._id}`} key={chat._id}>
            <ListItem
              onClick={() => handleClick(chat._id)}
              className={
                chatId === chat._id
                  ? classes.backgroundChatActive
                  : classes.backgroundChatUnactive
              }
            >
              {chat?.latestMessage?.readBy.includes(
                currentUserId
              ) ? null : chatId === chat._id ? null : (
                <span className={classes.dot} />
              )}

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
                          className={classes.avatar}
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
                        className={classes.avatar}
                      />
                    ))}
                </ListItemAvatar>
              )}
              <div style={{ overflow: 'hidden', maxHeight: '41px' }}>
                <span className={classes.textBox}>
                  {chat.users
                    .filter((user) => user._id !== currentUserId)
                    .slice(0, 2)
                    .map((user, i) => (
                      <Typography variant="subtitle2" key={user._id}>
                        {(i ? ', ' : ' ') + user.name}
                      </Typography>
                    ))}
                  {chat.users.length > 3 && (
                    <Typography variant="subtitle2">
                      + {chat.users.length - 3} other users
                    </Typography>
                  )}
                </span>
                {chat.latestMessage && (
                  <>
                    <span>{chat.latestMessage.sender.name}: </span>
                    <span>{chat.latestMessage.content}</span>
                  </>
                )}
              </div>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default ChatList;
