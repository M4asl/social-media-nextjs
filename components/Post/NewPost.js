import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import theme from '../theme';
import { createPost } from '../../store/actions/postActions';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    zIndex: 100,
    color: theme.palette.text.primary,
    fontWeight: '500',
    background: 'rgba( 255, 255, 255, 0.25 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    marginTop: '60px',
  },
  avatar: {
    backgroundColor: red[500],
  },
  textField: {
    background: theme.palette.background.default,
    width: '100%',
    borderRadius: '15px',
    color: theme.palette.text.primary,
  },
  divider: {
    height: '3px',
    backgroundColor: '#bfbfbf',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '0px 20px 16px 0px',
  },
  button: {
    backgroundColor: 'rgb(23, 105, 170)',
    padding: '8px 24px',
    borderRadius: '7px',
    '&:hover': {
      backgroundColor: '#2196f3',
    },
  },
  button2: {
    backgroundColor: '#eceff1',
  },
  input: {
    display: 'none',
  },
}));

const Input = withStyles({
  root: {
    width: '100%',
    borderRadius: '15px',
    background: theme.palette.background.secondary,
    marginTop: '10px',
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

export default function NewPost() {
  const classes = useStyles();
  const { userReducer } = useSelector((state) => state);
  const [values, setValues] = useState({
    text: '',
    photo: '',
  });
  const dispatch = useDispatch();

  // const clickPost = () => {
  //   const postData = new FormData();
  //   postData.append("text", values.text);
  //   postData.append("photo", values.photo);
  //   dispatch(createPost(postData, userReducer.currentUserDetails));
  //   setValues({ ...values });
  //   setValues({ text: "", photo: "" });
  // };

  // const handleChange = (name) => (event) => {
  //   const value =
  //     name === "photo" ? event.target.files[0] : event.target.value;
  //   setValues({ ...values, [name]: value });
  // };

  const clickPost = () => {
    const text = values.text;
    const photo = values.photo;
    const postData = {
      text,
      photo,
    };

    dispatch(createPost(postData, userReducer.currentUserDetails));
    setValues({ ...values });
  };

  const handleChange = (name) => (e) => {
    let value;

    if (name === 'photo') {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setValues({ ...values, photo: reader.result });
        }
      };

      value = reader.readAsDataURL(e.target.files[0]);
    } else {
      value = e.target.value;
    }

    setValues({ ...values, [name]: value });
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            alt="Avatar Picture"
            src={userReducer.currentUserDetails.photo.url}
          />
        }
        title={userReducer.currentUserDetails.name}
        subheader={userReducer.currentUserDetails.email}
      />
      <Divider className={classes.divider} />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          Whats happening?
        </Typography>
        <Input
          label="Text something..."
          variant="outlined"
          value={values.text}
          onChange={handleChange('text')}
        />
      </CardContent>
      <div className={classes.buttonContainer}>
        <label htmlFor="icon-button-file">
          <input
            accept="image/*"
            onChange={handleChange('photo')}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <Button
          variant="contained"
          disabled={!values.text}
          className={classes.button}
          onClick={clickPost}
        >
          Post
        </Button>
      </div>
    </Card>
  );
}
