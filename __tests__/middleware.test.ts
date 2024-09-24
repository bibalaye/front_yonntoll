import { createMocks } from 'node-mocks-http';
import middleware from '../middleware';
import { prisma } from '../app/lib/prisma';
import { NextFetchEvent } from 'next/dist/server/web/spec-extension/fetch-event';

jest.mock('../app/lib/prisma');
jest.mock('@clerk/nextjs/server');

describe('Middleware', () => {
  it('should allow access for authorized user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/some-protected-route',
    });

    // Mock sessionClaims
    const auth = jest.fn().mockReturnValue({
      sessionClaims: { sub: 'user-id-1' },
    });
    // Mock Prisma response
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      userType: 'admin',
    });

    // Convert the mock request to match the expected type
    const mockNextFetchEvent = {
      waitUntil: jest.fn(),
      passThroughOnException: jest.fn(),
    } as unknown as NextFetchEvent;

    const response = await middleware(auth(), mockNextFetchEvent);

    if (response) {
      expect(response.status).toBe(200);
    } else {
      fail('La réponse ne devrait pas être nulle');
    }
  });

  it('devrait refuser l\'accès à un utilisateur non autorisé', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/some-protected-route',
    });

    // Mock sessionClaims
    const auth = jest.fn().mockReturnValue({
      sessionClaims: { sub: 'user-id-2' },
    });

    // Mock Prisma response
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      userType: 'user',
    });

    // Convert the mock request to match the expected type
    const nextFetchEvent = {
      request: req,
      respondWith: jest.fn(),
      passThroughOnException: jest.fn(),
      waitUntil: jest.fn(),
      sourcePage: '',
      preloadResponse: Promise.resolve(undefined),
      [Symbol.for('next.waitUntil')]: jest.fn(),
      [Symbol.for('next.passThroughOnException')]: jest.fn(),
    };

    const mockNextFetchEvent = nextFetchEvent as unknown as NextFetchEvent;
    const response = await middleware(auth(), mockNextFetchEvent);

    if (response) {
      expect(response.status).toBe(302);
      const redirectUrl = response.headers.get('Location');
      expect(redirectUrl).toBe('/unauthorized');
    } else {
      fail('La réponse ne devrait pas être nulle');
    }
  });
});
