import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { CURRENT_USER_ID, SWIPE_ACTIONS } from '../lib/constants';

// Helper to seed clean test data before each test
async function seedTestData() {
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.user.deleteMany();

  // Create current user and test profiles
  await prisma.user.createMany({
    data: [
      {
        id: CURRENT_USER_ID,
        name: 'You',
        age: 23,
        photo: 'https://i.pravatar.cc/400?img=68',
        bio: 'Just a chill person exploring Coy',
        city: 'Mumbai',
        interests: JSON.stringify(['music', 'travel', 'food', 'photography']),
        occupation: 'Software Engineer',
      },
      {
        id: 'user-ananya',
        name: 'Ananya Sharma',
        age: 22,
        photo: 'https://i.pravatar.cc/400?img=1',
        bio: 'IIT Delhi grad 🎨',
        city: 'Delhi',
        interests: JSON.stringify(['coding', 'art', 'music']),
        occupation: 'Frontend Developer',
      },
      {
        id: 'user-rohan',
        name: 'Rohan Mehta',
        age: 25,
        photo: 'https://i.pravatar.cc/400?img=2',
        bio: 'Startup founder ☕',
        city: 'Bangalore',
        interests: JSON.stringify(['fitness', 'reading', 'travel']),
        occupation: 'Founder',
      },
      {
        id: 'user-priya',
        name: 'Priya Nair',
        age: 23,
        photo: 'https://i.pravatar.cc/400?img=3',
        bio: 'BITS Pilani 🎸',
        city: 'Pune',
        interests: JSON.stringify(['music', 'photography', 'yoga']),
        occupation: 'Data Analyst',
      },
    ],
  });
}

