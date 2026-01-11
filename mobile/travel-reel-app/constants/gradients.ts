/**
 * Gradient Design Tokens
 * Adapted from travel-reel-ui-enhanced gradient system
 * Configured for expo-linear-gradient
 *
 * NOTE: CSS gradient angles are converted to React Native coordinates:
 * - 0deg (top) = { x: 0.5, y: 0 } to { x: 0.5, y: 1 }
 * - 90deg (right) = { x: 0, y: 0.5 } to { x: 1, y: 0.5 }
 * - 135deg (diagonal) = { x: 0, y: 0 } to { x: 1, y: 1 }
 * - 180deg (bottom) = { x: 0.5, y: 0 } to { x: 0.5, y: 1 }
 */

import { colors } from './colors';

// ===== GRADIENT TYPE DEFINITION =====
export interface GradientConfig {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations?: number[]; // Optional stop positions (0-1)
}

// ===== MAIN GRADIENTS =====

/**
 * Sunset Gradient
 * CSS: linear-gradient(135deg, hsl(25 100% 65%), hsl(12 85% 60%), hsl(350 80% 55%))
 * Colors: Orange → Coral → Deep Red
 * Used for: Primary CTAs, hero sections, FAB buttons
 */
export const gradientSunset: GradientConfig = {
  colors: ['#FF9F6C', '#E85D3F', '#D93D4F'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }, // 135deg diagonal
  locations: [0, 0.5, 1],
};

/**
 * Ocean Gradient
 * CSS: linear-gradient(135deg, hsl(200 80% 60%), hsl(220 50% 25%))
 * Colors: Sky Blue → Ocean Blue
 * Used for: Secondary buttons, water/travel themes
 */
export const gradientOcean: GradientConfig = {
  colors: ['#5CADCC', '#203A5F'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }, // 135deg diagonal
  locations: [0, 1],
};

/**
 * Warm Background Gradient
 * CSS: linear-gradient(180deg, hsl(30 40% 98%), hsl(35 30% 94%))
 * Colors: Warm Off-White → Light Sand
 * Used for: Page backgrounds, subtle elevation
 */
export const gradientWarm: GradientConfig = {
  colors: ['#FAF8F5', '#F2EBE6'],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 }, // 180deg vertical
  locations: [0, 1],
};

/**
 * Card Glass Gradient (Light Mode)
 * CSS: linear-gradient(145deg, hsl(0 0% 100% / 0.9), hsl(0 0% 100% / 0.7))
 * Colors: White with opacity gradient
 * Used for: Glass morphism cards, overlays
 */
export const gradientCard: GradientConfig = {
  colors: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }, // 145deg diagonal (approximated to 135deg)
  locations: [0, 1],
};

/**
 * Card Glass Gradient (Dark Mode)
 * Colors: Dark background with opacity gradient
 * Used for: Glass morphism cards in dark mode
 */
export const gradientCardDark: GradientConfig = {
  colors: ['rgba(15, 20, 25, 0.9)', 'rgba(15, 20, 25, 0.7)'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 1],
};

// ===== IMAGE OVERLAY GRADIENTS =====

/**
 * Top-to-bottom overlay (dark)
 * Used for: Image overlays to improve text readability
 */
export const gradientOverlayTop: GradientConfig = {
  colors: ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.2)', 'transparent'],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  locations: [0, 0.5, 1],
};

/**
 * Bottom-to-top overlay (dark)
 * Used for: Bottom text on images (most common)
 */
export const gradientOverlayBottom: GradientConfig = {
  colors: ['transparent', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.7)'],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  locations: [0, 0.5, 1],
};

/**
 * Full dark overlay
 * Used for: Scrim/dimming effect
 */
export const gradientOverlayFull: GradientConfig = {
  colors: ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)'],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  locations: [0, 1],
};

// ===== CATEGORY GRADIENTS =====

/**
 * Category-specific gradients (light variants)
 */
