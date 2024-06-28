import { describe, expect, test, vi } from 'vitest';
import mockJWT from '~/Testing/utils/mockJWT';
import { loader } from './route';

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
  test('access token verification', async () => {
    const mockLoaderFunctionArgs = {
      request: {
        headers: {
          get: () => 'mockHeader',
        },
      },
    } as any;
    await loader(mockLoaderFunctionArgs); // act
    expect(mockFetchMeFn).toHaveBeenCalledWith(mockAccessToken);
  });

  test.todo('skipping access token revalidation');
});
