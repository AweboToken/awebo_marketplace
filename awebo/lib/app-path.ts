/**
 * When the app is served at app.awebo.wtf, paths are /, /activity, etc.
 * When served at awebo.wtf, app routes are under /app: /app, /app/activity, etc.
 * Use this with the current pathname to build correct hrefs for app routes.
 */
export function getAppBasePath(pathname: string): string {
  return pathname.startsWith('/app') ? '/app' : '';
}

export function appPath(pathname: string, segment: string): string {
  const base = getAppBasePath(pathname);
  if (!base) return segment ? `/${segment}` : '/';
  return segment ? `${base}/${segment}` : base;
}
