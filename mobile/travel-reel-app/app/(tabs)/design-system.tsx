/**
 * Design System Test Screen
 * Test screen to verify fonts, colors, design tokens, and components
 * Phase 1: Design tokens ✅
 * Phase 2: Base components (Button, Card, Input) 🏗️
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  gradients,
} from '../../constants/index';
import { Button, Card, Input } from '../../components';

export default function DesignSystemTest() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🎨 Design System Test</Text>
      <Text style={styles.subtitle}>Verify fonts and tokens are working</Text>

      {/* Font Weights Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Weights (Plus Jakarta Sans)</Text>
        <Text style={[styles.fontTest, { fontFamily: typography.fontFamily.regular }]}>
          Regular (400) - The quick brown fox
        </Text>
        <Text style={[styles.fontTest, { fontFamily: typography.fontFamily.medium }]}>
          Medium (500) - The quick brown fox
        </Text>
        <Text style={[styles.fontTest, { fontFamily: typography.fontFamily.semiBold }]}>
          SemiBold (600) - The quick brown fox
        </Text>
        <Text style={[styles.fontTest, { fontFamily: typography.fontFamily.bold }]}>
          Bold (700) - The quick brown fox
        </Text>
        <Text style={[styles.fontTest, { fontFamily: typography.fontFamily.extraBold }]}>
          ExtraBold (800) - The quick brown fox
        </Text>
      </View>

      {/* Text Styles Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Styles</Text>
        <Text style={typography.textStyles.h1}>Heading 1</Text>
        <Text style={typography.textStyles.h2}>Heading 2</Text>
        <Text style={typography.textStyles.h3}>Heading 3</Text>
        <Text style={typography.textStyles.body}>Body text - regular paragraph</Text>
        <Text style={typography.textStyles.label}>Label text</Text>
        <Text style={typography.textStyles.caption}>Caption text - small</Text>
      </View>

      {/* Colors Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors (Light Mode)</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.light.primary }]} />
          <Text style={styles.colorLabel}>Primary (Sunset Coral)</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.light.secondary }]} />
          <Text style={styles.colorLabel}>Secondary (Ocean Deep)</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.light.accent }]} />
          <Text style={styles.colorLabel}>Accent (Golden)</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.light.background }]} />
          <Text style={styles.colorLabel}>Background</Text>
        </View>
      </View>

      {/* Gradients Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gradients</Text>
        <LinearGradient
          colors={gradients.sunset.colors}
          start={gradients.sunset.start}
          end={gradients.sunset.end}
          style={styles.gradientBox}
        >
          <Text style={styles.gradientText}>Sunset Gradient</Text>
        </LinearGradient>
        <LinearGradient
          colors={gradients.ocean.colors}
          start={gradients.ocean.start}
          end={gradients.ocean.end}
          style={styles.gradientBox}
        >
          <Text style={styles.gradientText}>Ocean Gradient</Text>
        </LinearGradient>
      </View>

      {/* Shadows Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shadows</Text>
        <View style={[styles.shadowBox, shadows.soft]}>
          <Text>Soft Shadow</Text>
        </View>
        <View style={[styles.shadowBox, shadows.card]}>
          <Text>Card Shadow</Text>
        </View>
        <View style={[styles.shadowBox, shadows.float]}>
          <Text>Float Shadow</Text>
        </View>
      </View>

      {/* Border Radius Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Border Radius</Text>
        <View style={[styles.radiusBox, { borderRadius: borderRadius.sm }]}>
          <Text>Small (12px)</Text>
        </View>
        <View style={[styles.radiusBox, { borderRadius: borderRadius.lg }]}>
          <Text>Large (16px)</Text>
        </View>
        <View style={[styles.radiusBox, { borderRadius: borderRadius['2xl'] }]}>
          <Text>2XL (24px)</Text>
        </View>
        <View style={[styles.radiusBox, { borderRadius: borderRadius.full }]}>
          <Text>Full (Circle)</Text>
        </View>
      </View>

      {/* Spacing Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spacing</Text>
        <View style={{ padding: spacing[2], backgroundColor: '#f0f0f0', marginBottom: 8 }}>
          <Text>Padding: spacing[2] = 8px</Text>
        </View>
        <View style={{ padding: spacing[4], backgroundColor: '#f0f0f0', marginBottom: 8 }}>
          <Text>Padding: spacing[4] = 16px</Text>
        </View>
        <View style={{ padding: spacing[6], backgroundColor: '#f0f0f0', marginBottom: 8 }}>
          <Text>Padding: spacing[6] = 24px</Text>
        </View>
      </View>

      {/* Category Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Colors</Text>
        <View style={[styles.badge, { backgroundColor: colors.categories.cultura.background }]}>
          <Text style={[styles.badgeText, { color: colors.categories.cultura.text }]}>
            Cultura
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.categories.gastronomia.background }]}>
          <Text style={[styles.badgeText, { color: colors.categories.gastronomia.text }]}>
            Gastronomía
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.categories.naturaleza.background }]}>
          <Text style={[styles.badgeText, { color: colors.categories.naturaleza.text }]}>
            Naturaleza
          </Text>
        </View>
      </View>

      {/* ========== PHASE 2: BUTTON COMPONENT ========== */}
      <Text style={[styles.title, { marginTop: spacing[8] }]}>
        🔘 Phase 2: Button Component
      </Text>
      <Text style={styles.subtitle}>Test all button variants, sizes, and states</Text>

      {/* Button Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Variants</Text>

        <Button
          variant="default"
          onPress={() => Alert.alert('Pressed!', 'Default button')}
          style={{ marginBottom: spacing[3] }}
        >
          Default Button
        </Button>

        <Button
          variant="sunset"
          onPress={() => Alert.alert('Pressed!', 'Sunset gradient button')}
          style={{ marginBottom: spacing[3] }}
        >
          Sunset Gradient
        </Button>

        <Button
          variant="ocean"
          onPress={() => Alert.alert('Pressed!', 'Ocean gradient button')}
          style={{ marginBottom: spacing[3] }}
        >
          Ocean Gradient
        </Button>

        <Button
          variant="secondary"
          onPress={() => Alert.alert('Pressed!', 'Secondary button')}
          style={{ marginBottom: spacing[3] }}
        >
          Secondary
        </Button>

        <Button
          variant="outline"
          onPress={() => Alert.alert('Pressed!', 'Outline button')}
          style={{ marginBottom: spacing[3] }}
        >
          Outline
        </Button>

        <Button
          variant="ghost"
          onPress={() => Alert.alert('Pressed!', 'Ghost button')}
          style={{ marginBottom: spacing[3] }}
        >
          Ghost
        </Button>

        <Button
          variant="glass"
          onPress={() => Alert.alert('Pressed!', 'Glass button')}
          style={{ marginBottom: spacing[3] }}
        >
          Glass Effect
        </Button>

        <Button
          variant="destructive"
          onPress={() => Alert.alert('Pressed!', 'Destructive button')}
          style={{ marginBottom: spacing[3] }}
        >
          Destructive
        </Button>

        <Button
          variant="link"
          onPress={() => Alert.alert('Pressed!', 'Link button')}
        >
          Link Button
        </Button>
      </View>

      {/* Button Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Sizes</Text>

        <Button
          variant="sunset"
          size="sm"
          onPress={() => Alert.alert('Small')}
          style={{ marginBottom: spacing[3] }}
        >
          Small
        </Button>

        <Button
          variant="sunset"
          size="default"
          onPress={() => Alert.alert('Default')}
          style={{ marginBottom: spacing[3] }}
        >
          Default
        </Button>

        <Button
          variant="sunset"
          size="lg"
          onPress={() => Alert.alert('Large')}
          style={{ marginBottom: spacing[3] }}
        >
          Large
        </Button>

        <Button
          variant="sunset"
          size="xl"
          onPress={() => Alert.alert('Extra Large')}
        >
          Extra Large
        </Button>
      </View>

      {/* Button with Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons with Icons</Text>

        <Button
          variant="default"
          leftIcon={<Text style={{ fontSize: 18 }}>🚀</Text>}
          onPress={() => Alert.alert('With left icon')}
          style={{ marginBottom: spacing[3] }}
        >
          Launch Trip
        </Button>

        <Button
          variant="secondary"
          rightIcon={<Text style={{ fontSize: 18 }}>→</Text>}
          onPress={() => Alert.alert('With right icon')}
          style={{ marginBottom: spacing[3] }}
        >
          Continue
        </Button>

        <Button
          variant="sunset"
          leftIcon={<Text style={{ fontSize: 18 }}>❤️</Text>}
          rightIcon={<Text style={{ fontSize: 18 }}>✨</Text>}
          onPress={() => Alert.alert('With both icons')}
        >
          Save Favorite
        </Button>
      </View>

      {/* Button States */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button States</Text>

        <Button
          variant="default"
          loading
          style={{ marginBottom: spacing[3] }}
        >
          Loading...
        </Button>

        <Button
          variant="sunset"
          disabled
          style={{ marginBottom: spacing[3] }}
        >
          Disabled
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onPress={() => Alert.alert('Full width')}
        >
          Full Width Button
        </Button>
      </View>

      {/* Special Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Buttons</Text>

        <View style={{ flexDirection: 'row', gap: spacing[4], marginBottom: spacing[4] }}>
          <Button
            variant="default"
            size="icon"
            onPress={() => Alert.alert('Icon button')}
          >
            <Text style={{ fontSize: 20 }}>❤️</Text>
          </Button>

          <Button
            variant="fab"
            size="fab"
            onPress={() => Alert.alert('FAB pressed')}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
          </Button>
        </View>

        <Text style={styles.colorLabel}>
          Icon button (48x48) and FAB (56x56 circular)
        </Text>
      </View>

      {/* ========== CARD COMPONENT ========== */}
      <Text style={[styles.title, { marginTop: spacing[8] }]}>
        🃏 Card Component
      </Text>
      <Text style={styles.subtitle}>Container component with sub-components</Text>

      {/* Card Variants */}
      <View style={{ gap: spacing[4] }}>
        <Card variant="default">
          <Card.Header>
            <Card.Title>Default Card</Card.Title>
            <Card.Description>With border and subtle shadow</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text style={[typography.textStyles.body, { color: colors.light.foreground }]}>
              This is the default card variant with a border and soft shadow. Perfect for most use cases.
            </Text>
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" size="sm" onPress={() => Alert.alert('Action')}>
              Action
            </Button>
          </Card.Footer>
        </Card>

        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Elevated Card</Card.Title>
            <Card.Description>Prominent shadow, no border</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text style={[typography.textStyles.body, { color: colors.light.foreground }]}>
              This card appears to float above the surface with a more prominent shadow.
            </Text>
          </Card.Content>
          <Card.Footer>
            <Button variant="sunset" size="sm" onPress={() => Alert.alert('Learn More')}>
              Learn More
            </Button>
          </Card.Footer>
        </Card>

        <Card variant="outline">
          <Card.Header>
            <Card.Title>Outline Card</Card.Title>
            <Card.Description>Bordered with no shadow</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text style={[typography.textStyles.body, { color: colors.light.foreground }]}>
              A flat card with a prominent border, no shadow. Great for grouped content.
            </Text>
          </Card.Content>
        </Card>

        {/* Card with complex content */}
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Paris Adventure 🗼</Card.Title>
            <Card.Description>5 days • 12 stops • May 2024</Card.Description>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
                <View style={[styles.badge, { backgroundColor: colors.categories.cultura.background }]}>
                  <Text style={[styles.badgeText, { color: colors.categories.cultura.text }]}>
                    Cultura
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.categories.gastronomia.background }]}>
                  <Text style={[styles.badgeText, { color: colors.categories.gastronomia.text }]}>
                    Gastronomía
                  </Text>
                </View>
              </View>
              <Text style={[typography.textStyles.bodySmall, { color: colors.light.mutedForeground }]}>
                Explore the City of Light with visits to the Eiffel Tower, Louvre Museum, and authentic French bistros.
              </Text>
            </View>
          </Card.Content>
          <Card.Footer>
            <Button variant="sunset" size="sm" fullWidth onPress={() => Alert.alert('View Trip')}>
              View Full Itinerary
            </Button>
          </Card.Footer>
        </Card>

        {/* Minimal card without header/footer */}
        <Card>
          <Card.Content>
            <Text style={[typography.textStyles.body, { color: colors.light.foreground }]}>
              Cards can be used with any combination of sub-components. This one only has content!
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* ========== INPUT COMPONENT ========== */}
      <Text style={[styles.title, { marginTop: spacing[8] }]}>
        📝 Input Component
      </Text>
      <Text style={styles.subtitle}>Text input with labels, errors, and animations</Text>

      <View style={{ gap: spacing[4] }}>
        {/* Basic Inputs */}
        <Card variant="default">
          <Card.Header>
            <Card.Title>Basic Inputs</Card.Title>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[4] }}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
              />

              <Input
                label="Email"
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
          </Card.Content>
        </Card>

        {/* Input Sizes */}
        <Card variant="default">
          <Card.Header>
            <Card.Title>Input Sizes</Card.Title>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[3] }}>
              <Input
                size="sm"
                label="Small"
                placeholder="Small input"
              />

              <Input
                size="default"
                label="Default"
                placeholder="Default input"
              />

              <Input
                size="lg"
                label="Large"
                placeholder="Large input"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Input with Icons */}
        <Card variant="default">
          <Card.Header>
            <Card.Title>Inputs with Icons</Card.Title>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[4] }}>
              <Input
                label="Search"
                placeholder="Search destinations..."
                leftIcon={<Text style={{ fontSize: 18 }}>🔍</Text>}
              />

              <Input
                label="Amount"
                placeholder="0.00"
                keyboardType="decimal-pad"
                leftIcon={<Text style={{ fontSize: 18 }}>💰</Text>}
              />

              <Input
                label="Website"
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
                rightIcon={<Text style={{ fontSize: 18 }}>🔗</Text>}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Input States */}
        <Card variant="default">
          <Card.Header>
            <Card.Title>Input States</Card.Title>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[4] }}>
              <Input
                label="With Helper Text"
                placeholder="Enter your username"
                helperText="Choose a unique username (3-20 characters)"
              />

              <Input
                label="With Error"
                placeholder="Enter your email"
                error="Please enter a valid email address"
                defaultValue="invalid-email"
              />

              <Input
                label="Disabled Input"
                placeholder="This input is disabled"
                editable={false}
                defaultValue="Disabled value"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Keyboard Types */}
        <Card variant="default">
          <Card.Header>
            <Card.Title>Keyboard Types</Card.Title>
          </Card.Header>
          <Card.Content>
            <View style={{ gap: spacing[4] }}>
              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
              />

              <Input
                label="Numeric"
                placeholder="Enter numbers only"
                keyboardType="number-pad"
              />

              <Input
                label="Decimal"
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.footer}>
        ✅ Phase 1: Design tokens working!{'\n'}
        ✅ Phase 2: Button, Card & Input components complete!{'\n'}
        🎉 Base components ready for Phase 3 (Screen migration)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    padding: spacing[6],
    paddingBottom: spacing[12],
  },
  title: {
    ...typography.textStyles.h1,
    color: colors.light.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.textStyles.body,
    color: colors.light.mutedForeground,
    marginBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[8],
    padding: spacing[4],
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.card,
  },
  sectionTitle: {
    ...typography.textStyles.h3,
    color: colors.light.secondary,
    marginBottom: spacing[4],
  },
  fontTest: {
    fontSize: typography.fontSize.base,
    marginBottom: spacing[2],
    color: colors.light.foreground,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    marginRight: spacing[3],
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  colorLabel: {
    ...typography.textStyles.body,
    color: colors.light.foreground,
  },
  gradientBox: {
    padding: spacing[6],
    borderRadius: borderRadius['2xl'],
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  gradientText: {
    ...typography.textStyles.h4,
    color: colors.white,
  },
  shadowBox: {
    padding: spacing[4],
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  radiusBox: {
    padding: spacing[4],
    backgroundColor: colors.light.muted,
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginBottom: spacing[2],
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.textStyles.badge,
    fontSize: typography.fontSize.sm,
  },
  footer: {
    ...typography.textStyles.bodySmall,
    color: colors.light.mutedForeground,
    textAlign: 'center',
    marginTop: spacing[8],
    fontStyle: 'italic',
  },
});
