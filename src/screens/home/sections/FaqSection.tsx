import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { PillChip, SectionHeader, SurfaceCard } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';

interface FaqSectionProps {
  items: readonly { icon: string; question: string }[];
  onSelect: (question: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ items, onSelect }) => {
  const { color, space, makeStyles } = useThemeStyles();
  const styles = makeStyles(() => ({
    stack: {
      gap: space('md'),
      marginTop: space('md'),
    },
  }));

  return (
    <SurfaceCard>
      <SectionHeader title="Perguntas frequentes" subtitle="Clique para conversar sobre cada tópico" />
      <View style={styles.stack}>
        {items.map((faq) => (
          <PillChip
            key={faq.icon}
            label={faq.question}
            leadingIcon={<Icon name={faq.icon} size={18} color={color('primary')} />}
            onPress={() => onSelect(faq.question)}
            accessibilityHint={`Conversar sobre ${faq.question}`}
          />
        ))}
      </View>
    </SurfaceCard>
  );
};

FaqSection.displayName = 'FaqSection';

