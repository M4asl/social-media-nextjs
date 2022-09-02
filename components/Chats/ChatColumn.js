import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ChatMenu from "./ChatMenu";
import ChatList from "./ChatList";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(100vh - 66px)",
    position: "sticky",
    top: "66px",
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 102px)",
    },
  },
}));

const ChatColumn = ({ widthProps }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      style={{ width: `${widthProps}` }}
    >
      <ChatMenu />
      <ChatList />
    </div>
  );
};

export default ChatColumn;

ChatColumn.propTypes = {
  widthProps: PropTypes.string.isRequired,
};
