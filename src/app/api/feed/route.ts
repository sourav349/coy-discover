import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CURRENT_USER_ID } from '@/lib/constants';
import type { UserProfile, FeedResponse } from '@/types';

export async function GET() {
  try {
    // Get all profile IDs already swiped by current user
    const swipedProfiles = await prisma.swipe.findMany({
      where: { swiperId: CURRENT_USER_ID },
      select: { targetId: true },
    });

    const swipedIds = swipedProfiles.map((s) => s.targetId);

    // Get all profiles NOT swiped AND NOT current user
    const profiles = await prisma.user.findMany({
      where: {
        id: {
          notIn: [CURRENT_USER_ID, ...swipedIds],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse interests JSON string into arrays
    const parsedProfiles: UserProfile[] = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      age: profile.age,
      photo: profile.photo,
      bio: profile.bio,
      city: profile.city,
      occupation: profile.occupation,
      interests: JSON.parse(profile.interests) as string[],
    }));

    const response: FeedResponse = { profiles: parsedProfiles };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
