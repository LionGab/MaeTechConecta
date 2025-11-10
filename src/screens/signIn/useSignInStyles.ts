import { useMemo } from 'react';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

export const useSignInStyles = () => {
  const helpers = useThemeStyles();
  const { makeStyles, color } = helpers;

  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space, radius, text }) => ({
        safeArea: { flex: 1, backgroundColor: themeColor('bgPrimary') },
        keyboardWrapper: { flex: 1 },
        content: {
          flexGrow: 1,
          paddingHorizontal: space('xl'),
          paddingVertical: space('2xl'),
          paddingBottom: space('3xl'),
          justifyContent: 'center',
          gap: space('xl'),
        },
        header: { gap: space('xs') },
        title: { ...text('headline') },
        subtitle: { ...text('body', { color: themeColor('textSecondary') }) },
        card: { gap: space('lg') },
        fieldGroup: { gap: space('xs') },
        labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        label: { ...text('subtitle') },
        helperLabel: { ...text('bodySmall', { color: themeColor('primary') }) },
        inputWrapper: {
          borderWidth: 1,
          borderColor: themeColor('borderPrimary'),
          borderRadius: radius('xl'),
          backgroundColor: themeColor('surfaceSecondary'),
          paddingHorizontal: space('md'),
          paddingVertical: space('xs'),
          minHeight: space('2xl'),
        },
        inputWrapperFocused: {
          borderColor: themeColor('primary'),
          backgroundColor: themeColor('surfacePrimary'),
        },
        inputWrapperError: { borderColor: themeColor('danger') },
        textInput: { ...text('body'), paddingVertical: space('sm'), flex: 1 },
        feedback: { ...text('bodySmall') },
        feedbackError: { color: themeColor('danger') },
        feedbackSuccess: { color: themeColor('success') },
        feedbackSpacing: { marginTop: space('xs') },
        actions: { gap: space('sm') },
        footer: { alignItems: 'center' },
        footerText: { ...text('bodySmall', { color: themeColor('textSecondary') }), textAlign: 'center' },
      })),
    [makeStyles]
  );

  return {
    styles,
    placeholderColor: color('textSecondary'),
  };
};
