export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string;
          code: string;
          created_at: string | null;
          description: string;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          points_reward: number | null;
          rarity: string | null;
          requirement_type: string;
          requirement_value: number;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string | null;
          description: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          points_reward?: number | null;
          rarity?: string | null;
          requirement_type: string;
          requirement_value: number;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string | null;
          description?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          points_reward?: number | null;
          rarity?: string | null;
          requirement_type?: string;
          requirement_value?: number;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          created_at: string | null;
          id: string;
          messages: Json;
          model_used: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          messages: Json;
          model_used: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          messages?: Json;
          model_used?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_memory_context: {
        Row: {
          created_at: string | null;
          emotional_trends: Json | null;
          end_date: string;
          id: string;
          key_events: Json | null;
          start_date: string;
          summary: string;
          time_period: string;
          topics: Json | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          emotional_trends?: Json | null;
          end_date: string;
          id?: string;
          key_events?: Json | null;
          start_date: string;
          summary: string;
          time_period: string;
          topics?: Json | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          emotional_trends?: Json | null;
          end_date?: string;
          id?: string;
          key_events?: Json | null;
          start_date?: string;
          summary?: string;
          time_period?: string;
          topics?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      alert_logs: {
        Row: {
          created_at: string | null;
          handled_at: string | null;
          handled_by: string | null;
          id: string;
          message_id: string | null;
          notes: string | null;
          notified_at: string | null;
          risk_flags: Json | null;
          risk_level: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          message_id?: string | null;
          notes?: string | null;
          notified_at?: string | null;
          risk_flags?: Json | null;
          risk_level?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          message_id?: string | null;
          notes?: string | null;
          notified_at?: string | null;
          risk_flags?: Json | null;
          risk_level?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'alert_logs_handled_by_fkey';
            columns: ['handled_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'alert_logs_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'chat_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'alert_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      api_cache: {
        Row: {
          cache_data: Json;
          cache_key: string;
          created_at: string | null;
          endpoint: string;
          expires_at: string;
          id: string;
        };
        Insert: {
          cache_data: Json;
          cache_key: string;
          created_at?: string | null;
          endpoint: string;
          expires_at: string;
          id?: string;
        };
        Update: {
          cache_data?: Json;
          cache_key?: string;
          created_at?: string | null;
          endpoint?: string;
          expires_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      baby_profiles: {
        Row: {
          age_months: number | null;
          allergies: string[] | null;
          birth_date: string;
          birth_height: number | null;
          birth_weight: number | null;
          created_at: string | null;
          current_height: number | null;
          current_weight: number | null;
          feeding_type: string | null;
          gender: string | null;
          id: string;
          is_active: boolean | null;
          medical_notes: string | null;
          milestones: Json | null;
          name: string;
          photo_url: string | null;
          sleep_schedule: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          age_months?: number | null;
          allergies?: string[] | null;
          birth_date: string;
          birth_height?: number | null;
          birth_weight?: number | null;
          created_at?: string | null;
          current_height?: number | null;
          current_weight?: number | null;
          feeding_type?: string | null;
          gender?: string | null;
          id?: string;
          is_active?: boolean | null;
          medical_notes?: string | null;
          milestones?: Json | null;
          name: string;
          photo_url?: string | null;
          sleep_schedule?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          age_months?: number | null;
          allergies?: string[] | null;
          birth_date?: string;
          birth_height?: number | null;
          birth_weight?: number | null;
          created_at?: string | null;
          current_height?: number | null;
          current_weight?: number | null;
          feeding_type?: string | null;
          gender?: string | null;
          id?: string;
          is_active?: boolean | null;
          medical_notes?: string | null;
          milestones?: Json | null;
          name?: string;
          photo_url?: string | null;
          sleep_schedule?: Json | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          context_data: Json | null;
          created_at: string | null;
          id: string;
          message: string;
          response: string;
          user_id: string | null;
        };
        Insert: {
          context_data?: Json | null;
          created_at?: string | null;
          id?: string;
          message: string;
          response: string;
          user_id?: string | null;
        };
        Update: {
          context_data?: Json | null;
          created_at?: string | null;
          id?: string;
          message?: string;
          response?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      community_posts: {
        Row: {
          category: string | null;
          comments_count: number | null;
          content: string;
          created_at: string | null;
          id: string;
          likes_count: number | null;
          moderation_notes: string | null;
          moderation_status: string | null;
          summary: string | null;
          tags: string[] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          comments_count?: number | null;
          content: string;
          created_at?: string | null;
          id?: string;
          likes_count?: number | null;
          moderation_notes?: string | null;
          moderation_status?: string | null;
          summary?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category?: string | null;
          comments_count?: number | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          likes_count?: number | null;
          moderation_notes?: string | null;
          moderation_status?: string | null;
          summary?: string | null;
          tags?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      conversation_memory: {
        Row: {
          created_at: string | null;
          embedding: string | null;
          id: string;
          key_points: string[] | null;
          last_30_messages: Json | null;
          sentiment: string | null;
          summary: string | null;
          topics: string[] | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          key_points?: string[] | null;
          last_30_messages?: Json | null;
          sentiment?: string | null;
          summary?: string | null;
          topics?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          key_points?: string[] | null;
          last_30_messages?: Json | null;
          sentiment?: string | null;
          summary?: string | null;
          topics?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'conversation_memory_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          embedding: string | null;
          id: string;
          message: string;
          response: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          embedding?: string | null;
          id?: string;
          message: string;
          response: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          embedding?: string | null;
          id?: string;
          message?: string;
          response?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_activities: {
        Row: {
          activity_date: string;
          activity_type: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          points_earned: number | null;
          user_id: string;
        };
        Insert: {
          activity_date: string;
          activity_type: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          points_earned?: number | null;
          user_id: string;
        };
        Update: {
          activity_date?: string;
          activity_type?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          points_earned?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_plans: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          priorities: string[] | null;
          recipe: string | null;
          tip: string | null;
          tip_video_url: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          priorities?: string[] | null;
          recipe?: string | null;
          tip?: string | null;
          tip_video_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          priorities?: string[] | null;
          recipe?: string | null;
          tip?: string | null;
          tip_video_url?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_plans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      diary_entries: {
        Row: {
          audio_transcript: string | null;
          audio_url: string | null;
          content: string;
          created_at: string | null;
          id: string;
          mood: string | null;
          sentiment_analysis: Json | null;
          summary: string | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          audio_transcript?: string | null;
          audio_url?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          mood?: string | null;
          sentiment_analysis?: Json | null;
          summary?: string | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          audio_transcript?: string | null;
          audio_url?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          mood?: string | null;
          sentiment_analysis?: Json | null;
          summary?: string | null;
          tags?: string[] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      health_alerts: {
        Row: {
          acknowledged: boolean | null;
          acknowledged_at: string | null;
          alert_type: string;
          created_at: string | null;
          data: Json;
          id: string;
          severity: string;
          user_id: string;
        };
        Insert: {
          acknowledged?: boolean | null;
          acknowledged_at?: string | null;
          alert_type: string;
          created_at?: string | null;
          data: Json;
          id?: string;
          severity: string;
          user_id: string;
        };
        Update: {
          acknowledged?: boolean | null;
          acknowledged_at?: string | null;
          alert_type?: string;
          created_at?: string | null;
          data?: Json;
          id?: string;
          severity?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      memory_embeddings: {
        Row: {
          content_id: string | null;
          content_text: string;
          content_type: string;
          created_at: string | null;
          embedding: string | null;
          id: string;
          metadata: Json | null;
          user_id: string;
        };
        Insert: {
          content_id?: string | null;
          content_text: string;
          content_type: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
          user_id: string;
        };
        Update: {
          content_id?: string | null;
          content_text?: string;
          content_type?: string;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      moderation_queue: {
        Row: {
          action: string | null;
          category: string | null;
          created_at: string | null;
          id: string;
          message: string;
          moderator_notes: string | null;
          reviewed: boolean | null;
          severity: number | null;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          category?: string | null;
          created_at?: string | null;
          id?: string;
          message: string;
          moderator_notes?: string | null;
          reviewed?: boolean | null;
          severity?: number | null;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          category?: string | null;
          created_at?: string | null;
          id?: string;
          message?: string;
          moderator_notes?: string | null;
          reviewed?: boolean | null;
          severity?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'moderation_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      onboarding_responses: {
        Row: {
          baby_age_months: number | null;
          created_at: string | null;
          emotional_state: string;
          id: string;
          main_challenges: string[];
          self_care_frequency: string;
          sleep_quality: string;
          specific_needs: string[];
          user_id: string;
        };
        Insert: {
          baby_age_months?: number | null;
          created_at?: string | null;
          emotional_state: string;
          id?: string;
          main_challenges: string[];
          self_care_frequency: string;
          sleep_quality: string;
          specific_needs: string[];
          user_id: string;
        };
        Update: {
          baby_age_months?: number | null;
          created_at?: string | null;
          emotional_state?: string;
          id?: string;
          main_challenges?: string[];
          self_care_frequency?: string;
          sleep_quality?: string;
          specific_needs?: string[];
          user_id?: string;
        };
        Relationships: [];
      };
      postpartum_screenings: {
        Row: {
          created_at: string | null;
          id: string;
          needs_professional_help: boolean | null;
          risk_score: number;
          screening_data: Json;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          needs_professional_help?: boolean | null;
          risk_score: number;
          screening_data: Json;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          needs_professional_help?: boolean | null;
          risk_score?: number;
          screening_data?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          onboarding_completed: boolean;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          onboarding_completed?: boolean;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          onboarding_completed?: boolean;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      risk_alerts: {
        Row: {
          action_taken: string | null;
          created_at: string | null;
          id: string;
          message_context: string | null;
          resolved: boolean | null;
          risk_type: string | null;
          severity: number | null;
          user_id: string | null;
        };
        Insert: {
          action_taken?: string | null;
          created_at?: string | null;
          id?: string;
          message_context?: string | null;
          resolved?: boolean | null;
          risk_type?: string | null;
          severity?: number | null;
          user_id?: string | null;
        };
        Update: {
          action_taken?: string | null;
          created_at?: string | null;
          id?: string;
          message_context?: string | null;
          resolved?: boolean | null;
          risk_type?: string | null;
          severity?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'risk_alerts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_recipes: {
        Row: {
          created_at: string | null;
          id: string;
          mood: string | null;
          preferences: string | null;
          recipe_content: string | null;
          recipe_ingredients: Json | null;
          recipe_instructions: Json | null;
          recipe_title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          mood?: string | null;
          preferences?: string | null;
          recipe_content?: string | null;
          recipe_ingredients?: Json | null;
          recipe_instructions?: Json | null;
          recipe_title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          mood?: string | null;
          preferences?: string | null;
          recipe_content?: string | null;
          recipe_ingredients?: Json | null;
          recipe_instructions?: Json | null;
          recipe_title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_videos: {
        Row: {
          created_at: string | null;
          id: string;
          user_id: string;
          video_description: string | null;
          video_id: string;
          video_thumbnail_url: string | null;
          video_title: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          user_id: string;
          video_description?: string | null;
          video_id: string;
          video_thumbnail_url?: string | null;
          video_title: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          user_id?: string;
          video_description?: string | null;
          video_id?: string;
          video_thumbnail_url?: string | null;
          video_title?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      sentiment_analysis: {
        Row: {
          ai_response: string | null;
          analysis_type: string;
          created_at: string | null;
          emotions: Json | null;
          id: string;
          input_text: string;
          recommendations: string[] | null;
          sentiment_label: string | null;
          sentiment_score: number | null;
          user_id: string;
        };
        Insert: {
          ai_response?: string | null;
          analysis_type: string;
          created_at?: string | null;
          emotions?: Json | null;
          id?: string;
          input_text: string;
          recommendations?: string[] | null;
          sentiment_label?: string | null;
          sentiment_score?: number | null;
          user_id: string;
        };
        Update: {
          ai_response?: string | null;
          analysis_type?: string;
          created_at?: string | null;
          emotions?: Json | null;
          id?: string;
          input_text?: string;
          recommendations?: string[] | null;
          sentiment_label?: string | null;
          sentiment_score?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          id: string;
          is_new: boolean | null;
          unlocked_at: string | null;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          id?: string;
          is_new?: boolean | null;
          unlocked_at?: string | null;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          id?: string;
          is_new?: boolean | null;
          unlocked_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_achievements_achievement_id_fkey';
            columns: ['achievement_id'];
            isOneToOne: false;
            referencedRelation: 'achievements';
            referencedColumns: ['id'];
          },
        ];
      };
      user_challenge_progress: {
        Row: {
          challenge_id: string;
          completed_at: string | null;
          created_at: string | null;
          current_progress: number | null;
          id: string;
          is_completed: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          challenge_id: string;
          completed_at?: string | null;
          created_at?: string | null;
          current_progress?: number | null;
          id?: string;
          is_completed?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          challenge_id?: string;
          completed_at?: string | null;
          created_at?: string | null;
          current_progress?: number | null;
          id?: string;
          is_completed?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_challenge_progress_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'weekly_challenges';
            referencedColumns: ['id'];
          },
        ];
      };
      user_gamification: {
        Row: {
          created_at: string | null;
          current_level: number | null;
          current_streak: number | null;
          id: string;
          last_activity_date: string | null;
          longest_streak: number | null;
          points_to_next_level: number | null;
          total_check_ins: number | null;
          total_community_interactions: number | null;
          total_journal_entries: number | null;
          total_points: number | null;
          total_self_care_activities: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_level?: number | null;
          current_streak?: number | null;
          id?: string;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          points_to_next_level?: number | null;
          total_check_ins?: number | null;
          total_community_interactions?: number | null;
          total_journal_entries?: number | null;
          total_points?: number | null;
          total_self_care_activities?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_level?: number | null;
          current_streak?: number | null;
          id?: string;
          last_activity_date?: string | null;
          longest_streak?: number | null;
          points_to_next_level?: number | null;
          total_check_ins?: number | null;
          total_community_interactions?: number | null;
          total_journal_entries?: number | null;
          total_points?: number | null;
          total_self_care_activities?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          baby_name: string | null;
          behavior_analysis: Json | null;
          created_at: string | null;
          daily_interactions: number | null;
          email: string | null;
          id: string;
          kiwify_customer_id: string | null;
          kiwify_transaction_id: string | null;
          last_interaction_date: string | null;
          name: string;
          preferences: string[] | null;
          pregnancy_week: number | null;
          risk_level: number | null;
          subscription_end: string | null;
          subscription_start: string | null;
          subscription_tier: string | null;
          type: string;
        };
        Insert: {
          baby_name?: string | null;
          behavior_analysis?: Json | null;
          created_at?: string | null;
          daily_interactions?: number | null;
          email?: string | null;
          id?: string;
          kiwify_customer_id?: string | null;
          kiwify_transaction_id?: string | null;
          last_interaction_date?: string | null;
          name: string;
          preferences?: string[] | null;
          pregnancy_week?: number | null;
          risk_level?: number | null;
          subscription_end?: string | null;
          subscription_start?: string | null;
          subscription_tier?: string | null;
          type: string;
        };
        Update: {
          baby_name?: string | null;
          behavior_analysis?: Json | null;
          created_at?: string | null;
          daily_interactions?: number | null;
          email?: string | null;
          id?: string;
          kiwify_customer_id?: string | null;
          kiwify_transaction_id?: string | null;
          last_interaction_date?: string | null;
          name?: string;
          preferences?: string[] | null;
          pregnancy_week?: number | null;
          risk_level?: number | null;
          subscription_end?: string | null;
          subscription_start?: string | null;
          subscription_tier?: string | null;
          type?: string;
        };
        Relationships: [];
      };
      weekly_challenges: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          end_date: string;
          goal_type: string;
          goal_value: number;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          points_reward: number | null;
          start_date: string;
          title: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          end_date: string;
          goal_type: string;
          goal_value: number;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          points_reward?: number | null;
          start_date: string;
          title: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          end_date?: string;
          goal_type?: string;
          goal_value?: number;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          points_reward?: number | null;
          start_date?: string;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_age_months: { Args: { birth_date: string }; Returns: number };
      cleanup_expired_cache: { Args: never; Returns: number };
      delete_old_conversations: { Args: never; Returns: undefined };
      match_conversations: {
        Args: {
          filter_user_id?: string;
          match_count?: number;
          match_threshold?: number;
          query_embedding: string;
        };
        Returns: {
          created_at: string;
          id: string;
          message: string;
          response: string;
          similarity: number;
        }[];
      };
      search_similar_memories: {
        Args: {
          match_count?: number;
          match_threshold?: number;
          match_user_id: string;
          query_embedding: string;
        };
        Returns: {
          content_text: string;
          content_type: string;
          created_at: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;

