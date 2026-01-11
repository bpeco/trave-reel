/**
 * Border Radius Design Tokens
 * Based on travel-reel-ui-enhanced border radius system
 * CSS variable: --radius = 1rem (16px)
 */

// ===== BASE BORDER RADIUS SCALE =====
/**
 * Base border radius values (in pixels)
 * Matches Tailwind's rounded-* classes
 */
export const borderRadius = {
  none: 0,       // rounded-none
  sm: 12,        // rounded-sm  | calc(var(--radius) - 4px)
  md: 14,        // rounded-md  | calc(var(--radius) - 2px)
  lg: 16,        // rounded-lg  | var(--radius)
  xl: 20,        // rounded-xl
  '2xl': 24,     // rounded-2xl
  '3xl': 32,     // rounded-3xl
  full: 9999,    // rounded-full (perfect circle/pill)
} as const;

// ===== SEMANTIC BORDER RADIUS =====
/**
 * Semantic border radius for common components
 * Use these for consistency across the app
 */
export const semanticBorderRadius = {
  // Buttons
  button: 20,           // rounded-2xl - Default button
  buttonLarge: 24,      // rounded-3xl - Large button
  buttonSmall: 16,      // rounded-lg - Small button
  buttonIcon: 9999,     // rounded-full - Icon button / FAB

  // Cards
  card: 24,             // rounded-3xl - Main cards
  cardSmall: 20,        // rounded-2xl - Small cards
  cardInner: 16,        // rounded-lg - Inner card elements

  // Inputs
  input: 20,            // rounded-2xl - Text inputs
  textarea: 16,         // rounded-lg - Multiline inputs
  checkbox: 4,          // rounded-sm - Checkboxes
  radio: 9999,          // rounded-full - Radio buttons
  switch: 9999,         // rounded-full - Switch track

  // Badges & Pills
  badge: 9999,          // rounded-full - Badges
  pill: 9999,           // rounded-full - Pills/tags
  chip: 16,             // rounded-lg - Chips

  // Images & Media
  avatar: 9999,         // rounded-full - Avatar
  avatarSquare: 12,     // rounded-md - Square avatar
  image: 16,            // rounded-lg - Regular images
  imageCard: 24,        // rounded-3xl - Image in card
  thumbnail: 12,        // rounded-md - Small thumbnails

  // Modals & Overlays
  modal: 24,            // rounded-3xl - Modal dialogs
  sheet: 24,            // rounded-3xl - Bottom sheets
  tooltip: 12,          // rounded-md - Tooltips
  dropdown: 16,         // rounded-lg - Dropdown menus
  popover: 16,          // rounded-lg - Popovers

  // Navigation
  bottomNav: 0,         // No radius - Bottom navigation (full width)
  bottomNavItem: 16,    // rounded-lg - Bottom nav buttons
  tabBar: 20,           // rounded-2xl - Tab bar

  // Other components
  divider: 2,           // Small radius for dividers
  progressBar: 9999,    // rounded-full - Progress bar
  skeleton: 12,         // rounded-md - Skeleton loaders
  slider: 9999,         // rounded-full - Slider track
} as const;

// ===== COMPONENT VARIANTS =====
/**
 * Border radius variants for different component sizes
 */
export const borderRadiusVariants = {
  button: {
    small: 16,       // rounded-lg
    default: 20,     // rounded-2xl
    large: 24,       // rounded-3xl
    icon: 9999,      // rounded-full
  },
  card: {
    small: 16,       // rounded-lg
    default: 24,     // rounded-3xl
    large: 32,       // rounded-3xl (could be larger if needed)
  },
  input: {
    small: 16,       // rounded-lg
    default: 20,     // rounded-2xl
    large: 24,       // rounded-3xl
  },
  image: {
    small: 12,       // rounded-md
    default: 16,     // rounded-lg
    large: 24,       // rounded-3xl
    full: 9999,      // rounded-full
  },
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get border radius by key
 * @param key - Border radius key
 * @returns Border radius value in pixels
 */
export const getBorderRadius = (key: keyof typeof borderRadius): number => {
  return borderRadius[key];
};

/**
 * Get semantic border radius by component
 * @param component - Component name
 * @returns Border radius value in pixels
 */
export const getSemanticBorderRadius = (
  component: keyof typeof semanticBorderRadius
): number => {
  return semanticBorderRadius[component];
};

/**
 * Get border radius variant for a component
 * @param component - Component type (button, card, input, image)
 * @param variant - Size variant (small, default, large, etc.)
 * @returns Border radius value in pixels
 */
export const getBorderRadiusVariant = (
  component: keyof typeof borderRadiusVariants,
  variant: string
): number => {
  const variants = borderRadiusVariants[component];
  return (variants as any)[variant] || (variants as any).default || 0;
};

/**
 * Create border radius style object for all corners
 * @param radius - Border radius value
 * @returns Style object with borderRadius
 */
export const createBorderRadius = (radius: number) => ({
  borderRadius: radius,
});

/**
 * Create border radius style object for specific corners
 * @param options - Object with top, bottom, left, right radius values
 * @returns Style object with specific corner radii
 */
export const createBorderRadiusCorners = (options: {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) => {
  const {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    top,
    bottom,
    left,
    right,
  } = options;

  return {
    borderTopLeftRadius: topLeft ?? top ?? left ?? 0,
    borderTopRightRadius: topRight ?? top ?? right ?? 0,
    borderBottomLeftRadius: bottomLeft ?? bottom ?? left ?? 0,
    borderBottomRightRadius: bottomRight ?? bottom ?? right ?? 0,
  };
};

// ===== EXPORT ALL =====
export const borderRadiusTokens = {
  base: borderRadius,
  semantic: semanticBorderRadius,
  variants: borderRadiusVariants,
} as const;

export default borderRadiusTokens;
