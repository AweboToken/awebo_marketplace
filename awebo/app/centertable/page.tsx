import { redirect } from 'next/navigation';

/** Center table is an in-homepage overlay, not a standalone room. */
export default function CenterTablePage() {
  redirect('/');
}
