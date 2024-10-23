import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { sessionMiddleware, CookieStore, Session } from 'hono-sessions';
import { isLoggedIn } from './util.js';

const app = new Hono<{  
    Variables: {
        session: Session,
        session_key_rotation: boolean
    }} >();

const store = new CookieStore();
const port = Number(process.env.PORT) || 3005;

app.use('*', sessionMiddleware({
  store,
  encryptionKey: 'fromunda',
  expireAfterSeconds: 86400,
  cookieOptions: {
    sameSite: 'Lax',
    path: '/',
    httpOnly: true,
  },
}));

app.get('/', (c) => c.text('Hono!'));

app.post('/api/login', async (c) => {
  const session = c.get('session');
  const reqtype = c.req.raw.headers.get('content-type');
  const body = reqtype === 'application/json' ? await c.req.json() : await c.req.parseBody();

  if (!body.username || !body.password) {
    c.status(400);
    return c.body('Missing Username or Password');
  }

  const success = body.password === "abcdef";
  if (success) {
    const user = { username: body.username };
    //set session
    session.set('logged', true);
    session.set('username', user.username);
    console.log(`User authenticated: ${user.username}`);
    return c.json({
      success: true,
      username: user.username,
    });
  }
});


app.get('/api/logout', isLoggedIn, (c) => {
  const session = c.get('session');
  session.deleteSession();
  return c.json({
    success: true,
  });
});

app.get('/api/me', isLoggedIn, (c) => {
  const session = c.get('session');
  return c.json({
    success: true,
    username: session.get('username'),
  });
});


serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});



