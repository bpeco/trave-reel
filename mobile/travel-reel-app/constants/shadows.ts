/**
 * Shadow Design Tokens
 * Adapted from travel-reel-ui-enhanced shadow system
 * Cross-platform support for iOS (shadowColor/shadowOffset/shadowOpacity/shadowRadius)
 * and Android (elevation)
 */

import { Platform, ViewStyle } from 'react-native';

// ===== SHADOW DEFINITIONS =====

/**
 * Soft shadow - Subtle glow effect
 * CSS: 0 4px 20px -4px hsl(12 85% 60% / 0.15)
 * Used for: Gentle elevation, hover states
 */
export const shadowSoft: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#E85D3F',  // Primary color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  android: {
    elevation: 3,
  },
  default: {},
}) as ViewStyle;

/**
 * Card shadow - Standard card elevation
 * CSS: 0 8px 32px -8px hsl(220 25% 12% / 0.1)
 * Used for: Cards, panels, containers
 */
export const shadowCard: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#171D27',  // Foreground color
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
  },
  android: {
    elevation: 6,
  },
  default: {},
}) as ViewStyle;

/**
 * Float shadow - Pronounced floating effect
 * CSS: 0 20px 40px -12px hsl(220 25% 12% / 0.15)
 * Used for: FABs, modals, important CTAs
 */
export const shadowFloat: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#171D27',  // Foreground color
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
  },
  android: {
    elevation: 12,
  },
  default: {},
}) as ViewStyle;

// ===== DARK MODE SHADOWS =====

/**
 * Dark mode shadow variants
 * Shadows are more pronounced in dark mode (higher opacity)
 */
export const shadowSoftDark: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  android: {
    elevation: 4,
  },
  default: {},
}) as ViewStyle;

export const shadowCardDark: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
  },
  android: {
    elevation: 8,
  },
  default: {},
}) as ViewStyle;

export const shadowFloatDark: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  android: {
    elevation: 16,
  },
  default: {},
}) as ViewStyle;

// ===== ADDITIONAL SHADOW VARIANTS =====

/**
 * No shadow
 */
export const shadowNone: ViewStyle = Platform.select({
  ios: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  android: {
    elevation: 0,
  },
  default: {},
}) as ViewStyle;

/**
 * Small shadow - Minimal elevation
 * CSS equivalent: shadow-sm
 */
export const shadowSmall: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  android: {
    elevation: 1,
  },
  default: {},
}) as ViewStyle;

/**
 * Medium shadow - Moderate elevation
 * CSS equivalent: shadow-md
 */
export const shadowMedium: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: {
    elevation: 4,
  },
  default: {},
}) as ViewStyle;

/**
 * Large shadow - Strong elevation
 * CSS equivalent: shadow-lg
 */
export const shadowLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  android: {
    elevation: 8,
  },
  default: {},
}) as ViewStyle;

/**
 * Extra large shadow - Very strong elevation
 * CSS equivalent: shadow-xl
 */
export const shadowXLarge: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
  },
  android: {
    elevation: 16,
  },
  default: {},
}) as ViewStyle;

// ===== SEMANTIC SHADOWS =====

/**
 * Semantic shadow names for common use cases
 */
export const shadows = {
  // Main shadow system
  soft: shadowSoft,
  card: shadowCard,
  float: shadowFloat,

  // Dark mode
  softDark: shadowSoftDark,
  cardDark: shadowCardDark,
  floatDark: shadowFloatDark,

  // Size variants
  none: shadowNone,
  sm: shadowSmall,
  md: shadowMedium,
  lg: shadowLarge,
  xl: shadowXLarge,

  // Component-specific
  button: shadowSoft,
  buttonPrimary: shadowFloat,
  input: shadowSmall,
  modal: shadowXLarge,
  bottomNav: shadowLarge,
  fab: shadowFloat,
  tooltip: shadowMedium,
  dropdown: shadowLarge,
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get shadow style based on theme
 * @param shadowType - Type of shadow (soft, card, float)
 * @param isDark - Whether dark mode is active
 * @returns Shadow style object
 */
export const getShadow = (
  shadowType: 'soft' | 'card' | 'float',
  isDark: boolean = false
): ViewStyle => {
  if (isDark) {
    const darkShadows = {
      soft: shadowSoftDark,
      card: shadowCardDark,
      float: shadowFloatDark,
    };
    return darkShadows[shadowType];
  }

  const lightShadows = {
    soft: shadowSoft,
    card: shadowCard,
    float: shadowFloat,
  };
  return lightShadows[shadowType];
};

/**
 * Create custom shadow
 * @param color - Shadow color (hex)
 * @param offset - Shadow offset {width, height}
 * @param opacity - Shadow opacity (0-1)
 * @param radius - Shadow blur radius
 * @param elevation - Android elevation
 * @returns Shadow style object
 */
export const createShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number = 4
): ViewStyle => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {},
  }) as ViewStyle;
};

// ===== EXPORT ALL =====
export default shadows;
