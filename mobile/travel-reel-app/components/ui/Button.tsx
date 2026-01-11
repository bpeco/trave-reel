/**
 * Button Component
 * Migrated from travel-reel-ui-enhanced
 *
 * A highly flexible button component with multiple variants, sizes, and animation support.
 * Supports gradient backgrounds, icons, loading states, and haptic feedback.
 *
 * @example
 * ```tsx
 * // Primary button with icon
 * <Button variant="sunset" size="lg" leftIcon={<Icon />} onPress={handlePress}>
 *   Get Started
 * </Button>
 *
 * // Loading state
 * <Button loading>Processing...</Button>
 *
 * // Floating action button
 * <Button variant="fab" size="fab">+</Button>
 * ```
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  gradients,
  durations,
  springs,
  addOpacity,
} from '@/constants';

// Extract fontSize for use in size styles
const { fontSize } = typography;

// ============ TYPES ============

/**
 * Visual variants for the button
 * - default: Primary coral color
 * - destructive: Red, for dangerous actions
 * - outline: Bordered with transparent background
 * - secondary: Ocean blue color
 * - ghost: Minimal styling, hover effect only
 * - link: Text-only with underline
 * - sunset: Gradient coral to red
 * - ocean: Gradient blue shades
 * - glass: Frosted glass effect
 * - fab: Floating action button (circular)
 */
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'sunset'
  | 'ocean'
  | 'glass'
  | 'fab';

/**
 * Size presets for the button
 */
export type ButtonSize = 'sm' | 'default' | 'lg' | 'xl' | 'icon' | 'fab';

/**
 * Button component props
 */
export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Button content (text or elements) */
  children?: React.ReactNode;
  /** Icon displayed before text */
  leftIcon?: React.ReactNode;
  /** Icon displayed after text */
  rightIcon?: React.ReactNode;
  /** Shows loading spinner and disables interaction */
  loading?: boolean;
  /** Stretches button to full container width */
  fullWidth?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
  /** Enable haptic feedback on press (default: true) */
  haptic?: boolean;
}

