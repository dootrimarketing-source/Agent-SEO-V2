import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface GMBPost {
  title: string;
  content: string;
  type: 'Update' | 'Offer' | 'Event' | 'Product';
  date?: string;
}

export interface MetricsData {
  month: string;
  views: number;
  calls: number;
  directions: number;
  websiteClicks: number;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'Optimization' | 'Weekly' | 'Monthly';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export enum GeneratorMode {
  TEXT = 'TEXT',
  IMAGE_GEN = 'IMAGE_GEN',
  IMAGE_EDIT = 'IMAGE_EDIT'
}

export interface TrackerEntry {
  id: string;
  period: string;
  impressions: number;
  clicks: number;
  calls: number;
  reviews: number;
  rating: number;
}

export interface BusinessProfile {
  name: string;
  industry: string;
  location: string;
  description: string;
  services: string[];
  website: string;
  phone: string;
}

export interface AppAction {
  type: 'NAVIGATE';
  path: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Array<{
    uri: string;
    title: string;
  }>;
  action?: AppAction;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  response?: string;
}

export interface CompetitorData {
  name: string;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}