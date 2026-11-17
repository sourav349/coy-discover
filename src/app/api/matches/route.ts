import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CURRENT_USER_ID } from '@/lib/constants';
import type { UserProfile, MatchData, MatchesResponse } from '@/types';

export async function GET() {
  try {
    // Find all matches where current user is user1 or user2
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID },
          { user2Id: CURRENT_USER_ID },
        ],
      },
      include: {
        user1: true,
        user2: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to MatchData, returning the OTHER user's profile
    const matchData: MatchData[] = matches.map((match) => {
      const otherUser = match.user1Id === CURRENT_USER_ID ? match.user2 : match.user1;

      const matchedUser: UserProfile = {
        id: otherUser.id,
        name: otherUser.name,
        age: otherUser.age,
        photo: otherUser.photo,
        bio: otherUser.bio,
        city: otherUser.city,
        occupation: otherUser.occupation,
        interests: JSON.parse(otherUser.interests) as string[],
      };

      return {
        id: match.id,
        matchedUser,
        createdAt: match.createdAt.toISOString(),
      };
    });

    const response: MatchesResponse = { matches: matchData };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Matches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
