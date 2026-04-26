/** Privy App ID from dashboard; required for PrivyProvider and usePrivy hooks. */
export const privyAppId = (process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '').trim();

export const isPrivyConfigured = privyAppId.length > 0;
