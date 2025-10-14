// --- THIS IS THE FIX ---
// The constants are in `constants.ts`, not `util.ts`.
import { TypographyVariants, variantMappingConstants } from 'external/mv-pbds/base-ui/common/constants';
// We also need to import the tokens correctly as a namespace.
import * as pothosTokens from 'external/mv-pbds/base-ui/tokens/pothos';

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TypographyVariantsOptions extends TypographyVariants {}
}

const typography = {
  fontFamily: "AtAero",
  h1: {
    fontSize: pothosTokens.typography.headline1.fontSize,
    fontWeight: pothosTokens.typography.headline1.fontWeight,
    lineHeight: pothosTokens.typography.headline1.lineHeight,
    letterSpacing: pothosTokens.typography.headline1.letterSpacing,
  },
  h2: {
    fontSize: pothosTokens.typography.headline2.fontSize,
    fontWeight: pothosTokens.typography.headline2.fontWeight,
    lineHeight: pothosTokens.typography.headline2.lineHeight,
    letterSpacing: pothosTokens.typography.headline2.letterSpacing,
  },
  h3: {
    // Assuming title1 maps to h3
    fontSize: pothosTokens.typography.title1.fontSize,
    fontWeight: pothosTokens.typography.title1.fontWeight,
    lineHeight: pothosTokens.typography.title1.lineHeight,
    letterSpacing: pothosTokens.typography.title1.letterSpacing,
  },
  h4: {
    // Assuming title2 maps to h4
    fontSize: pothosTokens.typography.title2.fontSize,
    fontWeight: pothosTokens.typography.title2.fontWeight,
    lineHeight: pothosTokens.typography.title2.lineHeight,
    letterSpacing: pothosTokens.typography.title2.letterSpacing,
  },
  h5: {
    // Using bodyLargeHighEmphasis as a proxy for h5
    fontSize: pothosTokens.typography.bodyLargeHighEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyLargeHighEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyLargeHighEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyLargeHighEmphasis.letterSpacing,
  },
  h6: {
    // Using bodyMediumHighEmphasis as a proxy for h6
    fontSize: pothosTokens.typography.bodyMediumHighEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyMediumHighEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyMediumHighEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyMediumHighEmphasis.letterSpacing,
  },
  subtitle1: {
    fontSize: pothosTokens.typography.bodyLargeMediumEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyLargeMediumEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyLargeMediumEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyLargeMediumEmphasis.letterSpacing,
  },
  subtitle2: {
    fontSize: pothosTokens.typography.bodyMediumMediumEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyMediumMediumEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyMediumMediumEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyMediumMediumEmphasis.letterSpacing,
  },
  body1: {
    fontSize: pothosTokens.typography.bodyLargeLowEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyLargeLowEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyLargeLowEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyLargeLowEmphasis.letterSpacing,
  },
  body2: {
    fontSize: pothosTokens.typography.bodyMediumLowEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyMediumLowEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyMediumLowEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyMediumLowEmphasis.letterSpacing,
  },
  button: {
    fontSize: pothosTokens.typography.bodyLargeMediumEmphasis.fontSize, // Mapped to a suitable style
    fontWeight: pothosTokens.typography.bodyLargeMediumEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyLargeMediumEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyLargeMediumEmphasis.letterSpacing,
    textTransform: "none",
  },
  caption: {
    fontSize: pothosTokens.typography.bodySmallLowEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodySmallLowEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodySmallLowEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodySmallLowEmphasis.letterSpacing,
  },
  overline: {
    fontSize: pothosTokens.typography.bodyTinyLowEmphasis.fontSize,
    fontWeight: pothosTokens.typography.bodyTinyLowEmphasis.fontWeight,
    lineHeight: pothosTokens.typography.bodyTinyLowEmphasis.lineHeight,
    letterSpacing: pothosTokens.typography.bodyTinyLowEmphasis.letterSpacing,
  },
};

const MuiTypography = {
  defaultProps: {
    variantMapping: variantMappingConstants,
  },
};

const MuiLink = {
  defaultProps: {
    variant: "body2",
    underline: "hover",
  },
};

export const muiTypographyTheme = {
  MuiTypography,
  MuiLink,
  typography,
};