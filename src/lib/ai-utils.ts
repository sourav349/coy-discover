import type { UserProfile } from '@/types';

const CURRENT_USER_INTERESTS = ['music', 'travel', 'food', 'photography'];

const ICEBREAKERS = [
  "What's the most spontaneous trip you've ever taken?",
  "If you could master any skill overnight, what would it be?",
  "What's your go-to comfort food after a long day?",
  "What song has been on repeat for you lately?",
  "If you could teleport anywhere right now, where would you go?",
  "What's the best meal you've ever cooked or eaten?",
  "What's a hobby you picked up recently and can't stop talking about?",
  "If your life had a soundtrack, what genre would it be?",
  "What's the most beautiful place you've ever photographed?",
  "Coffee or chai? And what's your go-to order?",
  "What's one thing on your bucket list you're determined to do this year?",
  "If you could have dinner with anyone, living or dead, who would it be?",
  "What's a hidden gem restaurant or café you love?",
  "What's the last thing that made you laugh until you cried?",
  "If you weren't doing what you do now, what career would you choose?",
  "What's your unpopular food opinion?",
  "What's the best concert or live event you've been to?",
  "Do you prefer mountains or beaches? And what's your favorite spot?",
  "What's the most adventurous thing you've ever done?",
  "If you could start a YouTube channel, what would it be about?",
];

export function generateAIInsight(profile: UserProfile) {
  const shared = profile.interests.filter(i =>
    CURRENT_USER_INTERESTS.some(ci => ci.toLowerCase() === i.toLowerCase())
  );

  const compatibility = Math.min(95, Math.max(60,
    50 + shared.length * 12 + Math.floor(Math.random() * 15)
  ));

  const icebreaker = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];

  return {
    compatibility,
    icebreaker,
    sharedInterests: shared,
  };
}
