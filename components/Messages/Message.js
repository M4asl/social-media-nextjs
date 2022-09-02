import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  mine: {
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
    marginLeft: 'auto',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 'max-content',
    padding: '2.5px 5px',
    borderRadius: '16px',
  },
  maxSizeMessage: {
    maxWidth: '55%',
    overflowWrap: 'anywhere',
  },
  messageContentMine: {
    backgroundColor: '#006AFF',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
  },
  messageContentTheirs: {
    backgroundColor: '#dcdcdc',
    color: 'black',
    padding: '6px 12px',
    borderRadius: '16px',
  },
  messageAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '12px',
  },
  isLastClass: {
    flexDirection: 'unset',
    alignItems: 'flex-end',
    marginLeft: '-22px',
  },
}));
let lastSenderId = '';

const Message = ({
  message,
  index,
  messages,
  currentUserDetails,
}) => {
  const classes = useStyles();

  function createMessageView(message, nextMessage, lastSenderId) {
    const senderName = message.sender.name;

    const currentSenderId = message.sender._id;
    const nextSenderId =
      nextMessage != null ? nextMessage?.sender._id : '';

    const isFirst = lastSenderId !== currentSenderId;
    const isLast = nextSenderId !== currentSenderId;

    const isMine = message.sender._id === currentUserDetails._id;
    const liClassName = isMine ? classes.mine : classes.theirs;

    return (
      <li
        style={{ paddingLeft: '30px' }}
        className={
          isLast && !isMine
            ? `${liClassName} ${classes.messageContainer} ${classes.maxSizeMessage} ${classes.isLastClass}`
            : `${liClassName} ${classes.messageContainer} ${classes.maxSizeMessage}`
        }
      >
        {/* {isLast && !isMine && (
          <div>
            <img
              src={message.sender.photo.url}
              alt={`Avatar's ${message.sender.name}`}
              className={classes.messageAvatar}
            />
          </div>
        )} */}
        <div className={classes.messageContainer}>
          {isFirst && !isMine && <span>{senderName}</span>}
          <span
            className={
              isMine
                ? classes.messageContentMine
                : classes.messageContentTheirs
            }
          >
            {message.content}
          </span>
        </div>
        <div>
          {/* {isLast &&
            message.readBy &&
            message.readBy.map((user) => user.name)} */}
        </div>
      </li>
    );
  }

  lastSenderId = message.sender._id;

  const messageView = createMessageView(
    message,
    messages[index + 1],
    lastSenderId
  );

  return messageView;
};
export default Message;
