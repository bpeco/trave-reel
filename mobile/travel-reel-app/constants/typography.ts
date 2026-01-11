/**
 * Typography Design Tokens
 * Based on Plus Jakarta Sans font family from travel-reel-ui-enhanced
 *
 * NOTE: Requires @expo-google-fonts/plus-jakarta-sans to be installed
 * Import and load fonts in App.tsx before using these tokens
 */

// ===== FONT FAMILY =====
/**
 * Font family tokens for Plus Jakarta Sans
 * These reference the actual font names from expo-google-fonts
 */
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

// ===== FONT SIZES =====
/**
 * Font size scale (in pixels)
 * Based on Tailwind's typography scale
 */
export const fontSize = {
  xs: 12,      // text-xs
  sm: 14,      // text-sm
  base: 16,    // text-base (default)
  lg: 18,      // text-lg
  xl: 20,      // text-xl
  '2xl': 24,   // text-2xl
  '3xl': 30,   // text-3xl
  '4xl': 36,   // text-4xl
} as const;

// ===== FONT WEIGHTS =====
/**
 * Font weight values
 * React Native accepts weights as strings
 */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

// ===== LINE HEIGHTS =====
/**
 * Line height multipliers
 * Multiply by font size to get actual line height
 * Example: fontSize.base * lineHeight.normal = 16 * 1.5 = 24
 */
export const lineHeight = {
  tight: 1.25,     // leading-tight
  normal: 1.5,     // leading-normal (default)
  relaxed: 1.75,   // leading-relaxed
  none: 1,         // leading-none
} as const;

// ===== LETTER SPACING =====
/**
 * Letter spacing (tracking) values in pixels
 * Negative values create tighter spacing
 */
export const letterSpacing = {
  tighter: -0.8,   // tracking-tighter
  tight: -0.4,     // tracking-tight
  normal: 0,       // tracking-normal (default)
  wide: 0.4,       // tracking-wide
  wider: 0.8,      // tracking-wider
} as const;

// ===== SEMANTIC TEXT STYLES =====
/**
 * Pre-configured text styles for common use cases
 * Use these for consistency across the app
 */
export const textStyles = {
  // Headings
  h1: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.normal,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.normal,
  },
  h5: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.normal,
  },
  h6: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },

  // Body text
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  // Labels & UI text
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },

  // Buttons
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  buttonLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.none,
  },

  // Caption & helper text
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  captionBold: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },

  // Input text
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },

  // Badge/pill text
  badge: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.none,
  },
} as const;

// ===== EXPORT ALL =====
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,
} as const;

// ===== HELPER TYPE =====
/**
 * Type helper for text style keys
 * Usage: type TextStyleKey = TextStyle;
 */
export type TextStyle = keyof typeof textStyles;
