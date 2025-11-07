import React from 'react';
import { Text, View } from 'react-native';

import { PlanoDoDia } from '@/components/PlanoDoDia';
import { PillChip, SectionHeader, SurfaceCard } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';

interface PlanSectionProps {
  items: any[];
  rationale?: string | null;
  isLoading: boolean;
  isReplanning: boolean;
  onWhyThisPressed: () => void;
  onItemCtaPressed: (item: any) => void;
  onReplan: () => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({
  items,
  rationale,
  isLoading,
  isReplanning,
  onWhyThisPressed,
  onItemCtaPressed,
  onReplan,
}) => {
  const { text, makeStyles } = useThemeStyles();
  const styles = makeStyles(({ space }) => ({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space('md'),
    },
    content: {
      gap: space('md'),
    },
    neutral: {
      ...text('bodySmall'),
    },
  }));

  return (
    <SurfaceCard>
      <View style={styles.header}>
        <SectionHeader title="Seu plano de hoje" />
        <Text style={styles.neutral}>{items.length} momentos cuidadosos</Text>
      </View>
      <View style={styles.content}>
        <PlanoDoDia
          items={items}
          rationale={rationale}
          onWhyThisPressed={onWhyThisPressed}
          onItemCtaPressed={onItemCtaPressed}
          isLoading={isLoading}
        />
        {isReplanning ? (
          <Text style={styles.neutral}>Criando um novo plano com carinho...</Text>
        ) : (
          <PillChip label="Replanejar hoje" onPress={onReplan} accessibilityLabel="Gerar novo plano para hoje" />
        )}
      </View>
    </SurfaceCard>
  );
};

PlanSection.displayName = 'PlanSection';
