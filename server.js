require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const twilio = require('twilio');

process.on('uncaughtException', (e) => { console.log('💥 Uncaught:', e.message, e.stack); setTimeout(() => process.exit(1), 1000); });
process.on('unhandledRejection', (e) => { console.log('💥 Unhandled rejection:', e.message, e.stack); });

const app = express();
app.use(cors());
app.use(express.json());

// Twilio setup
let twilioClient = null;
function initTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM;
  if (sid && token && from) {
    try {
      twilioClient = twilio(sid, token);
      console.log('✅ Twilio initialized with from number:', from);
    } catch(e) {
      console.log('⚠️ Twilio init failed:', e.message);
    }
  } else {
    console.log('⚠️ Twilio credentials missing');
  }
}
initTwilio();

// Log all requests
app.use((req, res, next) => {
  console.log('🌐', req.method, req.path);
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

let db = null;

// Try multiple ways to initialize Firebase
function initializeFirebase() {
  // Debug: log which env vars are present (without exposing secrets)
  console.log('🔧 Environment check:');
  console.log('  FIREBASE_PRIVATE_KEY present:', !!process.env.FIREBASE_PRIVATE_KEY);
  console.log('  FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0);
  console.log('  FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || '(not set)');
  console.log('  FIREBASE_CLIENT_EMAIL present:', !!process.env.FIREBASE_CLIENT_EMAIL);

  const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || '';

  if (!FIREBASE_PRIVATE_KEY) {
    console.log('⚠️ FIREBASE_PRIVATE_KEY not set, Firebase disabled');
    return null;
  }

  // Try multiple key formats
  const keyFormats = [];

  // Format 1: As-is (might have actual newlines from Render)
  keyFormats.push(FIREBASE_PRIVATE_KEY);

  // Format 2: Replace escaped \n with real newlines
  if (FIREBASE_PRIVATE_KEY.includes('\\n')) {
    keyFormats.push(FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'));
  }

  // Format 3: Replace spaces with newlines (sometimes Render converts \n to space)
  if (FIREBASE_PRIVATE_KEY.includes(' -----END')) {
    keyFormats.push(FIREBASE_PRIVATE_KEY.replace(/ (?=-----)/g, '\n'));
  }

  // Format 4: If key has literal spaces instead of newlines
  const spacedKey = FIREBASE_PRIVATE_KEY.replace(/\s+/g, ' ').replace(/ -----/g, '\n-----').replace(/-----BEGIN /g, '-----BEGIN ');
  if (spacedKey !== FIREBASE_PRIVATE_KEY) {
    keyFormats.push(spacedKey);
  }

  // Format 5: Base64 encoded key
  try {
    const decoded = Buffer.from(FIREBASE_PRIVATE_KEY, 'base64').toString('utf8');
    if (decoded.startsWith('-----BEGIN PRIVATE KEY-----')) {
      keyFormats.push(decoded);
      console.log('  Found Base64 encoded key, decoded successfully');
    }
  } catch(e) {
    // Not Base64, ignore
  }

  for (let i = 0; i < keyFormats.length; i++) {
    try {
      const serviceAccount = {
        project_id: process.env.FIREBASE_PROJECT_ID || 'superburger-2570b',
        client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@superburger-2570b.iam.gserviceaccount.com',
        private_key: keyFormats[i]
      };
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase initialized successfully (format ' + (i + 1) + ')');
      return admin.firestore();
    } catch(e) {
      console.log('❌ Firebase format ' + (i + 1) + ' failed:', e.message.substring(0, 100));
    }
  }

  console.log('⚠️ All Firebase initialization attempts failed');
  return null;
}

db = initializeFirebase();

app.get('/', (req, res) => res.json({
  status: 'running',
  firebaseConfigured: !!db,
  endpoints: ['/send-notification', '/send-otp', '/verify-otp', '/register-token', '/place-order', '/set-admin-claim']
}));

// Diagnostic endpoint to check env var format (no secrets exposed)
app.get('/debug-env', (req, res) => {
  const key = process.env.FIREBASE_PRIVATE_KEY || '';
  res.json({
    hasKey: !!key,
    keyLength: key.length,
    startsWith: key.substring(0, 30),
    endsWith: key.substring(Math.max(0, key.length - 30)),
    hasActualNewlines: key.includes('\n'),
    hasEscapedNewlines: key.includes('\\n'),
    hasSpaces: key.includes(' '),
    newlineCount: (key.match(/\n/g) || []).length,
    firebaseInitialized: !!db
  });
});

app.get('/delete-account', (req, res) => {
  res.send(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>حذف الحساب</title><style>body{font-family:sans-serif;background:#111;color:#fff;max-width:600px;margin:50px auto;padding:20px;line-height:1.8}h1{color:#d4a54a}a{color:#d4a54a}</style></head><body><h1>حذف الحساب - سوبر برجر</h1><p>لحذف حسابك وبياناتك الشخصية نهائياً من تطبيق سوبر برجر، يرجى التواصل عبر واتساب:</p><p><a href="https://wa.me/970593221500">📱 واتساب: 0593221500</a></p><p>سيتم حذف الحساب وجميع البيانات خلال 7 أيام عمل.</p></body></html>`);
});

app.post('/register-token', async (req, res) => {
  const { token, phone, idToken } = req.body;
  if (!db) return res.json({ success: false, error: 'Firebase not configured' });
  if (!idToken) {
    return res.status(401).json({ success: false, error: 'Missing auth token' });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.uid) {
      return res.status(401).json({ success: false, error: 'Invalid auth token' });
    }
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists || userDoc.data().phone !== phone) {
      return res.status(403).json({ success: false, error: 'Phone mismatch with auth' });
    }
    await db.collection('fcmTokens').doc(phone).set({ token, updatedAt: new Date() });
    res.json({ success: true });
  } catch(e) {
    console.log('Error saving token:', e.message);
    res.status(401).json({ success: false, error: 'Auth failed' });
  }
});

app.post('/send-notification', async (req, res) => {
  const { phone, token, title, body, tokens, idToken } = req.body;
  if (!db) return res.json({ success: false, error: 'Firebase not configured' });
  if (!idToken) {
    return res.status(401).json({ success: false, error: 'Missing auth token' });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const isAdminUser = decoded.admin === true;
    if (!isAdminUser) {
      return res.status(403).json({ success: false, error: 'Admin only' });
    }
    if (tokens && Array.isArray(tokens)) {
      const messages = tokens.map(t => ({
        token: t,
        notification: { title, body },
        android: { notification: { title, body } }
      }));
      const result = await admin.messaging().sendAll(messages);
      return res.json({ success: true, sent: result.successCount });
    }
    let fcmToken = token;
    if (!fcmToken && phone) {
      let tokenDoc = await db.collection('fcmTokens').doc(phone).get();
      if (tokenDoc.exists) {
        fcmToken = tokenDoc.data().token;
      } else {
        const normalizedPhone = phone.startsWith('0') ? '970' + phone.slice(1) : phone;
        tokenDoc = await db.collection('fcmTokens').doc(normalizedPhone).get();
        if (tokenDoc.exists) {
          fcmToken = tokenDoc.data().token;
        }
      }
    }
    if (!fcmToken) return res.json({ success: false, error: 'No token found' });
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      android: { notification: { title, body } }
    });
    res.json({ success: true });
  } catch (e) {
    console.log('Notification error:', e.message);
    res.status(401).json({ success: false, error: 'Auth failed' });
  }
});

const adminClaimAttempts = new Map();

function normalizePhone(phone) {
  let p = String(phone || '').replace(/\D/g, '');
  if (p.startsWith('0')) p = '970' + p.slice(1);
  if (!p.startsWith('+') && p.startsWith('970')) p = '+' + p;
  if (!p.startsWith('+')) p = '+970' + p;
  return p;
}

app.post('/send-otp', async (req, res) => {
  const { phone, idToken } = req.body;
  if (!db) return res.json({ success: false, error: 'Firebase not configured' });
  if (!idToken) return res.status(401).json({ success: false, error: 'Missing auth token' });
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.uid) return res.status(401).json({ success: false, error: 'Invalid auth token' });
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) return res.status(403).json({ success: false, error: 'User not found' });
    const normalizedPhone = normalizePhone(phone);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.collection('otpCodes').doc(decoded.uid).set({
      code,
      phone: normalizedPhone,
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      createdAt: new Date().toISOString()
    });
    if (twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `رمز التحقق الخاص بك في سوبر برجر هو: ${code}\nصالح لمدة 10 دقائق.`,
          from: process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM,
          to: normalizedPhone
        });
        res.json({ success: true, message: 'OTP sent' });
      } catch (e) {
        console.log('Twilio send error:', e.message);
        // Return code in dev/test mode if Twilio fails
        res.json({ success: true, code, message: 'Twilio failed, code returned for testing: ' + e.message });
      }
    } else {
      res.json({ success: true, code, message: 'Twilio not configured, code returned for testing' });
    }
  } catch(e) {
    console.log('Send OTP error:', e.message);
    res.status(401).json({ success: false, error: 'Auth failed' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { code, idToken } = req.body;
  if (!db) return res.json({ success: false, error: 'Firebase not configured' });
  if (!idToken) return res.status(401).json({ success: false, error: 'Missing auth token' });
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.uid) return res.status(401).json({ success: false, error: 'Invalid auth token' });
    const otpDoc = await db.collection('otpCodes').doc(decoded.uid).get();
    if (!otpDoc.exists) return res.json({ success: false, error: 'No OTP found' });
    const otpData = otpDoc.data();
    if (new Date(otpData.expiresAt) < new Date()) {
      return res.json({ success: false, error: 'OTP expired' });
    }
    if (otpData.attempts >= 5) {
      return res.json({ success: false, error: 'Too many attempts' });
    }
    await db.collection('otpCodes').doc(decoded.uid).update({ attempts: admin.firestore.FieldValue.increment(1) });
    if (otpData.code !== String(code).trim()) {
      return res.json({ success: false, error: 'Invalid code' });
    }
    await db.collection('users').doc(decoded.uid).update({ verifiedForOrdering: true });
    await db.collection('otpCodes').doc(decoded.uid).delete();
    res.json({ success: true });
  } catch(e) {
    console.log('Verify OTP error:', e.message);
    res.status(401).json({ success: false, error: 'Auth failed' });
  }
});

