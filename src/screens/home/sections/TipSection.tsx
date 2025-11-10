import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { SurfaceCard } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';

export const TipSection: React.FC = () => {
  const { color, space, text, makeStyles } = useThemeStyles();

  const styles = makeStyles(() => ({
    stack: {
      gap: space('md'),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space('sm'),
    },
    neutral: {
      ...text('bodySmall', { color: color('textSecondary') }),
    },
  }));

  return (
    <SurfaceCard>
      <View style={styles.stack}>
        <View style={styles.row}>
          <Icon name="lightbulb-on-outline" size={20} color={color('accentForeground')} />
          <Text style={text('subtitle')}>Você sabia?</Text>
        </View>
        <Text style={styles.neutral}>
          Durante a gravidez, o descanso também é cuidado. Respeite seu ritmo, celebre suas pausas e lembre-se de
          respirar fundo. 💗
        </Text>
      </View>
    </SurfaceCard>
  );
};

TipSection.displayName = 'TipSection';

