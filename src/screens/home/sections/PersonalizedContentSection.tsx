import React from 'react';
import { View } from 'react-native';

import { PersonalizedContentCard } from '@/components/PersonalizedContentCard';
import { SectionHeader, SurfaceCard } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';
import type { PersonalizedContent } from '@/hooks/usePersonalizedContent';

interface PersonalizedContentSectionProps {
  items: readonly PersonalizedContent[];
  isDark: boolean;
  onTrack: (contentId: string, type: 'view' | 'like' | 'save' | 'share') => Promise<void>;
}

export const PersonalizedContentSection: React.FC<PersonalizedContentSectionProps> = ({ items, isDark, onTrack }) => {
  const { makeStyles } = useThemeStyles();
  const styles = makeStyles(({ space }) => ({
    stack: {
      gap: space('md'),
    },
  }));

  return (
    <SurfaceCard>
      <SectionHeader title="Conteúdos para você" subtitle="Selecionados com base no que você precisa agora" />
      <View style={styles.stack}>
        {items.slice(0, 3).map((item) => (
          <PersonalizedContentCard key={item.id} content={item} onInteraction={onTrack} isDark={isDark} />
        ))}
      </View>
    </SurfaceCard>
  );
};

PersonalizedContentSection.displayName = 'PersonalizedContentSection';

