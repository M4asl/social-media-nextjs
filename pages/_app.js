import React, { useEffect } from "react";
import "../styles/globals.css";
import PropTypes from "prop-types";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { wrapper } from "../store/store";
import Layout from "../components/Layout/Layout";
import theme from "../components/theme";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default wrapper.withRedux(MyApp);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.elementType.isRequired,
};
