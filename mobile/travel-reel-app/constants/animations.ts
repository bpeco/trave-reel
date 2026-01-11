/**
 * Animation Design Tokens
 * Adapted from travel-reel-ui-enhanced Framer Motion animations
 * Configured for react-native-reanimated and Animated API
 */

import { Easing } from 'react-native';

// ===== DURATION VALUES =====
/**
 * Animation duration in milliseconds
 * Based on Framer Motion durations from the UI reference
 */
export const durations = {
  fast: 200,       // Quick interactions, accordions
  normal: 300,     // Default element transitions
  slow: 500,       // Slide transitions, page changes
  slower: 1000,    // Spring animations, logo entry
  pulse: 2000,     // Pulse/glow effects
  float: 3000,     // Float animations
  background: 4000, // Background element movements
  spin: 8000,      // Slow rotation animations
} as const;

// ===== EASING FUNCTIONS =====
/**
 * Easing functions for React Native Animated API
 * Matches CSS easing from the UI reference
 */
export const easings = {
  // Standard easings
  linear: Easing.linear,
  easeIn: Easing.ease,
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),

  // Cubic easings (more control)
  easeInCubic: Easing.in(Easing.cubic),
  easeOutCubic: Easing.out(Easing.cubic),
  easeInOutCubic: Easing.inOut(Easing.cubic),

  // Quad easings
  easeInQuad: Easing.in(Easing.quad),
  easeOutQuad: Easing.out(Easing.quad),
  easeInOutQuad: Easing.inOut(Easing.quad),

  // Sine easings (smooth)
  easeInSine: Easing.in(Easing.sin),
  easeOutSine: Easing.out(Easing.sin),
  easeInOutSine: Easing.inOut(Easing.sin),

  // Expo easings (dramatic)
  easeInExpo: Easing.in(Easing.exp),
  easeOutExpo: Easing.out(Easing.exp),
  easeInOutExpo: Easing.inOut(Easing.exp),

  // Elastic & bounce (for special effects)
  easeInElastic: Easing.elastic(1),
  easeOutElastic: Easing.elastic(1),
  easeInBounce: Easing.bounce,
  easeOutBounce: Easing.out(Easing.bounce),
} as const;

// ===== REANIMATED SPRING CONFIGS =====
/**
 * Spring animation configurations for react-native-reanimated
 * Based on Framer Motion spring animations
 */
export const springs = {
  // Default spring (smooth, natural)
  default: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },

  // Gentle spring (slow, smooth)
  gentle: {
    damping: 20,
    mass: 1,
    stiffness: 100,
  },

  // Bouncy spring (playful)
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 200,
  },

  // Snappy spring (quick, responsive)
  snappy: {
    damping: 25,
    mass: 1,
    stiffness: 300,
  },

  // Wobbly spring (exaggerated)
  wobbly: {
    damping: 8,
    mass: 1,
    stiffness: 180,
  },
} as const;

// ===== REANIMATED TIMING CONFIGS =====
/**
 * Timing animation configurations for react-native-reanimated
 */
export const timings = {
  fast: {
    duration: durations.fast,
    easing: easings.easeOut,
  },
  normal: {
    duration: durations.normal,
    easing: easings.easeInOut,
  },
  slow: {
    duration: durations.slow,
    easing: easings.easeInOut,
  },
  linear: {
    duration: durations.normal,
    easing: easings.linear,
  },
} as const;

// ===== ANIMATION PRESETS =====
/**
 * Pre-configured animation presets matching the UI reference patterns
 */