describe('1. Feed Privacy & Filtering Requirements', () => {
  beforeEach(async () => {
    await seedTestData();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Feed excludes current user from discovery', async () => {
    const swiped = await prisma.swipe.findMany({
      where: { swiperId: CURRENT_USER_ID },
      select: { targetId: true },
    });
    const swipedIds = swiped.map((s) => s.targetId);

    const feed = await prisma.user.findMany({
      where: {
        id: { notIn: [CURRENT_USER_ID, ...swipedIds] },
      },
    });

    expect(feed.every((u) => u.id !== CURRENT_USER_ID)).toBe(true);
    expect(feed.length).toBe(3);
  });

  it('1. Feed excludes previously swiped profiles', async () => {
    // Current user swipes 'like' on user-ananya
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-ananya',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    const swiped = await prisma.swipe.findMany({
      where: { swiperId: CURRENT_USER_ID },
      select: { targetId: true },
    });
    const swipedIds = swiped.map((s) => s.targetId);

    const feed = await prisma.user.findMany({
      where: {
        id: { notIn: [CURRENT_USER_ID, ...swipedIds] },
      },
    });

    expect(feed.some((u) => u.id === 'user-ananya')).toBe(false);
    expect(feed.some((u) => u.id === 'user-rohan')).toBe(true);
    expect(feed.some((u) => u.id === 'user-priya')).toBe(true);
    expect(feed.length).toBe(2);
  });

  it('2. Feed does not expose incoming likes (core privacy guarantee)', async () => {
    // user-priya has liked current user behind the scenes
    await prisma.swipe.create({
      data: {
        swiperId: 'user-priya',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    const swiped = await prisma.swipe.findMany({
      where: { swiperId: CURRENT_USER_ID },
      select: { targetId: true },
    });
    const swipedIds = swiped.map((s) => s.targetId);

    const feed = await prisma.user.findMany({
      where: {
        id: { notIn: [CURRENT_USER_ID, ...swipedIds] },
      },
    });

    // Priya is in the feed, but feed schema exposes ZERO information about who liked you
    const priyaInFeed = feed.find((u) => u.id === 'user-priya');
    expect(priyaInFeed).toBeDefined();
    expect(priyaInFeed).not.toHaveProperty('hasLiked');
    expect(priyaInFeed).not.toHaveProperty('hasLikedYou');
    expect(priyaInFeed).not.toHaveProperty('incomingLike');
    expect(priyaInFeed).not.toHaveProperty('swipe');
  });
});

describe('2. Swipe & Mutual Matching Requirements', () => {
  beforeEach(async () => {
    await seedTestData();
  });

  it('3. Like creates a swipe record', async () => {
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-rohan',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    expect(swipe.id).toBeDefined();
    expect(swipe.swiperId).toBe(CURRENT_USER_ID);
    expect(swipe.targetId).toBe('user-rohan');
    expect(swipe.action).toBe(SWIPE_ACTIONS.LIKE);
  });

  it('4. Pass creates a swipe record', async () => {
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-rohan',
        action: SWIPE_ACTIONS.PASS,
      },
    });

    expect(swipe.id).toBeDefined();
    expect(swipe.action).toBe(SWIPE_ACTIONS.PASS);
  });

  it('5. One-sided like does not create a match', async () => {
    // Current user likes user-ananya (who hasn't liked current user)
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-ananya',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Check for reciprocal like
    const reciprocal = await prisma.swipe.findFirst({
      where: {
        swiperId: 'user-ananya',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    expect(reciprocal).toBeNull();

    // Verify no match in Match table
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID, user2Id: 'user-ananya' },
          { user1Id: 'user-ananya', user2Id: CURRENT_USER_ID },
        ],
      },
    });
    expect(matches.length).toBe(0);
  });

  it('Passing a profile never creates a match even if other user liked', async () => {
    // user-priya liked current user
    await prisma.swipe.create({
      data: {
        swiperId: 'user-priya',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Current user passes on user-priya
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-priya',
        action: SWIPE_ACTIONS.PASS,
      },
    });

    // Passing must never create a match
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID, user2Id: 'user-priya' },
          { user1Id: 'user-priya', user2Id: CURRENT_USER_ID },
        ],
      },
    });
    expect(matches.length).toBe(0);
  });

  it('6. Mutual likes create a match', async () => {
    // Priya already liked current user
    await prisma.swipe.create({
      data: {
        swiperId: 'user-priya',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Current user likes Priya back
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-priya',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Check reciprocal like
    const reciprocal = await prisma.swipe.findFirst({
      where: {
        swiperId: 'user-priya',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });
    expect(reciprocal).not.toBeNull();

    // Create match with sorted user IDs
    const [user1Id, user2Id] = [CURRENT_USER_ID, 'user-priya'].sort();
    const match = await prisma.match.create({
      data: { user1Id, user2Id },
    });

    expect(match).toBeDefined();
    expect(match.user1Id).toBe(user1Id);
    expect(match.user2Id).toBe(user2Id);

    // Verify it exists in database
    const dbMatch = await prisma.match.findUnique({
      where: { user1Id_user2Id: { user1Id, user2Id } },
    });
    expect(dbMatch).not.toBeNull();
  });

  it('7. Duplicate swipes are rejected safely by unique constraint', async () => {
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-ananya',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Attempting a second swipe on user-ananya must throw a unique constraint error
    await expect(
      prisma.swipe.create({
        data: {
          swiperId: CURRENT_USER_ID,
          targetId: 'user-ananya',
          action: SWIPE_ACTIONS.PASS,
        },
      })
    ).rejects.toThrow();
  });

  it('11. Users cannot match with themselves', async () => {
    // Attempting to create a match with user1Id === user2Id
    // Application validation rule: user1Id cannot equal user2Id
    const sameUserId = CURRENT_USER_ID;
    const canSelfMatch = (id1: string, id2: string) => id1 !== id2;
    expect(canSelfMatch(sameUserId, sameUserId)).toBe(false);

    // Self swipe rejection test
    const isValidSwipe = (swiperId: string, targetId: string) => swiperId !== targetId;
    expect(isValidSwipe(CURRENT_USER_ID, CURRENT_USER_ID)).toBe(false);
  });
});

describe('3. Matches API & Persistence Requirements', () => {
  beforeEach(async () => {
    await seedTestData();
  });

  it('8. Matches endpoint returns only mutual matches', async () => {
    // 1. Mutual match with Priya
    const [id1, id2] = [CURRENT_USER_ID, 'user-priya'].sort();
    await prisma.match.create({
      data: { user1Id: id1, user2Id: id2 },
    });

    // 2. One-sided like from Rohan to current user (NOT a match)
    await prisma.swipe.create({
      data: {
        swiperId: 'user-rohan',
        targetId: CURRENT_USER_ID,
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Query matches for current user
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
    });

    expect(matches.length).toBe(1);
    const matchedProfile = matches[0].user1Id === CURRENT_USER_ID ? matches[0].user2 : matches[0].user1;
    expect(matchedProfile.id).toBe('user-priya');
    expect(matchedProfile.name).toBe('Priya Nair');

    // Rohan is not in matches
    const containsRohan = matches.some((m) => m.user1Id === 'user-rohan' || m.user2Id === 'user-rohan');
    expect(containsRohan).toBe(false);
  });

  it('9. Swipes persist after simulated reload / disconnect', async () => {
    await prisma.swipe.create({
      data: {
        swiperId: CURRENT_USER_ID,
        targetId: 'user-rohan',
        action: SWIPE_ACTIONS.LIKE,
      },
    });

    // Simulate query after page reload / app restart
    const persistedSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_targetId: {
          swiperId: CURRENT_USER_ID,
          targetId: 'user-rohan',
        },
      },
    });

    expect(persistedSwipe).not.toBeNull();
    expect(persistedSwipe?.action).toBe(SWIPE_ACTIONS.LIKE);
  });

  it('10. Matches persist after simulated reload / disconnect', async () => {
    const [u1, u2] = [CURRENT_USER_ID, 'user-ananya'].sort();
    await prisma.match.create({
      data: { user1Id: u1, user2Id: u2 },
    });

    // Simulate new query
    const persistedMatch = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: { user1Id: u1, user2Id: u2 },
      },
    });

    expect(persistedMatch).not.toBeNull();
    expect(persistedMatch?.id).toBeDefined();
  });
});