export const gradientCategories = {
  cultura: {
    colors: [
      colors.categories.cultura.background,
      colors.categories.cultura.base,
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientConfig,

  gastronomia: {
    colors: [
      colors.categories.gastronomia.background,
      colors.categories.gastronomia.base,
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientConfig,

  naturaleza: {
    colors: [
      colors.categories.naturaleza.background,
      colors.categories.naturaleza.base,
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientConfig,

  iconico: {
    colors: [
      colors.categories.iconico.background,
      colors.categories.iconico.base,
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientConfig,

  compras: {
    colors: [
      colors.categories.compras.background,
      colors.categories.compras.base,
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  } as GradientConfig,
};

// ===== SHIMMER/LOADING GRADIENTS =====

/**
 * Shimmer effect gradient
 * Used for: Skeleton loading states
 * NOTE: Requires animation to move the gradient
 */
export const gradientShimmer: GradientConfig = {
  colors: [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0)',
  ],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 }, // Horizontal
  locations: [0, 0.5, 1],
};

/**
 * Shimmer effect (dark mode)
 */
export const gradientShimmerDark: GradientConfig = {
  colors: [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0)',
  ],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
  locations: [0, 0.5, 1],
};

// ===== ALL GRADIENTS =====

export const gradients = {
  // Main gradients
  sunset: gradientSunset,
  ocean: gradientOcean,
  warm: gradientWarm,
  card: gradientCard,
  cardDark: gradientCardDark,

  // Overlay gradients
  overlayTop: gradientOverlayTop,
  overlayBottom: gradientOverlayBottom,
  overlayFull: gradientOverlayFull,

  // Category gradients
  categories: gradientCategories,

  // Loading gradients
  shimmer: gradientShimmer,
  shimmerDark: gradientShimmerDark,
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get gradient configuration by name
 * @param name - Gradient name
 * @returns Gradient config object
 */
export const getGradient = (
  name: keyof typeof gradients
): GradientConfig | undefined => {
  return gradients[name] as GradientConfig | undefined;
};

/**
 * Create custom gradient
 * @param colors - Array of color strings
 * @param angle - CSS angle in degrees (0, 90, 135, 180, etc.)
 * @param locations - Optional stop positions
 * @returns Gradient config object
 */
export const createGradient = (
  colors: string[],
  angle: number = 135,
  locations?: number[]
): GradientConfig => {
  // Convert CSS angle to React Native coordinates
  let start = { x: 0, y: 0 };
  let end = { x: 1, y: 1 };

  switch (angle) {
    case 0: // Top to bottom
      start = { x: 0.5, y: 0 };
      end = { x: 0.5, y: 1 };
      break;
    case 90: // Left to right
      start = { x: 0, y: 0.5 };
      end = { x: 1, y: 0.5 };
      break;
    case 135: // Diagonal (top-left to bottom-right)
      start = { x: 0, y: 0 };
      end = { x: 1, y: 1 };
      break;
    case 180: // Bottom to top
      start = { x: 0.5, y: 1 };
      end = { x: 0.5, y: 0 };
      break;
    case 270: // Right to left
      start = { x: 1, y: 0.5 };
      end = { x: 0, y: 0.5 };
      break;
    default:
      // For custom angles, use 135deg as default
      start = { x: 0, y: 0 };
      end = { x: 1, y: 1 };
  }

  return {
    colors,
    start,
    end,
    locations,
  };
};

/**
 * Create vertical gradient (top to bottom)
 * @param colors - Array of color strings
 * @param locations - Optional stop positions
 */
export const createVerticalGradient = (
  colors: string[],
  locations?: number[]
): GradientConfig => {
  return {
    colors,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    locations,
  };
};

/**
 * Create horizontal gradient (left to right)
 * @param colors - Array of color strings
 * @param locations - Optional stop positions
 */
export const createHorizontalGradient = (
  colors: string[],
  locations?: number[]
): GradientConfig => {
  return {
    colors,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
    locations,
  };
};

/**
 * Create diagonal gradient (top-left to bottom-right)
 * @param colors - Array of color strings
 * @param locations - Optional stop positions
 */
export const createDiagonalGradient = (
  colors: string[],
  locations?: number[]
): GradientConfig => {
  return {
    colors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations,
  };
};

// ===== EXPORT ALL =====
export default gradients;
