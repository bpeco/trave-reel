/**
 * Input Component
 * Migrated from travel-reel-ui-enhanced
 *
 * A text input component with label, error states, icons, and smooth focus animations.
 * Supports various keyboard types, sizes, and visual states.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 * />
 *
 * // With error
 * <Input
 *   label="Password"
 *   error="Password must be at least 8 characters"
 *   secureTextEntry
 * />
 *
 * // With icons
 * <Input
 *   label="Search"
 *   placeholder="Search destinations..."
 *   leftIcon={<SearchIcon />}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  durations,
} from '@/constants';

// ============ TYPES ============

/**
 * Size variants for the input
 */
export type InputSize = 'sm' | 'default' | 'lg';

/**
 * Input component props
 */
export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label text displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input (when no error) */
  helperText?: string;
  /** Icon displayed on the left side */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side */
  rightIcon?: React.ReactNode;
  /** Size variant */
  size?: InputSize;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Input style */
  inputStyle?: ViewStyle;
}

// ============ COMPONENT ============

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'default',
  containerStyle,
  inputStyle,
  editable = true,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const c = colors[systemColorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  // ============ ANIMATION ============

  // Animate focus state
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: durations.fast,
    });
  }, [isFocused]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [c.input, error ? c.destructive : c.primary]
    );

    return {
      borderColor,
      borderWidth: isFocused || error ? 2 : 1, // Thicker border on focus/error
    };
  });

  // ============ HANDLERS ============

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  // ============ STYLES ============

  const sizeStyles = getSizeStyles(size);
  const hasError = !!error;
  const isDisabled = !editable;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text
          style={[
            styles.label,
            { color: hasError ? c.destructive : c.foreground },
            isDisabled && styles.disabledText,
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          sizeStyles.container,
          {
            backgroundColor: c.background,
            borderColor: hasError ? c.destructive : c.input,
          },
          animatedBorderStyle,
          isDisabled && styles.disabled,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconLeft}>
            {leftIcon}
          </View>
        )}

        {/* Text Input */}
        <AnimatedTextInput
          style={[
            styles.input,
            sizeStyles.input,
            {
              color: c.foreground,
            },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={c.mutedForeground}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityState={{
            disabled: isDisabled,
          }}
          {...textInputProps}
        />

        {/* Right Icon */}
        {rightIcon && (
          <View style={styles.iconRight}>
            {rightIcon}
          </View>
        )}
      </Animated.View>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <Text
          style={[
            styles.helperText,
            { color: hasError ? c.destructive : c.mutedForeground },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// ============ SIZE STYLES ============

function getSizeStyles(size: InputSize) {
  const sizeMap: Record<
    InputSize,
    { container: ViewStyle; input: any }
  > = {
    sm: {
      container: {
        height: 40,
        paddingHorizontal: spacing[3],
        borderRadius: borderRadius.xl,
      },
      input: {
        fontSize: typography.fontSize.sm,
        ...typography.textStyles.body,
      },
    },
    default: {
      container: {
        height: 48,
        paddingHorizontal: spacing[4],
        borderRadius: borderRadius['2xl'],
      },
      input: {
        fontSize: typography.fontSize.base,
        ...typography.textStyles.body,
      },
    },
    lg: {
      container: {
        height: 56,
        paddingHorizontal: spacing[5],
        borderRadius: borderRadius['2xl'],
      },
      input: {
        fontSize: typography.fontSize.base,
        ...typography.textStyles.body,
      },
    },
  };

  return sizeMap[size];
}

// ============ STATIC STYLES ============

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.textStyles.label,
    marginBottom: spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 0, // Remove default padding to control height exactly
    fontFamily: typography.fontFamily.regular,
  },
  inputWithLeftIcon: {
    marginLeft: spacing[2],
  },
  inputWithRightIcon: {
    marginRight: spacing[2],
  },
  iconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    ...typography.textStyles.caption,
    marginTop: spacing[1.5],
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

// Display name for debugging
Input.displayName = 'Input';
