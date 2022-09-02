import { createTheme } from "@material-ui/core/styles";

const gray = "#BFBFBF";
const darkGrey = "#2D2D2D";
const veryDarkGrey = "#141414";
// const lightRed = "#FF8C8C";
// const verySoftRed = "#EA8D8D";
// const violet = "A890FE";
// const paleViolet = "#D8B5FF";
// const softYellow = "#F1EAB9";
// const cyan = "#1EAE98";
// const pink = "#FF61D2";
// const green = "#BFF098";
// const lightBlue = "6FD6FF";
// const blue = "#0080FF";

const theme = createTheme({
  palette: {
    primary: {
      light: gray,
      main: veryDarkGrey,
    },
    background: {
      default: veryDarkGrey,
      secondary: darkGrey,
      paper: gray,
    },
    text: {
      primary: gray,
      secondary: veryDarkGrey,
    },
  },
});

export default theme;
