/**
 * Design System Test Screen
 * Temporary screen to verify fonts, colors, and design tokens are working
 * DELETE THIS FILE after Phase 1 verification
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  gradients,
} from '../../constants/index';

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

      <Text style={styles.footer}>
        ✅ If you can see different font weights and colors above, the design system is working!
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
