const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'superburger-2570b',
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@superburger-2570b.iam.gserviceaccount.com',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase initialized successfully');
} catch(e) {
  console.log('Firebase init error:', e.message);
}

const db = admin.firestore();

app.get('/', (req, res) => res.json({ status: 'running', endpoints: ['/send-otp', '/verify-otp', '/send-notification', '/register-token'] }));

// Telnyx SMS setup
const TELNYX_API_KEY = process.env.TELNYX_API_KEY || '';
const TELNYX_FROM = process.env.TELNYX_FROM || 'SuperBurger';

app.post('/register-token', async (req, res) => {
  const { token, phone } = req.body;
  try {
    await db.collection('fcmTokens').doc(phone).set({ token, updatedAt: new Date() });
    res.json({ success: true });
  } catch(e) {
    console.log('Error saving token:', e.message);
    res.json({ success: false, error: e.message });
  }
});

app.post('/send-notification', async (req, res) => {
  const { phone, token, title, body, tokens } = req.body;
  try {
    if (tokens && Array.isArray(tokens)) {
      const messages = tokens.map(t => ({
        token: t,
        notification: { title, body },
        android: { notification: { channelId: 'superburger', title, body } }
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
      android: { notification: { channelId: 'superburger', title, body } }
    });
    res.json({ success: true });
  } catch (e) {
    console.log('Notification error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  console.log('📩 /send-otp called for:', phone);
  if (!phone) return res.json({ success: false, error: 'رقم الهاتف مطلوب' });
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    await db.collection('otpCodes').doc(phone).set({ code, expiresAt, createdAt: new Date() });
    console.log('🔑 OTP stored:', code);

    if (!TELNYX_API_KEY) {
      console.log('⚠️ TELNYX_API_KEY not set!');
      return res.json({ success: false, error: 'TELNYX_API_KEY غير مضبوط في السيرفر' });
    }

    const https = require('https');
    const smsData = JSON.stringify({
      from: TELNYX_FROM,
      to: phone,
      text: `كود التحقق الخاص بك: ${code}\nصلاحية الكود 5 دقائق`
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.telnyx.com',
        path: '/v2/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TELNYX_API_KEY}`
        }
      };
      const telnyxReq = https.request(options, (telnyxRes) => {
        let body = '';
        telnyxRes.on('data', chunk => body += chunk);
        telnyxRes.on('end', () => resolve({ status: telnyxRes.statusCode, body }));
      });
      telnyxReq.on('error', reject);
      telnyxReq.write(smsData);
      telnyxReq.end();
    });

    console.log('📨 Telnyx response:', result.status, result.body);

    if (result.status !== 200) {
      return res.json({ success: false, error: `فشل إرسال SMS (${result.status})` });
    }

    res.json({ success: true });
  } catch(e) {
    console.log('❌ Send OTP error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.json({ success: false, error: 'البيانات ناقصة' });
  try {
    const doc = await db.collection('otpCodes').doc(phone).get();
    if (!doc.exists) return res.json({ success: false, error: 'لم يتم إرسال كود لهذا الرقم' });
    const data = doc.data();
    if (Date.now() > data.expiresAt) {
      await db.collection('otpCodes').doc(phone).delete();
      return res.json({ success: false, error: 'انتهت صلاحية الكود' });
    }
    if (data.code !== code) return res.json({ success: false, error: 'الكود غير صحيح' });
    await db.collection('otpCodes').doc(phone).delete();
    res.json({ success: true });
  } catch(e) {
    console.log('Verify OTP error:', e.message);
    res.json({ success: false, error: e.message });
  }
});

app.listen(3000, () => console.log('Server running!'));
