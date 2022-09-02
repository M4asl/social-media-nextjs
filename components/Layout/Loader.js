import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size="3rem" color="inherit" />
    </div>
  );
}
