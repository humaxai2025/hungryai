export function middleware(request) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-eval'; object-src 'none';"
  );
  return response;
}
