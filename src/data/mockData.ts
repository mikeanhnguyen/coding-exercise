import { Avatar, UserProfile } from '../types';

export const mockAvatars: Avatar[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Business Coach',
    pricePerMinute: 2.0,
    description: 'Expert in startup strategy',
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    title: 'Fitness Trainer',
    pricePerMinute: 1.5,
    description: 'Personal training specialist',
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    title: 'Career Counselor',
    pricePerMinute: 3.0,
    description: 'PhD in organizational psychology',
  },
];

export const mockUserProfile: UserProfile = {
  userId: 'user-123',
  name: 'Test User',
  tokenBalance: 4.0,
};