// ============ COMPONENT ============

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
  haptic = true,
  onPressIn,
  onPressOut,
  onPress,
  ...pressableProps
}) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const scale = useSharedValue(1);
  const c = colors[systemColorScheme];

  // Check if variant uses gradient
  const isGradientVariant = variant === 'sunset' || variant === 'ocean' || variant === 'fab';

  // Determine if button should be in disabled state
  const isDisabled = disabled || loading;

  // ============ ANIMATION ============

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ============ HANDLERS ============

  const handlePressIn = useCallback(
    (event: any) => {
      if (!isDisabled) {
        scale.value = withSpring(0.98, springs.bouncy);
        if (haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
      onPressIn?.(event);
    },
    [isDisabled, haptic, onPressIn]
  );

  const handlePressOut = useCallback(
    (event: any) => {
      if (!isDisabled) {
        scale.value = withSpring(1, springs.bouncy);
      }
      onPressOut?.(event);
    },
    [isDisabled, onPressOut]
  );

  const handlePress = useCallback(
    (event: any) => {
      if (haptic && !isDisabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress?.(event);
    },
    [haptic, isDisabled, onPress]
  );

  // ============ STYLES ============

  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, systemColorScheme);

  // Get size-specific styles
  const sizeStyles = getSizeStyles(size);

  // Combine container styles
  const containerStyle: ViewStyle[] = [
    styles.base,
    sizeStyles.container,
    variantStyles.container,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  // Combine text styles
  const textStyleCombined: TextStyle[] = [
    styles.text,
    sizeStyles.text,
    variantStyles.text,
    isDisabled && styles.disabledText,
    textStyle,
  ];

  // ============ CONTENT ============

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color || c.primaryForeground}
          style={styles.loader}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          {typeof children === 'string' ? (
            <Text style={textStyleCombined} numberOfLines={1}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // ============ RENDER ============

  // Render gradient variants
  if (isGradientVariant && !isDisabled) {
    const gradientConfig = variant === 'fab' ? gradients.sunset : gradients[variant as 'sunset' | 'ocean'];

    return (
      <AnimatedPressable
        style={[animatedStyle, containerStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        {...pressableProps}
      >
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  // Render solid/outlined variants
  return (
    <AnimatedPressable
      style={[animatedStyle, containerStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...pressableProps}
    >
      {content}
    </AnimatedPressable>
  );
};

// ============ VARIANT STYLES ============

function getVariantStyles(variant: ButtonVariant, colorScheme: 'light' | 'dark') {
  const c = colors[colorScheme];

  const variantMap: Record<
    ButtonVariant,
    { container: ViewStyle; text: TextStyle }
  > = {
    default: {
      container: {
        backgroundColor: c.primary,
        ...shadows.soft,
      },
      text: { color: c.primaryForeground },
    },
    destructive: {
      container: {
        backgroundColor: c.destructive,
      },
      text: { color: c.destructiveForeground },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: c.primary,
      },
      text: { color: c.primary },
    },
    secondary: {
      container: {
        backgroundColor: c.secondary,
      },
      text: { color: c.secondaryForeground },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: { color: c.foreground },
    },
    link: {
      container: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
      },
      text: {
        color: c.primary,
        textDecorationLine: 'underline',
      },
    },
    sunset: {
      container: {
        ...shadows.float,
      },
      text: { color: colors.white },
    },
    ocean: {
      container: {
        ...shadows.card,
      },
      text: { color: colors.white },
    },
    glass: {
      container: {
        backgroundColor: addOpacity(c.background, 0.9), // 90% opacity with design system helper
        borderWidth: 1,
        borderColor: c.border,
        ...shadows.card,
      },
      text: { color: c.foreground },
    },
    fab: {
      container: {
        ...shadows.float,
      },
      text: { color: colors.white },
    },
  };

  return variantMap[variant];
}

// ============ SIZE STYLES ============

function getSizeStyles(size: ButtonSize) {
  const sizeMap: Record<
    ButtonSize,
    { container: ViewStyle; text: TextStyle }
  > = {
    sm: {
      container: {
        height: 40,
        paddingHorizontal: spacing[4],
        borderRadius: borderRadius.xl,
      },
      text: {
        ...typography.textStyles.button,
        fontSize: fontSize.sm,
      },
    },
    default: {
      container: {
        height: 48,
        paddingHorizontal: spacing[6],
        borderRadius: borderRadius['2xl'],
      },
      text: {
        ...typography.textStyles.button,
      },
    },
    lg: {
      container: {
        height: 56,
        paddingHorizontal: spacing[8],
        borderRadius: borderRadius['2xl'],
      },
      text: {
        ...typography.textStyles.buttonLarge,
      },
    },
    xl: {
      container: {
        height: 64,
        paddingHorizontal: spacing[10],
        borderRadius: borderRadius['3xl'],
      },
      text: {
        ...typography.textStyles.buttonLarge,
        fontSize: fontSize.lg,
      },
    },
    icon: {
      container: {
        height: 48,
        width: 48,
        paddingHorizontal: 0,
        borderRadius: borderRadius['2xl'],
      },
      text: {
        fontSize: fontSize.base,
      },
    },
    fab: {
      container: {
        height: 56,
        width: 56,
        paddingHorizontal: 0,
        borderRadius: 28, // Fully circular
      },
      text: {
        fontSize: fontSize.xl,
      },
    },
  };

  return sizeMap[size];
}

// ============ STATIC STYLES ============

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iconLeft: {
    marginRight: spacing[1],
  },
  iconRight: {
    marginLeft: spacing[1],
  },
  loader: {
    marginHorizontal: spacing[2],
  },
});

// Display name for debugging
Button.displayName = 'Button';