app.post('/place-order', async (req, res) => {
  const { userId, name, phone, fcmToken, items, couponId } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.json({ success: false, error: 'السلة فارغة' });
  }
  if (!db) return res.json({ success: false, error: 'Firebase not configured' });

  try {
    // Fetch current menu prices from Firestore
    const menuSnap = await db.collection('menu').get();
    const menuMap = {};
    menuSnap.docs.forEach(d => { const d2 = d.data(); menuMap[d2.name] = d2.price; });

    // Also consider the built-in menuData from the client fallback
    // Validate each item's price server-side
    let serverTotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const menuPrice = menuMap[item.name];
      const basePrice = menuPrice !== undefined ? menuPrice : (item.price || 0);
      const optionsTotal = (item.selectedOptions || []).reduce((s, o) => s + (o.price || 0), 0);
      const finalPrice = basePrice + optionsTotal;
      serverTotal += finalPrice;
      validatedItems.push({
        name: item.name,
        price: basePrice,
        finalPrice,
        selectedOptions: item.selectedOptions || []
      });
    }

    // Apply coupon if provided
    let appliedDiscount = 0;
    let finalCouponId = null;
    if (couponId) {
      const couponDoc = await db.collection('coupons').doc(couponId).get();
      if (couponDoc.exists) {
        const couponData = couponDoc.data();
        if (couponData.active !== false) {
          if (!couponData.expiresAt || new Date(couponData.expiresAt) >= new Date()) {
            if (!couponData.maxUses || (couponData.currentUses || 0) < couponData.maxUses) {
              // Check per-user limit
              if (couponData.maxPerUser > 0 && userId) {
                const userCount = (couponData.usedBy && couponData.usedBy[userId]) || 0;
                if (userCount >= couponData.maxPerUser) {
                  return res.json({ success: false, error: 'لقد استنفذت حد استخدام هذا الكوبون' });
                }
              }
              appliedDiscount = couponData.discount || 0;
              finalCouponId = couponId;
            }
          }
        }
      }
    }

    const finalTotal = appliedDiscount > 0
      ? Math.round(serverTotal * (100 - appliedDiscount) / 100)
      : serverTotal;

    const orderRef = await db.collection('orders').add({
      userId: userId || null,
      userName: name || 'ضيف',
      name: name || 'ضيف',
      phone: phone || '00000000',
      fcmToken: fcmToken || null,
      deliveryLocation: '',
      orderType: 'pickup',
      items: validatedItems,
      total: finalTotal,
      serverTotal,
      discount: appliedDiscount,
      couponId: finalCouponId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Increment coupon usage
    if (finalCouponId) {
      try {
        const updateData = {
          currentUses: admin.firestore.FieldValue.increment(1)
        };
        if (userId) {
          updateData[`usedBy.${userId}`] = admin.firestore.FieldValue.increment(1);
        }
        await db.collection('coupons').doc(finalCouponId).update(updateData);
      } catch(e) {
        console.log('Coupon increment error:', e.message);
      }
    }

    res.json({ success: true, orderId: orderRef.id, total: finalTotal });
  } catch(e) {
    console.log('Place order error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

app.post('/set-admin-claim', async (req, res) => {
  const { uid, secret } = req.body;
  if (!process.env.ADMIN_SECRET) {
    return res.json({ success: false, error: 'ADMIN_SECRET not set' });
  }
  // Rate limit: max 3 attempts per IP per hour
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = adminClaimAttempts.get(ip);
  if (entry) {
    if (now - entry.firstAttempt < 60 * 60 * 1000) {
      if (entry.count >= 3) {
        const retryAfter = Math.ceil((60 * 60 * 1000 - (now - entry.firstAttempt)) / 1000 / 60);
        return res.status(429).json({ success: false, error: `محاولات كثيرة، حاول بعد ${retryAfter} دقيقة` });
      }
      entry.count++;
    } else {
      adminClaimAttempts.set(ip, { count: 1, firstAttempt: now });
    }
  } else {
    adminClaimAttempts.set(ip, { count: 1, firstAttempt: now });
  }
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ success: true, message: 'Admin claim set for ' + uid });
  } catch(e) {
    console.log('Set admin claim error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
