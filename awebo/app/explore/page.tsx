import { redirect } from 'next/navigation';

/** Legacy route: marketplace spec lives under `/marketplace`. */
export default function ExploreRedirectPage() {
  redirect('/marketplace');
}
