import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { follow, unfollow } from "../../store/actions/userActions";

const useStyles = makeStyles(() => ({
  button: {
    width: "100%",
    padding: "2px 4px",
    fontSize: "0.7rem",
    minWidth: "70px",
  },
}));

export default function FollowProfileButton({
  onButtonClick,
  following,
  widthProps,
  variantProps,
}) {
  const classes = useStyles();
  const followClick = () => {
    onButtonClick(follow);
  };
  const unfollowClick = () => {
    onButtonClick(unfollow);
  };

  return (
    <div style={{ width: `${widthProps}` }}>
      {following ? (
        <Button
          variant={variantProps}
          color="secondary"
          onClick={unfollowClick}
          className={classes.button}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant={variantProps}
          color="primary"
          onClick={followClick}
          className={classes.button}
        >
          Follow
        </Button>
      )}
    </div>
  );
}

FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  widthProps: PropTypes.string.isRequired,
  variantProps: PropTypes.string.isRequired,
};
