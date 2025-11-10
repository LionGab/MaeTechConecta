import React from 'react';

import { DailyInsightCard } from '@/components/home/DailyInsightCard';
import { SectionHeader, SurfaceCard } from '@/shared/components';

interface InsightSectionProps {
  insight: any;
  loading: boolean;
  onRefresh: () => void;
  onActionPress: () => void;
}

export const InsightSection: React.FC<InsightSectionProps> = ({ insight, loading, onRefresh, onActionPress }) => (
  <SurfaceCard>
    <SectionHeader title="Insight do dia" subtitle="Transforme carinho em ação" />
    <DailyInsightCard insight={insight} loading={loading} onRefresh={onRefresh} onActionPress={onActionPress} />
  </SurfaceCard>
);

InsightSection.displayName = 'InsightSection';

