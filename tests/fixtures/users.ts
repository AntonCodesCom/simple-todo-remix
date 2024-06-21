interface E2Euser {
  username: string;
  password: string;
}

/**
 * Alice user fixture.
 *
 * This fixture MUST have its representation on backend.
 */
export const alice: E2Euser = {
  username: 'alice',
  password: 'Alice1111$',
};
