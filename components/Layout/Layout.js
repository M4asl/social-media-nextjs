import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Background from './Background';
import HeadTags from './HeadTags';

const Layout = ({ children }) => {
  const { userReducer } = useSelector((state) => state);
  return (
    <>
      <HeadTags />

      {children}
      <Background />
    </>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.elementType.isRequired,
};
