import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  error: {
    fontSize: "1rem",
    color: "#ba000d",
    maxWidth: "200px",
    textAlign: "center",
  },
}));

const Error = ({ errorMessage }) => {
  const classes = useStyles();

  return (
    <Typography
      component="div"
      variant="body2"
      className={classes.error}
    >
      {errorMessage}
    </Typography>
  );
};

export default Error;

Error.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};
