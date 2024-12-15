import React from "react";
import { Typography } from "@material-ui/core";
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface CharacterProps {
  chr?: string;
  id: number;
  chrsTyped?: string[];
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3cac96'
    },
    secondary: {
      main: '#ac3c52'
    }
  },
  typography: {
    body1: {
      fontSize: '1.2rem',
    }
  }
})

const NextCharTypography = () => (
  <Typography variant="body1" color="primary" />
);

const CorrectTextTypography = () => (
  <Typography variant="body1" color="primary" />
);

const IncorrectTextTypography = () => (
  <Typography variant="body1" color="secondary" />
);

const Character: React.FC<CharacterProps> = React.memo(({ chr, id, chrsTyped }) => {
  let CharTypography;

  if (id == chrsTyped!.length) {
    CharTypography = NextCharTypography;
  }
  else if (id >= chrsTyped!.length) {
    CharTypography = Typography;
  }
  else if (chrsTyped![id] === chr) {
    CharTypography = CorrectTextTypography;
  } else {
    CharTypography = IncorrectTextTypography;
  }

  return (
    <ThemeProvider theme={theme} >
      <CharTypography className="text">
        {chr}
      </CharTypography>
    </ThemeProvider>
  )
}, (props: any, nextProps: any) => {
  if (props.id == nextProps!.chrsTyped.length - 1 ||
    (props.id == nextProps!.chrsTyped.length) ||
    (props.id == nextProps!.chrsTyped.length + 1)) {
    return false;
  } else {
    return true;
  }
})

export default Character;