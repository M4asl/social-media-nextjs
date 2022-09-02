import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Button, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { createChat } from "../../store/actions/chatActions";
import theme from "../theme";

const CustomAutocomplete = withStyles({
  root: {
    width: "100%",
    zIndex: "999",
    maxHeight: "56px",
    "& label.Mui-focused": {
      color: "#bfbfbf",
    },
    "& label": {
      color: "#bfbfbf",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#bfbfbf",
        borderRadius: "15px",
      },
      "&:hover fieldset": {
        borderColor: "#bfbfbf",
        borderRadius: "15px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#bfbfbf",
        borderRadius: "15px",
      },
    },
  },
  listbox: {
    backgroundColor: "#2d2d2d",
    padding: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "280px",
      maxHeight: "50vh",
      position: "absolute",
      border: "1px solid #bfbfbf",
      borderRadius: "15px",
    },
    "& li": {
      color: "#bfbfbf",
      background: "rgba( 255, 255, 255, 0.25 )",
      backdropFilter: "blur( 10.0px )",
      border: "1px solid rgba( 255, 255, 255, 0.18 )",
      borderRadius: "15px",
      padding: "10px",
      margin: "10px",
    },
  },
  tag: {
    backgroundColor: "transparent",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40px",
    zIndex: 0,
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "#141414",
      borderRadius: "50%",
      width: "40px",
      position: "absolute",
      top: "50%",
      left: "calc(50% - 9px)",
      transform: "translate(-50%, -50%)",
    },
    "& .MuiChip-label": {
      color: "#fff",
    },
    "& .MuiChip-deleteIcon": {
      color: "white",
    },
  },
  endAdornment: {
    "& .MuiIconButton-root": {
      color: "#bfbfbf",
    },
  },
  inputRoot: {
    backgroundColor: "#2D2D2D",
  },
})(Autocomplete);

const ChatSearch = ({ users, currentUserId }) => {
  const [selectedOptions, setSelectedOptions] = useState();
  const dispatch = useDispatch();
  const handleChange = (event, value) => setSelectedOptions(value);
  const handleSubmit = () => {
    if (selectedOptions.length > 1) {
      dispatch(createChat(selectedOptions));
    } else if (selectedOptions.length === 1) {
      dispatch(createChat(selectedOptions[0]._id));
    }
  };
  const usersOptions = users.filter(
    (user) => user._id !== currentUserId,
  );
  return (
    <>
      <CustomAutocomplete
        multiple
        limitTags={0}
        id="multiple-limit-tags"
        options={usersOptions}
        getOptionLabel={(user) => user.name}
        filterSelectedOptions
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Create chat..."
          />
        )}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedOptions}
        onClick={handleSubmit}
        style={{ margin: "15px 10px" }}
      >
        <GroupAddIcon style={{ color: "#bfbfbf" }} />
      </Button>
    </>
  );
};

export default ChatSearch;

ChatSearch.propTypes = {
  users: PropTypes.oneOfType([PropTypes.array]).isRequired,
  currentUserId: PropTypes.string.isRequired,
};
