import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    zIndex: 100,
    color: theme.palette.text.primary,
    fontWeight: "500",
    background: "rgba( 255, 255, 255, 0.25 )",
    backdropFilter: "blur( 10.0px )",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    minHeight: "300px",
    margin: "22px 0px",
    padding: "20px",
    [theme.breakpoints.down("sm")]: {
      padding: "10px",
    },
  },
  backgroundPostLoader: {
    width: "100%",
    minHeight: "258px",
    background: theme.palette.background.secondary,
    borderRadius: "15px",
    padding: "10px",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 4px",
    },
  },
}));

const LoadPost = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.backgroundPostLoader}>
        <Skeleton
          animation="wave"
          variant="circle"
          width={40}
          height={40}
        />
        <Skeleton
          animation="wave"
          height={30}
          width="80%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton animation="wave" height={30} width="40%" />
        <Skeleton height={200} animation="wave" variant="rect" />
      </div>
    </div>
  );
};

export default LoadPost;
