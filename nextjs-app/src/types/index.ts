import { z } from 'zod';

// Wallet Schema
export const WalletSchema = z.object({
  wallet_address: z.string().min(40).max(44),
  chain_id: z.number().default(137),
  connected_at: z.date().default(() => new Date()),
  balance: z.string().default('0'),
});

// Staking Schema
export const StakingPositionSchema = z.object({
  id: z.string(),
  wallet_address: z.string().min(40).max(44),
  amount: z.string(),
  duration_days: z.number().min(30).max(360),
  apy: z.number().min(0).max(100),
  status: z.enum(['active', 'completed', 'withdrawn']).default('active'),
  created_at: z.date().default(() => new Date()),
  end_date: z.date(),
  rewards_earned: z.string().default('0'),
});

// NFT Access Schema
export const NFTAccessSchema = z.object({
  wallet_address: z.string().min(40).max(44),
  has_access: z.boolean().default(false),
  nft_count: z.number().default(0),
  access_level: z.enum(['none', 'basic', 'premium', 'vip']).default('none'),
  last_checked: z.date().default(() => new Date()),
});

// Story Progress Schema
export const StoryProgressSchema = z.object({
  wallet_address: z.string().min(40).max(44),
  current_chapter: z.string(),
  completed_chapters: z.array(z.string()).default([]),
  story_path: z.string().default('default'),
  reputation_score: z.number().default(0),
  choices_made: z.array(z.object({
    chapter_id: z.string(),
    choice_index: z.number(),
    reputation_change: z.number(),
  })).default([]),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

// Stream Schema
export const StreamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  creator_wallet: z.string().min(40).max(44),
  stream_key: z.string(),
  playback_id: z.string(),
  nft_required: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'ended']).default('active'),
  created_at: z.date().default(() => new Date()),
  viewer_count: z.number().default(0),
});

// Telegram Subscription Schema
export const TelegramSubscriptionSchema = z.object({
  wallet_address: z.string().min(40).max(44),
  chat_id: z.number(),
  subscribed: z.boolean().default(true),
  notifications: z.object({
    staking: z.boolean().default(true),
    streams: z.boolean().default(true),
    story: z.boolean().default(true),
    general: z.boolean().default(true),
  }).default({}),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

// AI Content Schema
export const AIContentSchema = z.object({
  id: z.string(),
  wallet_address: z.string().min(40).max(44),
  prompt: z.string(),
  content_type: z.enum(['meme', 'comic', 'story', 'text']),
  content: z.string(),
  session_id: z.string(),
  created_at: z.date().default(() => new Date()),
});

// API Request/Response Types
export type WalletData = z.infer<typeof WalletSchema>;
export type StakingPosition = z.infer<typeof StakingPositionSchema>;
export type NFTAccess = z.infer<typeof NFTAccessSchema>;
export type StoryProgress = z.infer<typeof StoryProgressSchema>;
export type Stream = z.infer<typeof StreamSchema>;
export type TelegramSubscription = z.infer<typeof TelegramSubscriptionSchema>;
export type AIContent = z.infer<typeof AIContentSchema>;

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Story Chapter Type
export interface StoryChapter {
  id: string;
  chapter_number: number;
  title: string;
  description: string;
  content: string;
  nft_required: boolean;
  choices: Array<{
    text: string;
    reputation_change: number;
    consequence?: string;
    next_chapter?: string;
  }>;
}