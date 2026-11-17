export const CURRENT_USER_ID = 'current-user';

export const SWIPE_ACTIONS = {
  LIKE: 'like',
  PASS: 'pass',
} as const;

export type SwipeAction = typeof SWIPE_ACTIONS[keyof typeof SWIPE_ACTIONS];
