import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import GroupIcon from "@material-ui/icons/Group";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import ChatSearch from "./ChatSearch";

const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.secondary,
    height: "17%",
    [theme.breakpoints.down("xs")]: {
      height: "30%",
    },
  },
  search: {
    display: "flex",
    margin: "8px",
    width: "100%",
    borderRadius: "15px",
    [theme.breakpoints.up("xs")]: {
      width: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "0px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      marginTop: "6px",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  inputRoot: {
    color: theme.palette.text.gray,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: "1em",
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  field: {
    background: "#141414",
    width: "100%",
  },
  userItem: {
    background: "#000",
    color: "white",
  },
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
  hiddenElement: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  gridItem: {
    [theme.breakpoints.down("xs")]: {
      height: "100%",
    },
  },
}));

const ChatMenu = () => {
  const classes = useStyles();
  const { userReducer } = useSelector((state) => state);
  const [users, setUsers] = useState([]);
  const currentUserId = userReducer.currentUserDetails._id;

  useEffect(() => {
    setUsers(userReducer.users);
  }, []);

  return (
    <Grid
      container
      className={classes.container}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item className={classes.hiddenElement}>
        <Typography
          color="textPrimary"
          variant="h4"
          style={{ padding: "8px" }}
        >
          Chats
        </Typography>
      </Grid>
      <Grid item className={classes.hiddenElement}>
        <IconButton>
          <GroupIcon
            style={{
              color: "#BFBFBF",
              fontSize: "2rem",
            }}
          />
        </IconButton>
      </Grid>
      <Grid item xs={12} className={classes.gridItem}>
        <div
          className={classes.search}
          style={{ justifyContent: "space-between" }}
        >
          <ChatSearch users={users} currentUserId={currentUserId} />
        </div>
      </Grid>
    </Grid>
  );
};

export default ChatMenu;
