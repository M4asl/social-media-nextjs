import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import LoadPost from "./LoadPost";
import Post from "./Post";
import Loader from "../Layout/Loader";
import { updatePostScroll } from "../../store/actions/postActions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 100,
    color: theme.palette.text.primary,
    fontWeight: "500",
    background: "rgba( 255, 255, 255, 0.25 )",
    backdropFilter: "blur( 10.0px )",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    marginTop: "20px",
    height: "20vh",
  },
}));

const PostList = ({ postReducer }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  useEffect(() => {
    setHasMore(!postReducer.noMoreData);
  }, [postReducer]);

  const fetchDataOnScroll = () => {
    dispatch(updatePostScroll(pageNumber));
    setPageNumber((prev) => prev + 1);
  };

  return (
    <div>
      {postReducer.loading && <Loader />}
      {postReducer.posts.length > 0 ? (
        <InfiniteScroll
          hasMore={hasMore}
          next={fetchDataOnScroll}
          loader={<LoadPost />}
          endMessage={<h1>No posts.</h1>}
          dataLength={postReducer.posts.length}
        >
          {postReducer.posts.map((item) => (
            <Post post={item} key={item._id} />
          ))}
        </InfiniteScroll>
      ) : (
        <>
          <div className={classes.root}>
            <Typography
              style={{
                fontSize: "1.3rem",
                color: "#141414",
                letterSpacing: "0.02rem",
              }}
            >
              No posts yet.
            </Typography>
            <Typography
              style={{
                fontSize: "1.3rem",
                color: "#141414",
                letterSpacing: "0.02rem",
              }}
            >
              {router.route.includes("users")
                ? "This user has no posts yet."
                : "Create new post or follow some users."}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;

PostList.propTypes = {
  postReducer: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
