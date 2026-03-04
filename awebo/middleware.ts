import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_SUBDOMAIN = 'app.awebo.wtf';
const APP_PATH_PREFIX = '/app';

// Paths that get rewritten to /app/* on app subdomain. Exclude /launch so it always serves the wizard.
const APP_ROOT_PATHS = ['/', '/activity', '/merch', '/profile'] as const;

function isAppSubdomain(host: string): boolean {
  try {
    return new URL(host.startsWith('http') ? host : `https://${host}`).hostname === APP_SUBDOMAIN;
  } catch {
    return host === APP_SUBDOMAIN || host.startsWith(APP_SUBDOMAIN + ':');
  }
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // When user is on app.awebo.wtf, rewrite root and app paths to /app/*
  // so the URL stays clean (e.g. app.awebo.wtf/activity) but we serve /app/activity.
  if (isAppSubdomain(host) && (APP_ROOT_PATHS as readonly string[]).includes(pathname)) {
    const rewritePath = pathname === '/' ? APP_PATH_PREFIX : `${APP_PATH_PREFIX}${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
