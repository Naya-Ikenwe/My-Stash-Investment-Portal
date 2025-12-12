// import { cookies } from 'next/headers';

// const ONE_DAY = 24 * 60 * 60 * 1000;

// export async function createSession(token: string) {
//   const cookieStore = await cookies();
  
//   cookieStore.set('session_token', token, {
//     httpOnly: true,       // Prevent JavaScript access (XSS protection)
//     secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
//     maxAge: ONE_DAY,
//     path: '/',            // Available across the whole site
//     sameSite: 'strict',   // CSRF protection
//   });
// }

// export async function getSession() {
//   const cookieStore = await cookies();
//   return cookieStore.get('session_token')?.value;
// }

// export async function deleteSession() {
//   const cookieStore = await cookies();
//   cookieStore.delete('session_token');
// }