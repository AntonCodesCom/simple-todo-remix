import { useRouteError } from '@remix-run/react';
import { mode } from '~/env';
import CommonErrorScreen from '../ErrorScreen';

/**
 * Error boundary component without a layout.
 */
export default function CommonErrorBoundary() {
  const error = useRouteError();
  const { isDev } = mode();
  return <CommonErrorScreen error={error} isDev={isDev} />;
}
