import { createTheme } from "@mui/material";

import { muiTypographyTheme } from "./typography-theme";

// --- FIX #1: Import tokens directly from local files ---
import * as flipkartTokens from 'external/mv-pbds/base-ui/tokens/flipkart';
import * as pothosTokens from 'external/mv-pbds/base-ui/tokens/pothos';
import { PothosTokensType } from 'external/mv-pbds/base-ui/tokens/pothos'; // This might need to be a local type now
import * as jifyTokens from 'external/mv-pbds/base-ui/tokens/jify';


import { breakpoints } from "./breakpoints";
// --- FIX #2: This import will now work because we copied the file ---
import { PWAThemeNames } from "./constant.ts";

function getAppTokens(name: string) {
  if (name === PWAThemeNames.FLIPKART) {
    return flipkartTokens;
  }
  if (name === PWAThemeNames.JIFY) {
    return jifyTokens;
  }
  return pothosTokens;
}

export const getTheme = (themeName: string) => {
  let tokens = getAppTokens(themeName);
  return createTheme({
    components: {
      // @ts-ignore
      MuiTypography: muiTypographyTheme.MuiTypography,
      // @ts-ignore
      MuiLink: muiTypographyTheme.MuiLink,
    },
    typography: muiTypographyTheme.typography,
    themeName: themeName,
    tokens,
    breakpoints: breakpoints,
  });
};

export type MVTheme = ReturnType<typeof getTheme>;

// Module declaration remains the same
declare module "@mui/material/styles" {
  export interface Theme {
    tokens: PothosTokensType;
    themeName: PWAThemeNames;
  }
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile360: true;
    mobile480: true;
    tablet768: true;
    tablet960: true;
    desktop1440: true;
  }
}