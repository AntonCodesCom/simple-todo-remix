import { faker } from '@faker-js/faker';

function toBase64(x: string): string {
  const buffer = Buffer.from(x);
  return buffer.toString('base64');
}

export default function mockJWT(exp?: number): string {
  const header = toBase64(
    JSON.stringify({
      typ: 'JWT',
      alg: 'HS256',
    }),
  );
  const payload = toBase64(
    JSON.stringify({
      sub: faker.string.uuid(),
      exp: exp ?? Date.now() / 1000 + 86400 * 7,
    }),
  );
  const signature = toBase64(faker.string.sample());
  return `${header}.${payload}.${signature}`;
}
