import { Outlet } from '@remix-run/react';
import CommonLayout from '~/Common/components/Layout';

export default function LayoutMain() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}
