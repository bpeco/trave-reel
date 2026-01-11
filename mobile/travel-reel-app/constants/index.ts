/**
 * Design System - Central Export
 * Travel-Reel Mobile App
 *
 * This file exports all design tokens from the constants folder.
 * Import the entire theme object or individual tokens as needed.
 *
 * @example
 * // Import entire theme
 * import { theme } from '@/constants';
 *
 * // Import specific tokens
 * import { colors, typography, spacing } from '@/constants';
 *
 * // Use in components
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.light.background,
 *     padding: spacing[6],
 *     borderRadius: borderRadius.lg,
 *     ...shadows.card,
 *   },
 * });
 */

// ===== EXPORT ALL TOKENS =====

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borderRadius';
export * from './gradients';
export * from './animations';

// ===== IMPORT FOR THEME OBJECT =====

import { colors, gradientColors, addOpacity, withOpacity } from './colors';
import { typography, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textStyles } from './typography';
import { spacingTokens, spacing, semanticSpacing, gridSpacing, containerSpacing } from './spacing';
import { shadows, getShadow, createShadow } from './shadows';
import { borderRadiusTokens, borderRadius, semanticBorderRadius, borderRadiusVariants } from './borderRadius';
import { gradients, GradientConfig } from './gradients';
import { animations, durations, easings, springs, timings, animationPresets } from './animations';

// ===== UNIFIED THEME OBJECT =====

/**
 * Unified theme object containing all design tokens
 * Use this for comprehensive access to the entire design system
 */
export const theme = {
  // Colors
  colors,
  gradientColors,

  // Typography
  typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,

  // Spacing
  spacing,
  semanticSpacing,
  gridSpacing,
  containerSpacing,

  // Visual Effects
  shadows,
  borderRadius,
  semanticBorderRadius,
  borderRadiusVariants,
  gradients,

  // Animations
  animations,
  durations,
  easings,
  springs,
  timings,
  animationPresets,

  // Helper functions
  helpers: {
    // Color helpers
    addOpacity,
    withOpacity,

    // Shadow helpers
    getShadow,
    createShadow,
  },
} as const;

// ===== TYPE EXPORTS =====

/**
 * Export types for TypeScript support
 */
export type { GradientConfig } from './gradients';
export type { TextStyle } from './typography';

/**
 * Theme type - use for typed access to theme object
 */
export type Theme = typeof theme;

/**
 * Color mode type
 */
export type ColorMode = 'light' | 'dark';

// ===== DEFAULT EXPORT =====

/**
 * Default export is the unified theme object
 */
export default theme;
