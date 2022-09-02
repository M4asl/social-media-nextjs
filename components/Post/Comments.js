import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../theme';
import {
  createComment,
  uncomment,
} from '../../store/actions/postActions';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
  },
  listItem: {
    width: 'fit-content',
    overflowWrap: 'anywhere',
    margin: '10px 0px',
    borderRadius: '15px',
    background: 'rgba( 255, 255, 255, 0.25 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 5px',
    },
  },
  text: {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
    },
  },
  addCommentBox: {
    display: 'flex',
    alignItems: 'center',
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    [theme.breakpoints.down('sm')]: {
      width: '25px',
      height: '25px',
    },
  },
  body2: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
}));

const Input = withStyles({
  root: {
    width: '100%',
    borderRadius: '15px',
    borderColor: theme.palette.background.paper,
    marginLeft: '10px',
    '& label': {
      color: theme.palette.text.primary,
    },
    '& label.Mui-focused': {
      color: theme.palette.text.primary,
      fontWeight: '700',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent',
        borderRadius: '15px',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.text.primary,
        borderRadius: '15px',
      },
    },
  },
})(TextField);

const Comments = ({ comments, post }) => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [commentsList, setCommentsList] = useState(comments);
  const dispatch = useDispatch();
  const { userReducer } = useSelector((state) => state);

  const handleChange = (event) => {
    setText(event.target.value);
  };
  const addComment = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      const newComment = {
        text,
        postedBy: userReducer.currentUserDetails,
        created: new Date().toISOString,
      };
      event.preventDefault();
      dispatch(
        createComment(
          userReducer.currentUserDetails._id,
          newComment,
          post
        )
      );
      setText('');
    }
  };

  useEffect(() => {
    setCommentsList(post.comments);
  }, [post.comments]);

  const deleteComment = (comment) => () => {
    dispatch(uncomment(post, comment._id));
  };

  return (
    <>
      <List className={classes.root}>
        {comments &&
          commentsList.map((comment) => (
            <ListItem
              alignItems="flex-start"
              className={classes.listItem}
              key={comment._id}
            >
              <ListItemAvatar style={{ minWidth: '35px' }}>
                <Avatar
                  alt="Avatar Picture"
                  src={comment.postedBy.photo.url}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div className={classes.primaryText}>
                    <Typography
                      component="p"
                      variant="body2"
                      className={classes.body2}
                    >
                      {comment.postedBy.name}
                    </Typography>
                    {userReducer.currentUserDetails._id ===
                      comment.postedBy._id && (
                      <Button onClick={deleteComment(comment)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </Button>
                    )}
                  </div>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.text}
                      color="textPrimary"
                    >
                      {comment.text}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
      </List>
      <div className={classes.addCommentBox}>
        <Avatar
          alt="Avatar Picture"
          src={userReducer.currentUserDetails.photo.url}
          className={classes.avatar}
        />
        <Input
          label="Text something..."
          variant="outlined"
          onKeyDown={addComment}
          onChange={handleChange}
          value={text}
        />
      </div>
    </>
  );
};

export default Comments;

Comments.propTypes = {
  comments: PropTypes.oneOfType([PropTypes.object]).isRequired,
  post: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
