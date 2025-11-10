/**
 * usePosts Hook
 *
 * Hook para buscar posts do MundoNath
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { Post } from '../types/database.types';

export function usePosts(category?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const POSTS_PER_PAGE = 10;

  // Buscar posts
  const fetchPosts = useCallback(
    async (pageNum: number = 0, refresh: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('posts')
          .select('*')
          .order('published_at', { ascending: false })
          .range(pageNum * POSTS_PER_PAGE, (pageNum + 1) * POSTS_PER_PAGE - 1);

        // Filtrar por categoria se fornecida
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (refresh) {
          setPosts(data || []);
        } else {
          setPosts((prev) => [...prev, ...(data || [])]);
        }

        // Verificar se tem mais posts
        setHasMore((data?.length || 0) === POSTS_PER_PAGE);
        setPage(pageNum);
      } catch (err: any) {
        console.error('Erro ao buscar posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // Carregar mais posts (infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false);
    }
  }, [loading, hasMore, page, fetchPosts]);

  // Refresh (pull-to-refresh)
  const refresh = useCallback(() => {
    fetchPosts(0, true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(0, true);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

