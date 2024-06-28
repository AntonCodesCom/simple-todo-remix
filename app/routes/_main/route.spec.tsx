import { describe, expect, test, vi } from 'vitest';
import mockJWT from '~/Testing/utils/mockJWT';
import { loader } from './route';
import { faker } from '@faker-js/faker';
import AuthMe from '~/Auth/types/Me';

// mocking session
const mockAccessToken = mockJWT();
const mockGetAuthSessionGetFn = vi.fn().mockReturnValue(mockAccessToken);
vi.mock('~/sessions', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/sessions')>()),
    authSession: () => ({
      getAuthSession: async () => ({
        get: mockGetAuthSessionGetFn,
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
  const mockLoaderFunctionArgs = {
    request: {
      headers: {
        get: () => 'mockHeader',
      },
    },
  } as any;

  test('access token verification', async () => {
    mockFetchMeFn.mockResolvedValueOnce(mockAuthMe);
    mockFetchMeFn.mockClear();
    await loader(mockLoaderFunctionArgs); // act
    expect(mockFetchMeFn.mock.lastCall[0]).toBe(mockAccessToken);
  });

  test.todo('skipping access token revalidation');

  test('access token about to expire', async () => {
    mockFetchMeFn.mockResolvedValueOnce(mockAuthMe);
    mockFetchMeFn.mockClear();
    const _mockAccessToken = mockJWT(Date.now() / 1000 + 60); // expires in 1 minute
    mockGetAuthSessionGetFn.mockReturnValueOnce(_mockAccessToken);
    await loader(mockLoaderFunctionArgs); // act
    expect(mockFetchMeFn).not.toHaveBeenCalled();
  });
});
