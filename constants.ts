import { type CreditPackage, type ContentItem, SubscriptionPlan, User } from './types';

// Fix: Add and export REWARD_AMOUNT constant.
export const REWARD_AMOUNT = 100;

export const INITIAL_USERS: User[] = [
    {
        id: '20251103-003',
        role: 'user',
        username: 'RegularUser123',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=user',
        followers: ['20251103-001', '20251103-002'],
        following: ['20251103-001'],
        email: 'user@example.com',
        vitrineSlug: 'regular-user-123',
    },
    {
        id: '20251103-001',
        role: 'creator',
        username: 'ArtisticCreator',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=creator',
        followers: ['20251103-003'],
        following: ['20251103-002', '20251103-003'],
        email: 'creator@example.com',
        vitrineSlug: 'artistic-creator',
    },
     {
        id: '20251103-002',
        role: 'developer',
        username: 'DevAdmin',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=developer',
        followers: [],
        following: ['20251103-001'],
        email: 'dev@example.com',
        vitrineSlug: 'dev-admin',
    }
];


export const INITIAL_CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'pkg1', credits: 200, price: 2.00, bonus: 0, bestValue: false, stripeProductId: 'prod_SyYasByos1peGR' },
  { id: 'pkg2', credits: 500, price: 5.00, bonus: 0, bestValue: false, stripeProductId: 'prod_SyYeStqRDuWGFF' },
  { id: 'pkg3', credits: 1000, price: 10.00, bonus: 0, bestValue: false, stripeProductId: 'prod_SyYfzJ1fjz9zb9' },
  { id: 'pkg4', credits: 2500, price: 25.00, bonus: 0, bestValue: true, stripeProductId: 'prod_SyYmVrUetdiIBY' },
  { id: 'pkg5', credits: 5000, price: 50.00, bonus: 0, bestValue: false, stripeProductId: 'prod_SyYg54VfiOr7LQ' },
  { id: 'pkg6', credits: 10000, price: 100.00, bonus: 0, bestValue: false, stripeProductId: 'prod_SyYhva8A2beAw6' },
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
    { id: 'item1', creatorId: '20251103-001', title: 'Galactic Voyager', price: 150, imageUrl: 'https://picsum.photos/seed/item1/600/800', userReactions: {'20251103-003': '😍', '20251103-001': '', '20251103-002': '❤️'}, mediaCount: {images: 1, videos: 0}, blurLevel: 5, likedBy: ['20251103-003', '20251103-002'], sharedBy: ['20251103-003', '20251103-002'], createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), tags: ['#space', '#scifi', '#art'] },
    { id: 'item2', creatorId: '20251103-001', title: 'Mystic Forest', price: 200, imageUrl: 'https://picsum.photos/seed/item2/600/800', userReactions: {'20251103-003': '😲', '20251103-001': '', '20251103-002': ''}, mediaCount: {images: 3, videos: 1}, blurLevel: 8, likedBy: ['20251103-003'], sharedBy: ['20251103-003'], createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), tags: ['#fantasy', '#nature', '#magic'] },
    { id: 'item3', creatorId: '20251103-001', title: 'Cyberpunk Alley', price: 120, imageUrl: 'https://picsum.photos/seed/item3/600/800', userReactions: {'20251103-003': '😂', '20251103-001': '😂', '20251103-002': ''}, mediaCount: {images: 5, videos: 0}, blurLevel: 2, likedBy: [], sharedBy: [], createdAt: new Date().toISOString(), tags: ['#cyberpunk', '#scifi', '#neon'] },
    { id: 'item4', creatorId: '20251103-002', title: 'Oceanic Dreams', price: 250, imageUrl: 'https://picsum.photos/seed/item4/600/800', userReactions: {'20251103-003': '❤️', '20251103-001': '😘', '20251103-002': ''}, mediaCount: {images: 1, videos: 0}, blurLevel: 10, likedBy: ['20251103-003', '20251103-001'], sharedBy: ['20251103-003', '20251103-001', '20251103-002'], createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), tags: ['#ocean', '#dream', '#art'] }
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    { id: 'plan_free', name: 'Free', price: 0, currency: 'USD', credits: 0, features: ['Access to public content', 'Follow creators'], stripeProductId: 'prod_SyYChoQJbIb1ye' },
    { id: 'plan_basic', name: 'Basic', price: 9.00, currency: 'USD', credits: 1000, features: ['Access to exclusive content', 'Monthly credit top-up', 'Basic creator support'], stripeProductId: 'prod_SyYK31lYwaraZW' },
    { id: 'plan_pro', name: 'Pro', price: 15.00, currency: 'USD', credits: 2000, features: ['All Basic features', 'Early access to new content', 'Priority creator support'], stripeProductId: 'prod_SyYMs3lMIhORSP' },
    { id: 'plan_vip', name: 'VIP', price: 25.00, currency: 'USD', credits: 4000, features: ['All Pro features', 'Direct message with creators', 'Exclusive VIP badge'], stripeProductId: 'prod_SyYVIP' } // Using a mock ID for VIP
];