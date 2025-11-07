import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { theme } from "@/theme/nathTheme";

interface SurfaceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "gradient";
  gradientColors?: [string, string];
}

export const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  style,
  variant = "default",
  gradientColors,
}) => {
  const containerStyle = [
    styles.card,
    variant === "gradient" && gradientColors && {
      background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
    },
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
});
