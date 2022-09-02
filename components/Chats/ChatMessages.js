import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import cookie from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import InfiniteScroll from 'react-infinite-scroll-component';
import Message from '../Messages/Message';
import {
  createMessage,
  markMessageAsRead,
} from '../../store/actions/messageActions';
import io from 'socket.io-client';
import { UPDATE_MESSAGES } from '../../store/constants/messageConstants';
import { UPDATE_CHAT } from '../../store/constants/chatConstants';

const useStyles = makeStyles((theme) => ({
  chatMessagesContainer: {
    width: '100%',
    height: '82%',
    background: '#2D2D2D',
    margin: '0px',
    [theme.breakpoints.down('sm')]: {
      height: '70%',
    },
  },
  chatInputsContainer: {
    width: '100%',
    height: '9%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba( 255, 255, 255, 0.25 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    [theme.breakpoints.down('sm')]: {
      height: '15%',
    },
  },
  textField: {
    width: '45%',
    [theme.breakpoints.down('sm')]: {
      width: '55%',
    },
  },
  messageListContainer: {
    margin: '0px',
    padding: '0px',
  },
}));

let socket;

const ChatMessages = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [messagePageNumber, setMessagePageNumber] = useState(2);
  const baseUrl = 'http://localhost:3000';

  const { messageReducer, userReducer, chatReducer } = useSelector(
    (state) => state
  );
  const currentUser = userReducer.currentUserDetails;
  const { chat } = chatReducer;
  const [values, setValues] = useState({
    content: '',
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messageReducer.messages, dispatch]);

  const { currentUserDetails } = userReducer;
  const [messages, setMessages] = useState(messageReducer.messages);
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => socketInitializer(), [router.query.id]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.emit('join room', chat._id);

    socket.on('message received', (newMessage) => {
      dispatch({
        type: UPDATE_MESSAGES,
        payload: newMessage,
      });
    });

    socket.on('latest message', (data) => {
      dispatch({
        type: UPDATE_CHAT,
        payload: data,
      });
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    dispatch(createMessage(values.content, chat._id));
    const data = {
      content: values.content,
      chat,
      sender: currentUser,
      createdAt: new Date().toISOString(),
      readBy: [currentUser._id.toString()],
    };

    dispatch({
      type: UPDATE_CHAT,
      payload: data,
    });

    dispatch({
      type: UPDATE_MESSAGES,
      payload: data,
    });

    // dispatch(markMessageAsRead(chat._id));

    if (socket.connected) {
      socket.emit('new message', data);
      socket.emit('update chats', data);
    }
    setValues({ content: '' });
  };

  useEffect(() => {
    setMessages(messageReducer.messages);
  }, [router, messageReducer.messages]);

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/messages/${chat._id}`,
        {
          headers: { Authorization: cookie.get('token') },
          params: { messagePageNumber },
        }
      );
      if (res.data.length === 0) setHasMore(false);

      setMessages((prev) => [...prev, ...res.data]);
      setMessagePageNumber((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={classes.chatMessagesContainer}>
        <ul
          id="scrollableContainer"
          style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
          className={classes.messageListContainer}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchDataOnScroll}
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
            inverse="true"
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableContainer"
          >
            {messages.map((message, index) => (
              <Message
                key={message._id}
                message={message}
                index={index}
                messages={messages}
                currentUserDetails={currentUserDetails}
              />
            ))}
          </InfiniteScroll>
        </ul>
        <div ref={messagesEndRef} />
      </div>
      <div className={classes.chatInputsContainer}>
        <TextField
          className={classes.textField}
          id="message-input"
          label="Send message..."
          variant="standard"
          multiline
          maxRows={2}
          value={values.content}
          onChange={handleChange('content')}
        />
        <Button
          color="primary"
          disabled={!values.content}
          onClick={sendMessage}
          style={{ marginLeft: '7px' }}
        >
          <SendIcon />
        </Button>
      </div>
    </>
  );
};

export default ChatMessages;
