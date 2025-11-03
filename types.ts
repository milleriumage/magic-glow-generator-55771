
export type Screen = 'home' | 'store' | 'manage-subscription' | 'history' | 'rewards' | 'create-content' | 'creator-payouts' | 'developer-panel' | 'my-creations' | 'account' | 'view-creator' | 'ux-kit' | 'design-studio' | 'pix-payment' | 'livepix-payment' | 'user-plan-management' | 'showcase-management' | 'outfit-generator' | 'theme-generator';

export type UserRole = 'user' | 'creator' | 'developer';

export interface User {
  id: string; // Using unique string as ID
  role: UserRole; // Added to store the role
  username: string;
  profilePictureUrl: string;
  followers: string[]; // Changed to string[]
  following: string[]; // Changed to string[]
  email: string;
  age?: number; 
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  vitrineSlug?: string;
}

export enum TransactionType {
  PURCHASE = 'purchase',
  REWARD = 'reward',
  SUBSCRIPTION = 'subscription',
  REFUND = 'refund',
  CREDIT_PURCHASE = 'credit_purchase',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
}

export interface CreatorTransaction {
    id: string;
    cardId: string;
    cardTitle: string;
    buyerId: string; // Changed from UserRole
    amountReceived: number;
    originalPrice: number;
    timestamp: string;
    mediaCount: { images: number; videos: number };
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonus: number;
  bestValue: boolean;
  stripeProductId?: string;
}

export interface ContentItem {
  id: string;
  creatorId: string; // Changed from UserRole
  title: string;
  price: number;
  imageUrl: string;
  offerText?: string;
  mediaType?: 'image' | 'video';
  userReactions: Record<string, string>; // Key is now user ID (string)
  mediaCount: { images: number; videos: number };
  isHidden?: boolean;
  blurLevel: number; 
  externalLink?: string; 
  likedBy: string[]; // Changed from UserRole[]
  sharedBy: string[]; // Changed from UserRole[]
  createdAt: string; 
  tags: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'USD' | 'BRL' | 'EUR';
  credits: number;
  features: string[];
  stripeProductId?: string; 
}

export interface UserSubscription extends SubscriptionPlan {
  renewsOn: string;
  paymentMethod: string;
}

export interface DevSettings {
  platformCommission: number;
  creditValueUSD: number;
  withdrawalCooldownHours: number;
  maxImagesPerCard: number;
  maxVideosPerCard: number;
  commentsEnabled: boolean;
}

export interface UserTimeout {
    userId: string; // Changed from UserRole
    endTime: number;
    message: string;
}