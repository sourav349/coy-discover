import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CURRENT_USER_ID, SWIPE_ACTIONS } from '@/lib/constants';
import type { SwipeResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUserId, action } = body;

    // Validate request body
    if (!targetUserId || !action) {
      return NextResponse.json(
        { success: false, matched: false, error: 'Missing targetUserId or action' } satisfies SwipeResponse,
        { status: 400 }
      );
    }

    if (action !== SWIPE_ACTIONS.LIKE && action !== SWIPE_ACTIONS.PASS) {
      return NextResponse.json(
        { success: false, matched: false, error: 'Action must be "like" or "pass"' } satisfies SwipeResponse,
        { status: 400 }
      );
    }

    // Reject self-swipes
    if (targetUserId === CURRENT_USER_ID) {
      return NextResponse.json(
        { success: false, matched: false, error: 'Cannot swipe on yourself' } satisfies SwipeResponse,
        { status: 400 }
      );
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_targetId: {
          swiperId: CURRENT_USER_ID,
          targetId: targetUserId,
        },
      },
    });

    if (existingSwipe) {
      return NextResponse.json(
        { success: false, matched: false, error: 'Already swiped on this user' } satisfies SwipeResponse,
        { status: 409 }
      );
    }

    // Create the swipe
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: targetUserId,
        action,
      },
    });

    // If action is 'like', check for reciprocal like
    if (action === SWIPE_ACTIONS.LIKE) {
      const reciprocalLike = await prisma.swipe.findFirst({
        where: {
          swiperId: targetUserId,
          targetId: CURRENT_USER_ID,
          action: SWIPE_ACTIONS.LIKE,
        },
      });

      if (reciprocalLike) {
        // Mutual match! Use sorted IDs for unique constraint
        const [user1Id, user2Id] = [CURRENT_USER_ID, targetUserId].sort();

        // Create match in a transaction
        const match = await prisma.$transaction(async (tx) => {
          // Check if match already exists
          const existingMatch = await tx.match.findUnique({
            where: {
              user1Id_user2Id: { user1Id, user2Id },
            },
          });

          if (existingMatch) return existingMatch;

          return tx.match.create({
            data: { user1Id, user2Id },
          });
        });

        // Get the matched user's info
        const matchedUser = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, name: true, photo: true },
        });

        const response: SwipeResponse = {
          success: true,
          matched: true,
          match: {
            id: match.id,
            user: {
              id: matchedUser!.id,
              name: matchedUser!.name,
              photo: matchedUser!.photo,
            },
          },
        };

        return NextResponse.json(response);
      }
    }

    // No match (either pass or no reciprocal like)
    const response: SwipeResponse = {
      success: true,
      matched: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Swipe error:', error);
    return NextResponse.json(
      { success: false, matched: false, error: 'Failed to process swipe' } satisfies SwipeResponse,
      { status: 500 }
    );
  }
}
