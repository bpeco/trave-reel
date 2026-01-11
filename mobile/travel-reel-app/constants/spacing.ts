/**
 * Spacing Design Tokens
 * Based on Tailwind's spacing scale from travel-reel-ui-enhanced
 * All values in pixels for React Native
 */

// ===== BASE SPACING SCALE =====
/**
 * Tailwind-inspired spacing scale
 * Matches: p-1, p-2, p-3, etc.
 */
export const spacing = {
  0: 0,
  0.5: 2,    // p-0.5
  1: 4,      // p-1
  1.5: 6,    // p-1.5
  2: 8,      // p-2
  3: 12,     // p-3
  4: 16,     // p-4
  5: 20,     // p-5
  6: 24,     // p-6
  7: 28,     // p-7
  8: 32,     // p-8
  9: 36,     // p-9
  10: 40,    // p-10
  12: 48,    // p-12
  16: 64,    // p-16
  20: 80,    // p-20
  24: 96,    // p-24
  32: 128,   // p-32
} as const;

// ===== SEMANTIC SPACING =====
/**
 * Semantic spacing values for common use cases
 * Use these for consistency across the app
 */
export const semanticSpacing = {
  // Screen-level spacing
  screenPadding: 24,           // p-6 - Main screen horizontal padding
  screenPaddingHorizontal: 24, // px-6
  screenPaddingVertical: 24,   // py-6
  screenPaddingTop: 24,        // pt-6
  screenPaddingBottom: 24,     // pb-6

  // Card spacing
  cardPadding: 24,             // p-6 - Card content padding
  cardPaddingHorizontal: 24,   // px-6
  cardPaddingVertical: 24,     // py-6
  cardGap: 16,                 // gap-4 - Gap between cards
  cardMarginBottom: 16,        // mb-4

  // Component spacing
  componentGap: 12,            // gap-3 - Gap between component elements
  componentGapSmall: 8,        // gap-2
  componentGapLarge: 16,       // gap-4
  componentGapXLarge: 24,      // gap-6

  // Button spacing
  buttonPaddingVertical: 12,   // py-3 - Default button
  buttonPaddingHorizontal: 24, // px-6
  buttonPaddingVerticalSmall: 8,   // py-2 - Small button
  buttonPaddingHorizontalSmall: 16, // px-4
  buttonPaddingVerticalLarge: 14,   // py-3.5 - Large button
  buttonPaddingHorizontalLarge: 32, // px-8
  buttonGap: 8,                // gap-2 - Gap between button icon and text

  // Input/Form spacing
  inputPadding: 16,            // p-4
  inputPaddingHorizontal: 16,  // px-4
  inputPaddingVertical: 12,    // py-3
  inputMarginBottom: 16,       // mb-4
  formFieldGap: 16,            // gap-4 - Gap between form fields
  labelMarginBottom: 8,        // mb-2 - Gap between label and input

  // List spacing
  listItemPadding: 16,         // p-4
  listItemGap: 12,             // gap-3 - Gap between list items
  listItemMarginBottom: 12,    // mb-3

  // Section spacing
  sectionMarginBottom: 24,     // mb-6
  sectionMarginBottomLarge: 32, // mb-8
  sectionGap: 16,              // gap-4 - Gap between section elements

  // Header/Navigation spacing
  headerPadding: 24,           // p-6
  headerHeight: 64,            // Custom - Typical header height
  bottomNavHeight: 80,         // Custom - Bottom navigation height
  bottomNavPadding: 16,        // p-4

  // Badge/Chip spacing
  badgePaddingHorizontal: 10,  // px-2.5
  badgePaddingVertical: 2,     // py-0.5
  badgeGap: 4,                 // gap-1

  // Icon spacing
  iconSize: 24,                // Default icon size
  iconSizeSmall: 20,           // Small icon
  iconSizeLarge: 32,           // Large icon
  iconMarginRight: 8,          // mr-2 - Icon before text
  iconMarginLeft: 8,           // ml-2 - Icon after text

  // Safe area
  safeAreaTop: 16,             // Fallback for safe-area-inset-top
  safeAreaBottom: 16,          // Fallback for safe-area-inset-bottom

  // Overlapping elements
  negativeMarginTop: -32,      // -mt-8 - For overlapping sections
} as const;

// ===== GRID SPACING =====
/**
 * Spacing for grid layouts
 */
export const gridSpacing = {
  gap: 16,           // gap-4 - Default grid gap
  gapSmall: 8,       // gap-2
  gapLarge: 24,      // gap-6
  columns: {
    2: '50%',        // Two-column grid
    3: '33.333%',    // Three-column grid
    4: '25%',        // Four-column grid
  },
} as const;

// ===== CONTAINER SPACING =====
/**
 * Container and layout spacing
 */
export const containerSpacing = {
  maxWidth: 448,     // max-w-md (28rem) - Mobile container
  paddingHorizontal: 24, // px-6
  marginHorizontal: 'auto',
} as const;

// ===== EXPORT ALL =====
export const spacingTokens = {
  spacing,
  semantic: semanticSpacing,
  grid: gridSpacing,
  container: containerSpacing,
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get spacing value by key
 * @param key - Spacing key from the spacing scale
 * @returns Spacing value in pixels
 */
export const getSpacing = (key: keyof typeof spacing): number => {
  return spacing[key];
};

/**
 * Multiply spacing value
 * @param key - Spacing key
 * @param multiplier - Multiplier value
 * @returns Calculated spacing
 */
export const multiplySpacing = (key: keyof typeof spacing, multiplier: number): number => {
  return spacing[key] * multiplier;
};

/**
 * Add two spacing values
 * @param key1 - First spacing key
 * @param key2 - Second spacing key
 * @returns Sum of spacing values
 */
export const addSpacing = (key1: keyof typeof spacing, key2: keyof typeof spacing): number => {
  return spacing[key1] + spacing[key2];
};
