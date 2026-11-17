export interface UserProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  occupation?: string | null;
  interests: string[];
}

export interface SwipeRequest {
  targetUserId: string;
  action: 'like' | 'pass';
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  match?: {
    id: string;
    user: {
      id: string;
      name: string;
      photo: string;
    };
  };
  error?: string;
}

export interface MatchData {
  id: string;
  matchedUser: UserProfile;
  createdAt: string;
}

export interface FeedResponse {
  profiles: UserProfile[];
}

export interface MatchesResponse {
  matches: MatchData[];
}

export interface AIInsight {
  compatibility: number;
  icebreaker: string;
  sharedInterests: string[];
}
