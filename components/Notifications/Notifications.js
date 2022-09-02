import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Notifications from "@material-ui/icons/Notifications";
import { useSelector } from "react-redux";
import NotificationComment from "./NotificationComment";
import NotificationFollow from "./NotificationFollow";
import NotificationLike from "./NotificationLike";

const useStyles = makeStyles((theme) => ({
  notificationItem: {
    maxWidth: "350px",
    wordBreak: "break-word",
    whiteSpace: "normal",
    background: theme.palette.background.secondary,
    borderRadius: "15px",
    margin: "12px 0px",
    cursor: "pointer",
  },
}));

const StyledMenu = withStyles({
  paper: {
    background: "rgba( 255, 255, 255, 0.25 )",
    boxShadow: "0 2px 12px 0 rgba( 255, 255, 255, 0.2 )",
    backdropFilter: "blur( 10.0px )",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    padding: "0px 5px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    PaperProps={{ style: { maxHeight: "80vh", overflowY: "scroll" } }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.gray,
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const NotificationsType = () => {
  const classes = useStyles();
  const [notificationEl, setNotificationEl] = useState(null);
  const { notificationReducer } = useSelector((state) => state);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(notificationReducer.notifications);
  }, []);

  const handleClickNotification = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setNotificationEl(null);
  };

  return (
    <>
      <Button
        aria-controls="customized-menu-notification"
        aria-haspopup="true"
        color="primary"
        onClick={handleClickNotification}
      >
        <Notifications fontSize="small" />
      </Button>
      <StyledMenu
        id="customized-menu-notification"
        anchorEl={notificationEl}
        keepMounted
        open={Boolean(notificationEl)}
        onClose={handleCloseNotification}
      >
        {notifications.length < 1 && (
          <div style={{ textAlign: "center" }}>
            <Typography
              style={{
                fontSize: "1.3rem",
                color: "#141414",
                letterSpacing: "0.02rem",
              }}
            >
              No notifications yet.
            </Typography>
          </div>
        )}
        {notifications.map((notification) => (
          <StyledMenuItem
            key={notification._id}
            onClick={handleCloseNotification}
            className={classes.notificationItem}
          >
            {notification.type === "newComment" && (
              <NotificationComment notification={notification} />
            )}
            {notification.type === "newFollower" && (
              <NotificationFollow notification={notification} />
            )}
            {notification.type === "newLike" && (
              <NotificationLike notification={notification} />
            )}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default NotificationsType;
