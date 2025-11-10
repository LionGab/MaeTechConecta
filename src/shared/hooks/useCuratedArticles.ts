/**
 * useCuratedArticles Hook
 *
 * Hook para buscar artigos curados do MãeValente
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { CuratedArticle } from '../types/database.types';

export function useCuratedArticles(category?: string) {
  const [articles, setArticles] = useState<CuratedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const ARTICLES_PER_PAGE = 20;

  // Buscar artigos
  const fetchArticles = useCallback(
    async (pageNum: number = 0, refresh: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('curated_articles')
          .select('*')
          .order('curated_at', { ascending: false })
          .range(pageNum * ARTICLES_PER_PAGE, (pageNum + 1) * ARTICLES_PER_PAGE - 1);

        // Filtrar por categoria se fornecida
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (refresh) {
          setArticles(data || []);
        } else {
          setArticles((prev) => [...prev, ...(data || [])]);
        }

        // Verificar se tem mais artigos
        setHasMore((data?.length || 0) === ARTICLES_PER_PAGE);
        setPage(pageNum);
      } catch (err: any) {
        console.error('Erro ao buscar artigos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // Carregar mais artigos (infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchArticles(page + 1, false);
    }
  }, [loading, hasMore, page, fetchArticles]);

  // Refresh (pull-to-refresh)
  const refresh = useCallback(() => {
    fetchArticles(0, true);
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles(0, true);
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

