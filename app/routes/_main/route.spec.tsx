import { describe, expect, test, vi } from 'vitest';
import mockJWT from '~/Testing/utils/mockJWT';
import { loader } from './route';
import { faker } from '@faker-js/faker';
import AuthMe from '~/Auth/types/Me';

// mocking session
const mockAccessToken = mockJWT();
vi.mock('~/sessions', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/sessions')>()),
    authSession: () => ({
      getAuthSession: async () => ({
        get: () => mockAccessToken,
      }),
      commitAuthSession: async () => {},
      destroyAuthSession: async () => {},
      authSessionName: 'mockAuthSession',
    }),
  };
});

// mocking fetchMe
const mockFetchMeFn = vi.fn();
vi.mock('~/Auth/utils/fetchMe', () => ({
  default: (...args: any) => {
    return mockFetchMeFn(...args);
  },
}));

//
// unit test
//
describe('LayoutMain loader', () => {
  const mockAuthMe: AuthMe = {
    username: faker.string.sample(),
  };

  test('access token verification', async () => {
    mockFetchMeFn.mockResolvedValueOnce(mockAuthMe);
    const mockLoaderFunctionArgs = {
      request: {
        headers: {
          get: () => 'mockHeader',
        },
      },
    } as any;
    await loader(mockLoaderFunctionArgs); // act
    expect(mockFetchMeFn.mock.lastCall[0]).toBe(mockAccessToken);
  });

  test.todo('skipping access token revalidation');

  test.todo('access token about to expire');
});
