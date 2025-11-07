import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { theme, makeStyles } from "@/theme/nathTheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PrimaryButtonProps extends Omit<TouchableOpacityProps, "style"> {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = "primary",
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const styles = useStyles();

  const isDisabled = disabled || loading;

  const getContainerStyle = () => {
    const baseStyle = [styles.button];

    if (variant === "primary") {
      baseStyle.push(styles.primaryButton);
    } else if (variant === "secondary") {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === "ghost") {
      baseStyle.push(styles.ghostButton);
    }

    if (isDisabled) {
      baseStyle.push(styles.disabledButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];

    if (variant === "primary") {
      baseStyle.push(styles.primaryButtonText);
    } else if (variant === "secondary") {
      baseStyle.push(styles.secondaryButtonText);
    } else if (variant === "ghost") {
      baseStyle.push(styles.ghostButtonText);
    }

    if (isDisabled) {
      baseStyle.push(styles.disabledButtonText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : theme.colors.primary} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={20}
              color={variant === "primary" ? "#FFFFFF" : theme.colors.primary}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const useStyles = () =>
  makeStyles((t) => ({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.md,
      borderRadius: t.radius.md,
      gap: t.spacing.sm,
    },
    primaryButton: {
      backgroundColor: t.colors.primary,
      ...t.shadow.card,
    },
    secondaryButton: {
      backgroundColor: t.colors.primarySoft,
      ...t.shadow.card,
    },
    ghostButton: {
      backgroundColor: "transparent",
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    primaryButtonText: {
      color: "#FFFFFF",
    },
    secondaryButtonText: {
      color: t.colors.primary,
    },
    ghostButtonText: {
      color: t.colors.primary,
    },
    disabledButtonText: {
      color: t.colors.textMuted,
    },
    icon: {
      marginRight: t.spacing.xs,
    },
  }));
