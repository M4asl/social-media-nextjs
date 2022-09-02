import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Link from 'next/link';
import Loader from './Loader';
import { GLOBAL_ALERT } from '../../store/constants/globalConstants';
import Error from './Error';
import Messages from '../Messages/Messages';
import Notifications from '../Notifications/Notifications';
import { logout } from '../../store/actions/authActions';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    cursor: 'pointer',
    display: 'block',
    [theme.breakpoints.up('xs')]: {
      fontSize: '0.7rem',
      textAlign: 'center',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  },
  search: {
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    padding: '8px',
    [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(0),
      width: '150px',
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '250px',
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchButton: {
    padding: theme.spacing(0, 2),
    pointerEvents: 'pointer',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '0px',
      minWidth: '30px',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    backgroundColor: theme.palette.background.default,
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  menuClass: {
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 2px 12px 0 rgba( 255, 255, 255, 0.2 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    zIndex: '999',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  backgroundChat: {
    background: theme.palette.background.secondary,
    borderRadius: '15px',
    margin: '12px 0px',
  },
  usersContainer: {
    height: '300px',
    width: '300px',
    overflowY: 'scroll',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%)',
    background: '#141414',
    padding: '10px 20px',
    border: '3px solid #bfbfbf',
    borderRadius: '15px',
    display: 'flex',
    // justifyContent: "space-around",
    flexDirection: 'column',
    // alignItems: "center",
  },
  userCard: {
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 2px 12px 0 rgba( 255, 255, 255, 0.2 )',
    backdropFilter: 'blur( 10.0px )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    color: '#bfbfbf',
    margin: '12px 0px',
    overflow: 'unset',
  },
  iconContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();

  const [errorMess, setErrorMess] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authReducer, alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (search.length === 0) {
      setUsers([]);
      setErrorMess(false);
    }
  }, [search]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    if (search) {
      try {
        const config = {
          headers: {
            Cookie: authReducer.token,
          },
        };
        const { data } = await axios.get(
          `/api/users?search=${search}`,
          config
        );
        setLoading(false);
        setUsers(data);
      } catch (error) {
        dispatch({
          type: GLOBAL_ALERT,
          payload: error.response.data.message,
        });
        setErrorMess(true);
        setLoading(false);
      }
    }
  };

  const handleCloseSearch = () => {
    setUsers([]);
    setSearch('');
  };

  const enterKey = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSearch();
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className={classes.flex}>
      <AppBar position="fixed" className={classes.menuClass}>
        <Toolbar className={classes.toolBar}>
          <Link href="/">
            <Typography className={classes.title} variant="h6">
              MERNN App
            </Typography>
          </Link>
          <div className={classes.search}>
            <InputBase
              id="search"
              placeholder="Search Users"
              onKeyDown={enterKey}
              onChange={handleChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            {search ? (
              <Button
                onClick={handleCloseSearch}
                className={classes.searchButton}
              >
                <CloseIcon />
              </Button>
            ) : (
              <Button
                onClick={handleSearch}
                className={classes.searchButton}
              >
                <SearchIcon />
              </Button>
            )}

            {search && (
              <div className={classes.usersContainer}>
                {loading && <Loader />}
                {users.length === 0 && (
                  <h3 style={{ textAlign: 'center' }}>
                    Press enter to find users.
                  </h3>
                )}
                {errorMess ? (
                  <Error errorMessage={alert.error} />
                ) : (
                  ''
                )}
                <>
                  {users.map((user) => (
                    <Link href={`/users/${user._id}`} key={user._id}>
                      <Card
                        className={classes.userCard}
                        onClick={handleCloseSearch}
                      >
                        <CardHeader
                          avatar={
                            <Avatar
                              alt="Avatar Picture"
                              src={user.photo.url}
                            />
                          }
                          title={user.name}
                          subheader={user.email}
                        />
                      </Card>
                    </Link>
                  ))}
                </>
              </div>
            )}
          </div>
          <div className={classes.iconContainer}>
            <Messages />

            <Notifications />

            <Button
              color="primary"
              fontSize="small"
              onClick={logoutHandler}
            >
              <LogoutIcon />
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
