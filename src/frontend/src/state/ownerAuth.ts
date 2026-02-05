const OWNER_AUTH_KEY = 'waffle_naka_owner_auth';

export function setOwnerAuth(isAuthenticated: boolean): void {
  if (isAuthenticated) {
    sessionStorage.setItem(OWNER_AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(OWNER_AUTH_KEY);
  }
}

export function isOwnerAuthenticated(): boolean {
  return sessionStorage.getItem(OWNER_AUTH_KEY) === 'true';
}

export function clearOwnerAuth(): void {
  sessionStorage.removeItem(OWNER_AUTH_KEY);
}