export const animationPresets = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: durations.normal,
    easing: easings.easeOut,
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: durations.normal,
    easing: easings.easeIn,
  },

  // Scale animations
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    duration: durations.normal,
    easing: easings.easeOut,
  },
  scaleOut: {
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0, scale: 0.8 },
    duration: durations.normal,
    easing: easings.easeIn,
  },

  // Slide animations
  slideInUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    duration: durations.normal,
    easing: easings.easeOut,
  },
  slideInDown: {
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    duration: durations.normal,
    easing: easings.easeOut,
  },
  slideInLeft: {
    from: { opacity: 0, translateX: -20 },
    to: { opacity: 1, translateX: 0 },
    duration: durations.normal,
    easing: easings.easeOut,
  },
  slideInRight: {
    from: { opacity: 0, translateX: 20 },
    to: { opacity: 1, translateX: 0 },
    duration: durations.normal,
    easing: easings.easeOut,
  },

  // Rotate animations
  spinIn: {
    from: { opacity: 0, rotate: '-180deg' },
    to: { opacity: 1, rotate: '0deg' },
    duration: durations.slower,
    easing: easings.easeOut,
  },

  // Pulse animation (for loading/glow effects)
  pulse: {
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0.7, scale: 1.05 },
    duration: durations.pulse,
    loop: true,
    easing: easings.easeInOut,
  },

  // Float animation (up and down)
  float: {
    from: { translateY: 0 },
    to: { translateY: -10 },
    duration: durations.float,
    loop: true,
    easing: easings.easeInOut,
  },

  // Shimmer/loading effect
  shimmer: {
    from: { translateX: '-100%' },
    to: { translateX: '100%' },
    duration: durations.pulse,
    loop: true,
    easing: easings.linear,
  },

  // Button press animation
  buttonPress: {
    from: { scale: 1 },
    to: { scale: 0.98 },
    duration: durations.fast,
    easing: easings.easeOut,
  },

  // Card hover/press animation
  cardPress: {
    from: { scale: 1 },
    to: { scale: 1.02 },
    duration: durations.fast,
    easing: easings.easeOut,
  },
} as const;

// ===== STAGGER DELAYS =====
/**
 * Delay values for staggered animations
 * Used when animating lists or multiple elements
 */
export const staggerDelays = {
  fast: 50,       // Quick stagger
  normal: 100,    // Default stagger (0.1s per item)
  slow: 200,      // Slow stagger
  feature: 300,   // Feature list stagger (0.3-0.8s)
} as const;

// ===== ACCORDION ANIMATIONS =====
/**
 * Specific configs for accordion/collapsible components
 */
export const accordionAnimation = {
  duration: durations.fast,
  easing: easings.easeOut,
};

// ===== TRANSITION CONFIGS =====
/**
 * Common transition configurations
 */
export const transitions = {
  // Button transitions
  button: {
    duration: durations.normal,
    easing: easings.easeInOut,
  },

  // Image zoom on hover/press
  imageZoom: {
    duration: durations.slow,
    easing: easings.easeInOut,
  },

  // Color transitions
  color: {
    duration: durations.fast,
    easing: easings.easeInOut,
  },

  // Form input focus
  inputFocus: {
    duration: durations.fast,
    easing: easings.easeOut,
  },

  // Page transitions
  page: {
    duration: durations.slow,
    easing: easings.easeInOut,
  },
} as const;

// ===== KEYFRAME ANIMATIONS =====
/**
 * Keyframe-style animation sequences
 * For use with react-native-reanimated keyframes
 */
export const keyframes = {
  // Pulse glow effect
  pulseGlow: [
    { opacity: 1, scale: 1 },
    { opacity: 0.7, scale: 1.05 },
    { opacity: 1, scale: 1 },
  ],

  // Float up and down
  float: [
    { translateY: 0 },
    { translateY: -10 },
    { translateY: 0 },
  ],

  // Spin rotation
  spin: [
    { rotate: '0deg' },
    { rotate: '360deg' },
  ],

  // Shake animation
  shake: [
    { translateX: 0 },
    { translateX: -10 },
    { translateX: 10 },
    { translateX: -10 },
    { translateX: 10 },
    { translateX: 0 },
  ],

  // Bounce animation
  bounce: [
    { translateY: 0 },
    { translateY: -30 },
    { translateY: 0 },
    { translateY: -15 },
    { translateY: 0 },
  ],
} as const;

// ===== EXPORT ALL =====
export const animations = {
  durations,
  easings,
  springs,
  timings,
  presets: animationPresets,
  stagger: staggerDelays,
  accordion: accordionAnimation,
  transitions,
  keyframes,
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Calculate stagger delay for an item at a specific index
 * @param index - Item index in list
 * @param baseDelay - Base delay between items (default: 100ms)
 * @returns Delay in milliseconds
 */
export const getStaggerDelay = (index: number, baseDelay: number = 100): number => {
  return index * baseDelay;
};

/**
 * Get timing config by name
 * @param name - Timing preset name
 * @returns Timing configuration
 */
export const getTiming = (name: keyof typeof timings) => {
  return timings[name];
};

/**
 * Get spring config by name
 * @param name - Spring preset name
 * @returns Spring configuration
 */
export const getSpring = (name: keyof typeof springs) => {
  return springs[name];
};

/**
 * Get animation preset by name
 * @param name - Animation preset name
 * @returns Animation configuration
 */
export const getAnimationPreset = (name: keyof typeof animationPresets) => {
  return animationPresets[name];
};

// ===== EXPORT ALL =====
export default animations;
