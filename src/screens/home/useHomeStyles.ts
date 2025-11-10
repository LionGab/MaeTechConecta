import useThemeStyles from '@/shared/hooks/useThemeStyles';

export const useHomeStyles = () => {
  const helpers = useThemeStyles();
  const { makeStyles } = helpers;

  const styles = makeStyles(({ color, space }) => ({
    safeArea: { flex: 1, backgroundColor: color('bgPrimary') },
    scrollContainer: {
      paddingBottom: space('3xl'),
      paddingHorizontal: space('lg'),
      gap: space('lg'),
    },
    emergencyButton: {
      backgroundColor: color('danger'),
    },
  }));

  return { styles, ...helpers };
};

