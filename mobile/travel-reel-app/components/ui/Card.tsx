/**
 * Card Component
 * Migrated from travel-reel-ui-enhanced
 *
 * A container component with header, title, description, content, and footer sub-components.
 * Uses compound component pattern for flexible composition.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Card.Header>
 *     <Card.Title>Paris Adventure</Card.Title>
 *     <Card.Description>5 days, 12 stops</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     <Text>Explore the city of lights...</Text>
 *   </Card.Content>
 *   <Card.Footer>
 *     <Button size="sm">View Details</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TextProps,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  semanticBorderRadius,
} from '@/constants';

// ============ TYPES ============

/**
 * Visual variants for the card
 * - default: Standard card with border and subtle shadow
 * - elevated: Prominent shadow, no border
 * - outline: Bordered with no shadow
 */
export type CardVariant = 'default' | 'elevated' | 'outline';

/**
 * Card component props
 */
export interface CardProps extends ViewProps {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Additional container styles */
  style?: ViewStyle;
}

/**
 * CardHeader component props
 */
export interface CardHeaderProps extends ViewProps {
  style?: ViewStyle;
}

/**
 * CardTitle component props
 */
export interface CardTitleProps extends TextProps {
  style?: TextStyle;
}

/**
 * CardDescription component props
 */
export interface CardDescriptionProps extends TextProps {
  style?: TextStyle;
}

/**
 * CardContent component props
 */
export interface CardContentProps extends ViewProps {
  style?: ViewStyle;
}

/**
 * CardFooter component props
 */
export interface CardFooterProps extends ViewProps {
  style?: ViewStyle;
}

// ============ SUB-COMPONENTS ============

/**
 * CardHeader - Container for title and description
 */
const CardHeader: React.FC<CardHeaderProps> = ({ style, ...props }) => {
  return (
    <View style={[styles.header, style]} accessibilityRole="header" {...props} />
  );
};
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Main heading for the card
 */
const CardTitle: React.FC<CardTitleProps> = ({ style, ...props }) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const c = colors[systemColorScheme];

  return (
    <Text
      style={[styles.title, { color: c.foreground }, style]}
      accessibilityRole="header"
      {...props}
    />
  );
};
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - Subtitle or supporting text for the card
 */
const CardDescription: React.FC<CardDescriptionProps> = ({ style, ...props }) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const c = colors[systemColorScheme];

  return (
    <Text
      style={[styles.description, { color: c.mutedForeground }, style]}
      {...props}
    />
  );
};
CardDescription.displayName = 'CardDescription';

/**
 * CardContent - Main content area of the card
 */
const CardContent: React.FC<CardContentProps> = ({ style, ...props }) => {
  return <View style={[styles.content, style]} {...props} />;
};
CardContent.displayName = 'CardContent';

/**
 * CardFooter - Footer area for actions or metadata
 */
const CardFooter: React.FC<CardFooterProps> = ({ style, ...props }) => {
  return <View style={[styles.footer, style]} {...props} />;
};
CardFooter.displayName = 'CardFooter';

// ============ MAIN COMPONENT ============

/**
 * Card - Container component with flexible sub-components
 */
const CardComponent: React.FC<CardProps> = ({
  variant = 'default',
  style,
  ...props
}) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const c = colors[systemColorScheme];

  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, systemColorScheme);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: c.card, borderColor: c.border },
        variantStyles,
        style,
      ]}
      {...props}
    />
  );
};
CardComponent.displayName = 'Card';

// ============ VARIANT STYLES ============

function getVariantStyles(variant: CardVariant, colorScheme: 'light' | 'dark'): ViewStyle {
  const c = colors[colorScheme];

  const variantMap: Record<CardVariant, ViewStyle> = {
    default: {
      borderWidth: 1,
      ...shadows.card,
    },
    elevated: {
      borderWidth: 0,
      ...shadows.float,
    },
    outline: {
      borderWidth: 2,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  };

  return variantMap[variant];
}

// ============ STATIC STYLES ============

const styles = StyleSheet.create({
  base: {
    borderRadius: semanticBorderRadius.card, // 24px (rounded-3xl) - generous, modern radius
    overflow: 'hidden',
  },
  header: {
    paddingTop: spacing[6],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[1.5],
  },
  title: {
    ...typography.textStyles.h3,
    lineHeight: typography.lineHeight.tight,
  },
  description: {
    ...typography.textStyles.bodySmall,
    lineHeight: typography.lineHeight.relaxed,
  },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
});

// ============ COMPOUND COMPONENT EXPORT ============

/**
 * Card component with attached sub-components
 * Use Card.Header, Card.Title, Card.Description, Card.Content, Card.Footer
 */
export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Export individual components for flexibility
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
