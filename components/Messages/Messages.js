import {
  Avatar,
  Button,
  ListItemAvatar,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
  withStyles,
} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  backgroundChatUnactive: {
    background: theme.palette.background.secondary,
    borderRadius: '15px',
    margin: '12px 0px',
    cursor: 'pointer',
  },
  backgroundChatActive: {
    background: theme.palette.background.default,
    borderRadius: '15px',
    margin: '12px 0px',
  },
  textBox: {
    display: 'flex',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const StyledMenu = withStyles({
  paper: {
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 2px 12px 0 rgba( 255, 255, 255, 0.2 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    padding: '0px 5px',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    PaperProps={{
      style: {
        maxHeight: '80vh',
        overflowY: 'scroll',
        maxWidth: '300px',
      },
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.gray,
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Messages = () => {
  const router = useRouter();
  const classes = useStyles();
  const [messageEl, setMessageEl] = useState(null);
  const [chatId, setChatId] = useState(router.query.id);
  const { chatReducer, userReducer } = useSelector((state) => state);
  const currentUserId = userReducer.currentUserDetails._id;
  const [chats, setChats] = useState(chatReducer.chats);

  useEffect(() => {
    setChats(chatReducer.chats);
  }, [chatReducer.chats]);

  useEffect(() => {
    setChatId(router.query.id);
    setMessageEl(null);
  }, [router]);

  const handleClickMessage = (event) => {
    setMessageEl(event.currentTarget);
  };

  const handleCloseMessage = () => {
    setMessageEl(null);
  };

  return (
    <>
      <Button
        aria-controls="customized-menu-message"
        aria-haspopup="true"
        color="primary"
        onClick={handleClickMessage}
      >
        <QuestionAnswerIcon fontSize="small" />
      </Button>
      <StyledMenu
        id="customized-menu-message"
        anchorEl={messageEl}
        keepMounted
        open={Boolean(messageEl)}
        onClose={handleCloseMessage}
      >
        {chats.length < 1 && (
          <div style={{ textAlign: 'center' }}>
            <Typography
              style={{
                fontSize: '1.3rem',
                color: '#141414',
                letterSpacing: '0.02rem',
              }}
            >
              No messages yet.
            </Typography>
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
        {chats.map((chat) => (
          <Link href={`/chats/${chat._id}`} key={chat._id}>
            <StyledMenuItem
              onClick={handleCloseMessage}
              className={
                chatId === chat._id
                  ? classes.backgroundChatActive
                  : classes.backgroundChatUnactive
              }
            >
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
              <div>
                <span className={classes.textBox}>
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
                </span>
                {chat.latestMessage && (
                  <>
                    <span>{chat.latestMessage.sender.name}: </span>
                    <span>{chat.latestMessage.content}</span>
                  </>
                )}
              </div>
            </StyledMenuItem>
          </Link>
        ))}
      </StyledMenu>
    </>
  );
};

export default Messages;
