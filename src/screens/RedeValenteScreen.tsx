/**
 * Rede Valente Screen - Comunidade de Mães
 *
 * Tela de comunidade onde mães compartilham experiências,
 * apoiam-se mutuamente e encontram grupos de suporte.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '@/theme/nathTheme';
import { useOnboardingContext } from '@/contexts/OnboardingContext';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  icon: string;
  color: string;
}

const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: '1',
    name: 'Primeiras Mães',
    description: 'Para mães de primeira viagem compartilharem experiências',
    members: 1234,
    category: 'Experiência',
    icon: 'baby-face',
    color: theme.colors.sage,
  },
  {
    id: '2',
    name: 'Volta ao Trabalho',
    description: 'Conciliando carreira e maternidade',
    members: 892,
    category: 'Carreira',
    icon: 'briefcase',
    color: theme.colors.terracotta,
  },
  {
    id: '3',
    name: 'Amamentação sem Drama',
    description: 'Dicas, apoio e desabafos sobre amamentação',
    members: 2103,
    category: 'Saúde',
    icon: 'mother-heart',
    color: theme.colors.lavender,
  },
  {
    id: '4',
    name: 'Sono Tranquilo',
    description: 'Estratégias para noites mais tranquilas',
    members: 1567,
    category: 'Rotina',
    icon: 'sleep',
    color: theme.colors.sage,
  },
  {
    id: '5',
    name: 'Mães Solo',
    description: 'Rede de apoio para mães que criam sozinhas',
    members: 743,
    category: 'Suporte',
    icon: 'account-heart',
    color: theme.colors.terracotta,
  },
  {
    id: '6',
    name: 'Gestantes Conectadas',
    description: 'Futuras mães compartilhando a jornada',
    members: 1891,
    category: 'Gestação',
    icon: 'baby-carriage',
    color: theme.colors.lavender,
  },
];

interface RecentPost {
  id: string;
  author: string;
  authorAvatar: string;
  group: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const RECENT_POSTS: RecentPost[] = [
  {
    id: '1',
    author: 'Ana Paula',
    authorAvatar: '',
    group: 'Primeiras Mães',
    content: 'Hoje minha pequena dormiu a noite toda pela primeira vez! 🎉',
    timestamp: '2h atrás',
    likes: 45,
    comments: 12,
  },
  {
    id: '2',
    author: 'Juliana Costa',
    authorAvatar: '',
    group: 'Volta ao Trabalho',
    content: 'Alguém tem dicas de como lidar com a culpa de voltar a trabalhar?',
    timestamp: '4h atrás',
    likes: 23,
    comments: 18,
  },
  {
    id: '3',
    author: 'Mariana Silva',
    authorAvatar: '',
    group: 'Amamentação sem Drama',
    content: 'Completei 6 meses de amamentação exclusiva! Obrigada pelo apoio, mães 💕',
    timestamp: '5h atrás',
    likes: 89,
    comments: 24,
  },
];

export default function RedeValenteScreen() {
  const { isDark } = useTheme();
  const { formData } = useOnboardingContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Experiência', 'Carreira', 'Saúde', 'Rotina', 'Suporte', 'Gestação'];

  const filteredGroups =
    selectedCategory === 'Todos'
      ? COMMUNITY_GROUPS
      : COMMUNITY_GROUPS.filter((group) => group.category === selectedCategory);

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Rede Valente</Text>
            <Text style={styles.headerSubtitle}>
              Você não está sozinha, {formData.name?.split(' ')[0] || 'mãe valente'}! 💪
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color={theme.colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Community Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grupos da Comunidade</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {filteredGroups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
                <Icon name={group.icon} size={28} color={group.color} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
                <View style={styles.groupMeta}>
                  <Icon name="account-group" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.groupMembers}>{group.members.toLocaleString('pt-BR')} membros</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conversas Recentes</Text>
          </View>

          {RECENT_POSTS.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postAuthorAvatar}>
                  <Icon name="account" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.postAuthorInfo}>
                  <Text style={styles.postAuthorName}>{post.author}</Text>
                  <Text style={styles.postGroup}>
                    {post.group} • {post.timestamp}
                  </Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="heart-outline" size={20} color={theme.colors.textMuted} />
                  <Text style={styles.postActionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="comment-outline" size={20} color={theme.colors.textMuted} />
                  <Text style={styles.postActionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="share-outline" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floating Action Button Placeholder */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    notificationButton: {
      position: 'relative',
      padding: theme.spacing.sm,
    },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
    categoriesContainer: {
      marginVertical: theme.spacing.md,
    },
    categoriesContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    seeAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    groupCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    groupIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.radius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    groupDescription: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    groupMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    groupMembers: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    postCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    postAuthorAvatar: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    postAuthorInfo: {
      flex: 1,
    },
    postAuthorName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    postGroup: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    postContent: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    postActions: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },
    postAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    postActionText: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      right: theme.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
    },
  });
