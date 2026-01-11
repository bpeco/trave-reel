/**
 * Color Design Tokens
 * Converted from travel-reel-ui-enhanced HSL values to hex/rgba
 * Based on Warm Sunset theme with support for light and dark modes
 */

export const colors = {
  // ===== LIGHT MODE =====
  light: {
    // Base colors
    background: '#FAF8F5',      // hsl(30 40% 98%) - Warm off-white
    foreground: '#171D27',      // hsl(220 25% 12%) - Dark navy

    // Primary (Sunset Coral)
    primary: '#E85D3F',         // hsl(12 85% 60%)
    primaryForeground: '#FFFFFF', // hsl(0 0% 100%)
    primaryLight: '#F2977F',    // hsl(12 90% 75%)
    primaryDark: '#C23D1F',     // hsl(12 75% 45%)

    // Secondary (Ocean Deep)
    secondary: '#203A5F',       // hsl(220 50% 25%)
    secondaryForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Accent (Golden)
    accent: '#FAAD14',          // hsl(38 95% 55%)
    accentForeground: '#171D27', // hsl(220 25% 12%)

    // Muted
    muted: '#F2EBE6',           // hsl(35 30% 94%) - Light sand
    mutedForeground: '#66718A', // hsl(220 15% 45%)

    // Destructive
    destructive: '#ED2626',     // hsl(0 84% 60%)
    destructiveForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Border & Input
    border: '#E5DED7',          // hsl(30 20% 88%)
    input: '#E5DED7',           // hsl(30 20% 88%)
    ring: '#E85D3F',            // hsl(12 85% 60%) - Primary

    // Card & Popover
    card: '#FFFFFF',            // hsl(0 0% 100%)
    cardForeground: '#171D27',  // hsl(220 25% 12%)
    popover: '#FFFFFF',         // hsl(0 0% 100%)
    popoverForeground: '#171D27', // hsl(220 25% 12%)
  },

  // ===== DARK MODE =====
  dark: {
    // Base colors
    background: '#0F1419',      // hsl(222 30% 8%) - Very dark blue
    foreground: '#F5F2EF',      // hsl(30 20% 95%) - Off-white

    // Primary (Sunset Coral - unchanged)
    primary: '#E85D3F',         // hsl(12 85% 60%)
    primaryForeground: '#FFFFFF', // hsl(0 0% 100%)
    primaryLight: '#F2977F',    // hsl(12 90% 75%)
    primaryDark: '#C23D1F',     // hsl(12 75% 45%)

    // Secondary (Lighter Ocean)
    secondary: '#3399CC',       // hsl(210 60% 50%)
    secondaryForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Accent (Golden - unchanged)
    accent: '#FAAD14',          // hsl(38 95% 55%)
    accentForeground: '#171D27', // hsl(220 25% 12%)

    // Muted
    muted: '#252930',           // hsl(222 20% 18%)
    mutedForeground: '#B0A89F', // hsl(30 15% 65%)

    // Destructive
    destructive: '#ED2626',     // hsl(0 84% 60%)
    destructiveForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Border & Input
    border: '#282D36',          // hsl(222 20% 20%)
    input: '#282D36',           // hsl(222 20% 20%)
    ring: '#E85D3F',            // hsl(12 85% 60%)

    // Card & Popover
    card: '#0F1419',            // Same as background
    cardForeground: '#F5F2EF',  // hsl(30 20% 95%)
    popover: '#0F1419',         // Same as background
    popoverForeground: '#F5F2EF', // hsl(30 20% 95%)
  },

  // ===== EXTENDED PALETTE =====
  coral: '#E85D3F',             // hsl(12 85% 60%)
  coralLight: '#F2977F',        // hsl(12 90% 75%)
  coralDark: '#C23D1F',         // hsl(12 75% 45%)

  ocean: '#203A5F',             // hsl(220 50% 25%)
  oceanLight: '#3399CC',        // hsl(210 60% 50%)

  sand: '#F5E6CC',              // hsl(38 50% 90%)
  sky: '#5CADCC',               // hsl(200 80% 60%)

  // ===== CATEGORY COLORS =====
  categories: {
    cultura: {
      background: '#F3E8FF',    // hsl(280 70% 95%)
      text: '#7C3AED',          // hsl(280 70% 40%)
      base: '#A855F7',          // hsl(280 70% 55%)
    },
    gastronomia: {
      background: '#FFF4E6',    // hsl(25 90% 95%)
      text: '#C2410C',          // hsl(25 90% 40%)
      base: '#F97316',          // hsl(25 90% 55%)
    },
    naturaleza: {
      background: '#ECFDF5',    // hsl(145 60% 92%)
      text: '#166534',          // hsl(145 60% 30%)
      base: '#34B759',          // hsl(145 60% 45%)
    },
    iconico: {
      background: '#FFF1ED',    // hsl(12 85% 95%)
      text: '#C23D1F',          // hsl(12 75% 45%)
      base: '#E85D3F',          // hsl(12 85% 60%)
    },
    compras: {
      background: '#F0F9FF',    // hsl(200 80% 95%)
      text: '#0369A1',          // hsl(200 80% 35%)
      base: '#29A3D1',          // hsl(200 80% 50%)
    },
  },

  // ===== SIDEBAR COLORS (for future use) =====
  sidebar: {
    light: {
      background: '#FAFAFA',    // hsl(0 0% 98%)
      foreground: '#404040',    // hsl(240 5.3% 26.1%)
      primary: '#171717',       // hsl(240 5.9% 10%)
      primaryForeground: '#FAFAFA',
      accent: '#F5F5F5',        // hsl(240 4.8% 95.9%)
      accentForeground: '#171717',
      border: '#E4E4E7',        // hsl(220 13% 91%)
      ring: '#3B82F6',          // hsl(217.2 91.2% 59.8%)
    },
    dark: {
      background: '#1A1A1A',    // hsl(240 5.9% 10%)
      foreground: '#F5F5F5',    // hsl(240 4.8% 95.9%)
      primary: '#3B82F6',       // hsl(224.3 76.3% 48%)
      primaryForeground: '#F5F5F5',
      accent: '#262626',        // hsl(240 3.7% 15.9%)
      accentForeground: '#F5F5F5',
      border: '#262626',        // hsl(240 3.7% 15.9%)
      ring: '#3B82F6',          // hsl(217.2 91.2% 59.8%)
    },
  },

  // ===== COMMON COLORS =====
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ===== OPACITY HELPERS =====
  // Use these with rgba() for consistent opacity values
  opacity: {
    10: 0.1,
    15: 0.15,
    20: 0.2,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    80: 0.8,
    90: 0.9,
  },
} as const;

// ===== GRADIENT COLOR ARRAYS (for expo-linear-gradient) =====
export const gradientColors = {
  sunset: ['#FF9F6C', '#E85D3F', '#D93D4F'],      // hsl(25 100% 65%), hsl(12 85% 60%), hsl(350 80% 55%)
  ocean: ['#5CADCC', '#203A5F'],                   // hsl(200 80% 60%), hsl(220 50% 25%)
  warm: ['#FAF8F5', '#F2EBE6'],                    // hsl(30 40% 98%), hsl(35 30% 94%)
  card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'], // Glass effect
  cardDark: ['rgba(15, 20, 25, 0.9)', 'rgba(15, 20, 25, 0.7)'],  // Dark glass
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Add opacity to a hex color
 * @param color - Hex color (e.g., '#E85D3F')
 * @param opacity - Opacity value 0-1 (e.g., 0.5)
 * @returns rgba color string
 */
export const addOpacity = (color: string, opacity: number): string => {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get color with opacity using the opacity scale
 * @param color - Hex color
 * @param opacityKey - Key from colors.opacity (10, 20, 30, etc.)
 */
export const withOpacity = (color: string, opacityKey: keyof typeof colors.opacity): string => {
  return addOpacity(color, colors.opacity[opacityKey]);
};
