import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, ImageBackground, TextInput, Dimensions, Animated, Linking, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');
const SERVER_URL = 'https://superresturantb-production.up.railway.app';

const COLORS = {
  gold: '#F5C518',
  goldDark: '#D4A017',
  bg: '#0e0c0a',
  card: '#1c1810',
  text: '#fff',
  textMuted: '#a89880',
  red: '#e74c3c',
  green: '#27ae60',
};

const menuData = [
  { id: 1, name: 'كلاسيك بيف', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، جبنة تشيدر، سوبر صوص', price: 20, cat: 'burger', options: [{ name: 'جبنة تشيدر', price: 3 }, { name: 'جبنة موتزاريلا', price: 3 }, { name: 'بيض', price: 2 }, { name: 'لحم زيادة', price: 8 }, { name: 'صوص', price: 2 }] },
  { id: 2, name: 'BBQ برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، جبنة تشيدر، باربيكيو صوص', price: 21, cat: 'burger', options: [{ name: 'جبنة تشيدر', price: 3 }, { name: 'بيبركيون', price: 3 }, { name: 'لحم زيادة', price: 8 }, { name: 'بيض', price: 2 }] },
  { id: 3, name: 'هالبينو بيف', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، جبنة تشيدر، شرائح هالبينو', price: 22, cat: 'burger', options: [{ name: 'جبنة تشيدر', price: 3 }, { name: 'هالبينو', price: 2 }, { name: 'لحم زيادة', price: 8 }, { name: 'جبن موتزاريلا', price: 3 }] },
  { id: 4, name: 'تكساس برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، جبنة تشيدر، حلقات بصل مقلية', price: 24, cat: 'burger', options: [{ name: 'جبنة تشيدر', price: 3 }, { name: 'حلقات بصل', price: 3 }, { name: 'لحم زيادة', price: 8 }] },
  { id: 5, name: 'سوبر برجر', desc: '200غم لحم طازج، خس، مخلل، بندورة، سوبر صوص، جبنة تشيدر، جبنة موتزاريلا', price: 30, cat: 'burger', options: [{ name: 'لحم زيادة', price: 8 }, { name: 'بيض', price: 2 }, { name: '突尼斯', price: 2 }] },
  { id: 6, name: 'مونستر برجر', desc: '320غم لحم طازج (قطعتين)، خس، مخلل، بندورة، بصل، سوبر صوص، جبنة تشيدر، جبنة موتزاريلا', price: 35, cat: 'burger', options: [{ name: 'لحم زيادة', price: 8 }, { name: 'جبنة تشيدر', price: 3 }] },
  { id: 7, name: 'هوت دوغ برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، سوبر صوص، جبنة تشيدر وموتزاريلا، أصابع هوت دوغ مشوية', price: 25, cat: 'burger', options: [{ name: 'لحم زيادة', price: 8 }, { name: 'هوت دوغ', price: 3 }, { name: 'جبنة', price: 3 }] },
  { id: 8, name: 'بيروني برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، جبنة تشيدر، سوبر صوص، شرائح بيروني مشوية', price: 25, cat: 'burger', options: [{ name: 'بيروني', price: 4 }, { name: 'لحم زيادة', price: 8 }] },
  { id: 9, name: 'موروكو برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، سوبر صوص، حلقات البصل، قطع السلامي المشوي', price: 29, cat: 'burger', options: [{ name: 'سلامة', price: 5 }, { name: 'لحم زيادة', price: 8 }] },
  { id: 10, name: 'سلطع برجر', desc: '180غم لحم مدخن طازج، خس، مخلل، بصل، بندورة، باربيكيو صوص', price: 29, cat: 'burger', options: [{ name: 'لحم زيادة', price: 8 }, { name: 'خبز', price: 2 }] },
  { id: 11, name: 'ميلانو برجر', desc: '160غم لحم طازج، خس، مخلل، بندورة، بصل، سوبر صوص، جبنة تشيدر وموتزاريلا، أصبعين موتزاريلا، قطعة سالمي مشوية', price: 26, cat: 'burger', options: [{ name: 'سلامة', price: 5 }, { name: 'لحم زيادة', price: 8 }] },
  { id: 12, name: 'ماشروم برجر', desc: '160غم لحم طازج، خس، مخلل، بصل، جبنة موتزاريلا، صوص الماشروم الطازج', price: 26, cat: 'burger', options: [{ name: 'ماشروم', price: 3 }, { name: 'جبنة موتزاريلا', price: 3 }, { name: 'لحم زيادة', price: 8 }] },
  { id: 13, name: 'كلاسيك تشيكن', desc: 'صدر دجاج مقلي، خس، بندورة، مخلل، سوبر صوص، سويت تشيلي صوص', price: 16, cat: 'chicken', options: [{ name: 'صوص سويت تشيلي', price: 1 }, { name: 'صوص حار', price: 1 }, { name: 'جبنة', price: 2 }] },
  { id: 14, name: 'كريسبي تشيكن', desc: 'صدر دجاج مقلي بخلطة الكريسبي، خس، بندورة، مخلل، سوبر صوص، سويت تشيلي صوص', price: 17, cat: 'chicken', options: [{ name: 'صوص سويت تشيلي', price: 1 }, { name: 'صوص حار', price: 1 }] },
  { id: 15, name: 'ماشين تشيكن', desc: 'صدر دجاج مقلي بالخلطة السرية، خس، بندورة، مخلل، سوبر صوص، سويت تشيلي صوص', price: 21, cat: 'chicken', options: [{ name: 'صوص سويت تشيلي', price: 1 }, { name: 'صوص حار', price: 1 }] },
  { id: 16, name: 'دوريتوس تشيكن', desc: 'صدر دجاج مقلي بخلطة الدوريتوس، خس، بندورة، مخلل، سوبر صوص، سويت تشيلي صوص', price: 20, cat: 'chicken', options: [{ name: 'صوص سويت تشيلي', price: 1 }, { name: 'صوص حار', price: 1 }] },
  { id: 17, name: 'هالبينو تشيكن', desc: 'صدر دجاج مقلي، خس، بندورة، مخلل، قطع هالبينو، سوبر صوص، سويت تشيلي صوص، تشيلي صوص', price: 18, cat: 'chicken', options: [{ name: 'هالبينو', price: 2 }, { name: 'صوص حار', price: 1 }] },
  { id: 18, name: 'تشيكن ستربس', desc: 'قطع دجاج مقلية (متوفر حار أو عادي)', price: 15, cat: 'chicken', options: [{ name: 'حار', price: 0 }, { name: 'عادي', price: 0 }] },
  { id: 19, name: 'بطاطا', desc: 'بطاطا مقلية ذهبية', price: 6, cat: 'extras', options: [{ name: 'ملح', price: 0 }, { name: 'بابريكا', price: 1 }] },
  { id: 20, name: 'بطاطا مع جبنة', desc: 'بطاطا مقلية مع جبنة سائلة', price: 11, cat: 'extras', options: [] },
  { id: 21, name: 'حلقات البصل', desc: 'حلقات بصل مقلية مقرمشة', price: 10, cat: 'extras', options: [] },
  { id: 22, name: 'ودجز', desc: 'قطع بطاطا مقلية صغيرة', price: 10, cat: 'extras', options: [] },
  { id: 23, name: 'كرات البطاطا', desc: 'كرات بطاطا مقلية', price: 10, cat: 'extras', options: [] },
  { id: 24, name: 'أصابع الموتزاريلا', desc: 'أصابع جبنة موتزاريلا مقلية', price: 15, cat: 'extras', options: [] },
  { id: 25, name: 'كيرلي', desc: 'بطاطا مجعودة مقلية', price: 14, cat: 'extras', options: [] },
  { id: 26, name: 'سوبر بوكس', desc: 'بوكس سوبر برجر مع بطاطا ومشروب', price: 25, cat: 'extras', options: [] },
  { id: 27, name: 'جبنة سائلة', desc: 'صوص جبنة سائلة', price: 5, cat: 'extras', options: [] },
  { id: 28, name: 'كرات الجبنة بالهالبينو', desc: 'كرات جبنة محشوة بهالبينو', price: 15, cat: 'extras', options: [] },
  { id: 29, name: 'أجنحة الدجاج', desc: 'أجنحة دجاج مقلية (سويت وينجز، وينجز حار، باربيكيو وينجز، كرانش وينجز)', price: 15, cat: 'extras', options: [{ name: 'سويت وينجز', price: 0 }, { name: 'وينجز حار', price: 0 }, { name: 'باربيكيو', price: 1 }, { name: 'كرانش', price: 1 }] },
];

const categories = [
  { key: 'all', label: 'الكل' },
  { key: 'burger', label: 'برجر' },
  { key: 'chicken', label: 'دجاج' },
  { key: 'extras', label: 'إضافات' },
  { key: 'drinks', label: 'مشروبات' },
];

const stats = [
  { icon: 'bicycle-outline', val: '8 ₪', label: 'التوصيل' },
  { icon: 'time-outline', val: '25 د', label: 'التحضير' },
  { icon: 'star-outline', val: '4.8', label: 'التقييم' },
];

const activeOrders = [];
const pastOrders = [];

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [selectedCat, setSelectedCat] = React.useState('all');
  const [menuCat, setMenuCat] = React.useState('all');
  const [searchText, setSearchText] = React.useState('');
  const [orderTab, setOrderTab] = React.useState('active');
  const [cartCount, setCartCount] = React.useState(0);
  const [cartTotal, setCartTotal] = React.useState(0);
  const [cartItems, setCartItems] = React.useState([]);
  const [toast, setToast] = React.useState('');
  const [notifData, setNotifData] = React.useState(null);
  const [confirmData, setConfirmData] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [verificationId, setVerificationId] = React.useState(null);
  const [phoneStep, setPhoneStep] = React.useState('enterPhone'); // 'enterPhone' | 'enterCode' | 'success'
  const [showMenuModal, setShowMenuModal] = React.useState(false);
  
const [showSearch, setShowSearch] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authName, setAuthName] = React.useState('');
  const [authPhone, setAuthPhone] = React.useState('');
  
  const [couponError, setCouponError] = React.useState(false);
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [cop1Float, setCop1Float] = React.useState(new Animated.Value(0));
  const [posts, setPosts] = React.useState([]);
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [editingMenuItem, setEditingMenuItem] = React.useState(null);
  const [editItemName, setEditItemName] = React.useState('');
  const [editItemDesc, setEditItemDesc] = React.useState('');
  const [editItemPrice, setEditItemPrice] = React.useState('');
  const [newPostTitle, setNewPostTitle] = React.useState('');
  const [newPostDesc, setNewPostDesc] = React.useState('');
  const [newPostImage, setNewPostImage] = React.useState('');
const [couponInput, setCouponInput] = React.useState('');
  const [statScale, setStatScale] = React.useState([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedItem, setExpandedItem] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [showCustomerModal, setShowCustomerModal] = React.useState(false);
  const [showOptionsModal, setShowOptionsModal] = React.useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [menuFromDB, setMenuFromDB] = React.useState([]);
  const [showMenuManagement, setShowMenuManagement] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemDesc, setNewItemDesc] = React.useState('');
  const [newItemPrice, setNewItemPrice] = React.useState('');
  const [newItemCat, setNewItemCat] = React.useState('burger');
  const [newItemOptions, setNewItemOptions] = React.useState([]);
  const [newOptionName, setNewOptionName] = React.useState('');
  const [newOptionPrice, setNewOptionPrice] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
const [adminOrders, setAdminOrders] = React.useState([]);
  const [showAdminNotification, setShowAdminNotification] = React.useState(false);
  const [orderPrepTimes, setOrderPrepTimes] = React.useState({});

  const registerFCMToken = async (phone) => {
    if (!phone || phone === '00000000') {
      console.log('No valid phone number for token registration');
      return;
    }
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      if (!token) {
        showToast('❌ لم يتم الحصول على التوكن');
        return;
      }
      const normalizedPhone = phone.startsWith('0') ? '970' + phone.slice(1) : phone;
      console.log('Registering with phone:', normalizedPhone, 'token:', token.substring(0, 20) + '...');
      const res = await fetch('https://superresturantb-production.up.railway.app/register-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone: normalizedPhone })
      });
      const data = await res.json();
      console.log('Token registered:', data);
      if (data.success) {
        showToast('✅ تم تسجيل جهازك للإشعارات');
      } else {
        showToast('❌ خطأ: ' + (data.error || 'غير معروف'));
      }
    } catch(e) {
      console.log('FCM token error:', e.message);
      showToast('❌ خطأ في الاتصال');
    }
  };

  const sendPushNotification = async (phone, title, body) => {
    try {
      await fetch('https://superresturantb-production.up.railway.app/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, title, body })
      });
      showToast('تم إرسال الإشعار!');
    } catch(e) {
      console.log('Notification error:', e.message);
      showToast('تم الإشعار!');
    }
  };

  React.useEffect(() => {
    // Background notification handler (for when app is closed)
    try {
      messaging().onBackgroundMessage(async (remoteMessage) => {
        console.log('Background notification:', remoteMessage);
      });
    } catch(e) {
      console.log('Background handler not available');
    }
  }, []);

  React.useEffect(() => {
    // Request notification permission on app start
    const requestNotifPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Notification permission granted');
        const token = await messaging().getToken();
        console.log('Device token:', token);
      }
    };
    requestNotifPermission();
  }, []);

  React.useEffect(() => {
    // Foreground notification handler - shows styled notification only
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title || 'سوبر برجر';
      const body = remoteMessage.notification?.body || 'لديك إشعار جديد';
      setNotifData({ title, body });
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          const isAdminUser = userData?.role === 'admin';
          setCurrentUser({ uid: user.uid, ...userData });
          setIsAdmin(isAdminUser);
        } catch(e) {
          setCurrentUser({ uid: user.uid, email: user.email });
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  

  React.useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('FCM Permission granted');
        try {
          const token = await messaging().getToken();
          console.log('Got token:', token);
          // Don't save here - will be saved when user places order with phone number
        } catch(e) {
          console.log('Token error:', e.message);
        }
      }
    };
    requestPermission();
  }, []);

  React.useEffect(() => {
    try {
      const unsubscribe = firestore()
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          if (snapshot) {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdminOrders(orders);
          }
        });
      return () => unsubscribe();
    } catch(e) {
      console.log('Firestore listener error:', e.message);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      try {
        const unsubscribe = firestore()
          .collection('menu')
          .onSnapshot(snapshot => {
            if (snapshot) {
              const menu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              if (menu.length > 0) setMenuFromDB(menu);
            }
          });
        return () => unsubscribe();
      } catch(e) {
        console.log('Menu load error:', e.message);
      }
    }
  }, [isAdmin]);

  React.useEffect(() => {
    try {
      const unsubscribe = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          if (snapshot) {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
          }
        });
      return () => unsubscribe();
    } catch(e) {
      console.log('Posts load error:', e.message);
    }
  }, []);

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(cop1Float, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(cop1Float, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
);
    anim.start();
    return () => anim.stop();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleRegister = async () => {
    if (!authEmail || !authPassword || !authName || !authPhone) {
      showToast('املأ جميع الحقول');
      return;
    }
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(authEmail, authPassword);
      await firestore().collection('users').doc(userCredential.user.uid).set({
        name: authName,
        email: authEmail,
        phone: authPhone,
        createdAt: new Date().toISOString()
      });
      setCurrentUser({ uid: userCredential.user.uid, name: authName, email: authEmail, phone: authPhone });
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthPhone('');
      showToast('✅ تم تسجيل الدخول!');
    } catch(e) {
      showToast('خطأ: ' + e.message);
    }
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      showToast('أدخل رقم الهاتف صحيح');
      return;
    }
    try {
      showToast('⏳ جاري إرسال الكود...');
      const phone = phoneNumber.startsWith('+') ? phoneNumber : '+970' + phoneNumber.replace(/^0/, '');
      const res = await fetch(`${SERVER_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationId(phone);
        setPhoneStep('enterCode');
        showToast('✅ تم إرسال الكود!');
      } else {
        showToast('❌ ' + (data.error || 'فشل الإرسال'));
      }
    } catch(e) {
      console.log('Send OTP error:', e.message);
      showToast('❌ فشل الاتصال بالسيرفر');
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      showToast('أدخل الكود المكون من 6 أرقام');
      return;
    }
    try {
      showToast('⏳ جاري التحقق...');
      const res = await fetch(`${SERVER_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: verificationId, code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneStep('success');
        showToast('✅ تم التحقق من الرقم!');
      } else {
        showToast('❌ الكود غير صحيح');
      }
    } catch(e) {
      console.log('Verify error:', e.message);
      showToast('❌ فشل الاتصال بالسيرفر');
    }
  };

  const handleLogin = async () => {
    if (!authEmail || !authPassword) {
      showToast('املأ البريد الإلكتروني وكلمة المرور');
      return;
    }
    try {
      const userCredential = await auth().signInWithEmailAndPassword(authEmail, authPassword);
      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
      const userData = userDoc.data();
      const isAdminUser = userData?.role === 'admin';
      setCurrentUser({ uid: userCredential.user.uid, ...userData, role: userData?.role });
      setIsAdmin(isAdminUser);
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthPhone('');
      showToast(isAdminUser ? '✅ مرحباً يا مدير!' : '✅ مرحباً ' + (userData?.name || ''));
    } catch(e) {
      let errorMsg = 'حدث خطأ';
      if (e.message.includes('invalid-email')) errorMsg = 'البريد الإلكتروني غير صحيح';
      else if (e.message.includes('user-not-found')) errorMsg = 'المستخدم غير موجود';
      else if (e.message.includes('wrong-password')) errorMsg = 'كلمة المرور خطأ';
      else if (e.message.includes('too-many-requests')) errorMsg = 'حاول لاحقاً';
      showToast('❌ ' + errorMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setCurrentUser(null);
      showToast('✅ تم تسجيل الخروج');
    } catch(e) {
      showToast('خطأ: ' + e.message);
    }
  };

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'SUPERBURGERNEWAPP') {
      setCouponApplied(true);
      setCouponError(false);
      showToast('✅ تم تطبيق خصم 5%');
    } else {
      setCouponError(true);
      showToast('❌ كوبون غير صالح');
    }
  };

  const getDiscountedPrice = (price) => {
    if (couponApplied) return Math.round(price * 0.95);
    return price;
  };

  const addMenuItem = async () => {
    if (!newItemName || !newItemPrice) {
      showToast('املأ الاسم والسعر');
      return;
    }
    try {
      await firestore().collection('menu').add({
        name: newItemName,
        desc: newItemDesc,
        price: parseInt(newItemPrice),
        cat: newItemCat,
        options: newItemOptions,
        createdAt: new Date().toISOString()
      });
      showToast('✅ تم إضافة الصنف');
      setNewItemName('');
      setNewItemDesc('');
      setNewItemPrice('');
      setNewItemOptions([]);
    } catch(e) {
      showToast('Error: ' + e.message);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await firestore().collection('menu').doc(id).delete();
      showToast('✅ تم الحذف');
    } catch(e) {
      showToast('Error: ' + e.message);
    }
  };

  const updateMenuItem = async () => {
    if (!editingItem) return;
    try {
      await firestore().collection('menu').doc(editingItem.id).update({
        name: editingItem.name,
        desc: editingItem.desc,
        price: parseInt(editingItem.price),
        cat: editingItem.cat,
        options: editingItem.options
      });
      showToast('✅ تم التحديث');
      setEditingItem(null);
    } catch(e) {
      showToast('Error: ' + e.message);
    }
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.finalPrice || item.price), 0);
    if (couponApplied) return Math.round(total * 0.95);
    return total;
  };

  const addToCart = (item) => {
    if (item.options && item.options.length > 0) {
      setSelectedMenuItem(item);
      setSelectedOptions([]);
      setShowOptionsModal(true);
    } else {
      setCartItems([...cartItems, { ...item, selectedOptions: [], optionsTotal: 0, finalPrice: item.price }]);
      setCartCount(c => c + 1);
      setCartTotal(t => t + item.price);
      showToast(`تم اضافة: ${item.name}`);
    }
  };

  const confirmAddWithOptions = () => {
    const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const fullItem = {
      ...selectedMenuItem,
      selectedOptions: selectedOptions,
      optionsTotal: optionsTotal,
      finalPrice: selectedMenuItem.price + optionsTotal
    };
    setCartItems([...cartItems, fullItem]);
    setCartCount(c => c + 1);
    setCartTotal(t => t + fullItem.finalPrice);
    setShowOptionsModal(false);
    setSelectedOptions([]);
    setSelectedMenuItem(null);
    showToast(`تم اضافة: ${selectedMenuItem.name}`);
  };

  const removeFromCart = (index) => {
    const item = cartItems[index];
    setCartItems(cartItems.filter((_, i) => i !== index));
    setCartCount(c => c - 1);
    setCartTotal(t => t - item.price);
  };

  const searchResultPress = (item) => {
    setSelectedItem(item.id);
    setActiveTab('menu');
    setMenuCat(item.cat);
    setShowSearch(false);
    setSearchQuery('');
  };

  const renderHome = () => (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <ImageBackground source={require('./assets/hero_image.jpg')} style={styles.heroImage}>
          <View style={styles.heroOverlay} />
          <View style={styles.homeHeader}>
            {showSearch ? (
              <View style={styles.searchBarInline}>
                <TextInput
                  style={styles.searchBarInlineInput}
                  placeholder="ابحث عن وجبة..."
                  placeholderTextColor="#fff"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
                  <Feather name="x" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.logoBox}>
                <Image source={require('./assets/logo.png')} style={styles.logoImg} />
                <Text style={styles.logoName}>سوبر برجر</Text>
              </View>
            )}
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.hicon} onPress={() => setShowMenuModal(true)}>
                <Ionicons name="menu-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hicon} onPress={() => { setShowSearch(true); setShowNotifications(false); }}>
                <Feather name="search" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hicon}>
                <Ionicons name="notifications-outline" size={18} color="#fff" onPress={() => { setShowNotifications(true); setShowSearch(false); }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroText}>
            <View style={styles.heroTag}>THE BEST EVER</View>
            <Text style={styles.heroTitle}>ألذّ برجر<Text style={styles.goldText}> في قلقيلية</Text></Text>
            <Text style={styles.heroSub}>طازج • مشوي على الفحم • محتكر بحب</Text>
          </View>
        </ImageBackground>
      </View>

      {showNotifications && (
        <View style={styles.notifCard}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifTitle}>الإشعارات</Text>
            <TouchableOpacity style={styles.notifCloseBtn} onPress={() => setShowNotifications(false)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.notifEmpty}>لا توجد إشعارات جديدة</Text>
        </View>
      )}

      {showSearch && searchQuery.length > 0 && menuData.filter(i => i.name.includes(searchQuery) || i.desc.includes(searchQuery)).length > 0 && (
        <View style={styles.searchResultsCard}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>نتائج البحث</Text>
            <TouchableOpacity style={styles.searchCloseBtn} onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
              <Ionicons name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.searchResultsScroll} nestedScrollEnabled>
          {menuData.filter(i => i.name.includes(searchQuery) || i.desc.includes(searchQuery)).map((item) => (
            <TouchableOpacity key={item.id} style={styles.searchResultItem} onPress={() => searchResultPress(item)}>
              <Text style={styles.searchResultName}>{item.name}</Text>
              <Text style={styles.searchResultPrice}>₪{item.price}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCard, i !== 1 && { marginTop: 20 }]}>
            <Ionicons name={s.icon} size={22} color={COLORS.gold} />
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

<View style={styles.gallerySection}>
        <Text style={styles.galleryTitle}>لا تتردد بالطلب!</Text>
        <View style={styles.galleryLineWrap}>
          <View style={styles.galleryLine} />
        </View>
        <View style={styles.galleryRow}>
          <View style={styles.galleryMain}>
            <Image source={require('./assets/a.png')} style={styles.galleryMainImg} />
          </View>
          <View style={styles.gallerySmallCol}>
            <View style={styles.gallerySmall}>
              <Image source={require('./assets/asset.png')} style={styles.gallerySmallImg} />
            </View>
            <View style={styles.gallerySmall}>
              <Image source={require('./assets/whySuper.png')} style={styles.gallerySmallImg} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contactSection}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactTitle}>تواصل معنا</Text>
          <View style={styles.contactLine} />
        </View>

        <View style={styles.contactCard}>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:0593221500')}>
            <View style={styles.contactIconBox}>
              <Ionicons name="call" size={22} color={COLORS.bg} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>اتصل بنا</Text>
              <Text style={styles.contactText}>0593221500</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.contactDivider} />

          <View style={styles.contactRow}>
            <View style={styles.contactIconBox}>
              <Ionicons name="location" size={22} color={COLORS.bg} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>الموقع</Text>
              <Text style={styles.contactText}>قلقيلية{'\n'}شارع حبلة القديم - بالقرب من مبنى المحافظة</Text>
            </View>
          </View>

          <View style={styles.contactDivider} />

          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('https://wa.me/970593221500')}>
            <View style={[styles.contactIconBox, { backgroundColor: '#25D366' }]}>
              <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>واتساب</Text>
              <Text style={styles.contactText}>تواصل معنا مباشرة</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderMenu = () => (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.menuPageHeader}>
        <Text style={styles.menuPageTitle}>القائمة الكاملة</Text>
        <View style={styles.menuSearch}>
          <Feather name="search" size={18} color={COLORS.textMuted} />
          <TextInput style={styles.searchInput} placeholder="ابحث عن صنف..." placeholderTextColor={COLORS.textMuted} value={searchText} onChangeText={setSearchText} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsScroll}>
        {categories.map((c) => (
          <TouchableOpacity key={c.key} style={[styles.catPill, menuCat === c.key && styles.catPillActive]} onPress={() => setMenuCat(c.key)}>
            <Text style={[styles.catPillText, menuCat === c.key && styles.catPillTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.menuCouponCard}>
        <Text style={styles.menuCouponTitle}>هل لديك كوبون؟</Text>
        <View style={styles.menuCouponRow}>
          <TextInput style={styles.menuCouponInput} placeholder="أدخل كود الكوبون" placeholderTextColor="#666" value={couponInput} onChangeText={setCouponInput} />
          <TouchableOpacity style={styles.menuCouponBtn} onPress={() => { if(couponInput.toUpperCase() === 'SUPERBURGERNEWAPP') { setCouponApplied(true); setCouponError(false); showToast('✅ تم تطبيق خصم 5%'); } else { setCouponError(true); showToast('❌ كوبون غير صالح'); } }}>
            <Text style={styles.menuCouponBtnText}>تطبيق</Text>
          </TouchableOpacity>
        </View>
        {couponApplied && <Text style={styles.menuCouponSuccess}>✅ تم تطبيق خصم 5% على جميع الوجبات!</Text>}
        {couponError && !couponApplied && <Text style={styles.menuCouponError}>❌ الكوبون غير صحيح</Text>}
      </View>

      <View style={styles.menuList}>
        {(menuFromDB.length > 0 ? menuFromDB : menuData).filter(i => menuCat === 'all' || i.cat === menuCat).filter(i => !searchText || (i.name && i.name.includes(searchText))).map((item) => (
          <View key={item.id} style={[styles.menuCard, selectedItem === item.id && styles.menuCardHighlighted]}>
            {item.badge ? <View style={[styles.menuCardBadge, item.badge === 'جديد' && styles.menuCardBadgeNew]}><Text style={styles.menuCardBadgeText}>{item.badge}</Text></View> : null}
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardName}>{item.name}</Text>
              <Text style={styles.menuCardDesc}>{item.desc}</Text>
              <View style={styles.menuCardFooter}>
                <Text style={styles.menuCardPrice}>₪{getDiscountedPrice(item.price)}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.menuCouponCard}>
        <Text style={styles.menuCouponTitle}>هل لديك كوبون؟</Text>
        <View style={styles.menuCouponRow}>
          <TextInput style={styles.menuCouponInput} placeholder="أدخل كود الكوبون" placeholderTextColor="#666" value={couponInput} onChangeText={setCouponInput} />
          <TouchableOpacity style={styles.menuCouponBtn} onPress={() => { if(couponInput.toUpperCase() === 'SUPERBURGERNEWAPP') { setCouponApplied(true); setCouponError(false); showToast('✅ تم تطبيق خصم 5%'); } else { setCouponError(true); showToast('❌ كوبون غير صالح'); } }}>
            <Text style={styles.menuCouponBtnText}>تطبيق</Text>
          </TouchableOpacity>
        </View>
        {couponApplied && <Text style={styles.menuCouponSuccess}>✅ تم تطبيق خصم 5% على جميع الوجبات!</Text>}
        {couponError && !couponApplied && <Text style={styles.menuCouponError}>❌ الكوبون غير صحيح</Text>}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderOrders = () => (
    <View style={styles.page}>
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersTitle}>السلة</Text>
        <Text style={styles.ordersSub}>أضف عناصر من القائمة</Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyOrdersText}>السلة فارغة</Text>
        ) : (
          <View style={styles.ordersList}>
            {cartItems.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <Text style={styles.orderItems}>{item.name}</Text>
                  <TouchableOpacity onPress={() => removeFromCart(index)}>
                    <Text style={{ color: COLORS.red, fontSize: 18 }}>×</Text>
                  </TouchableOpacity>
                </View>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <Text style={styles.orderItemSub}>+ {item.selectedOptions.map(o => o.name).join(', ')}</Text>
                )}
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>₪{getDiscountedPrice(item.finalPrice || item.price)}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={() => setShowOrderModal(true)}>
              <Text style={styles.confirmOrderBtnText}>تأكيد الطلب</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && activeTab !== 'orders' && (
        <TouchableOpacity style={styles.cartOverlay} onPress={() => setActiveTab('orders')}>
          <View style={styles.cartBar}>
            <View style={styles.cartBarInfo}>
              <View style={styles.cartCount}>
                <Text style={styles.cartCountText}>{cartItems.length}</Text>
              </View>
              <Text style={styles.cartBarText}>العناصر</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Text style={styles.cartBarTotal}>₪{getCartTotal()}</Text>
              <Text style={styles.cartBarText}>إتمام الطلب</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {showOrderModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>طريقة الدفع</Text>
            <TouchableOpacity style={styles.paymentOption} onPress={() => { setShowOrderModal(false); setAdminOrders([...adminOrders, { name: 'فيزا', phone: '', items: cartItems, total: getCartTotal() }]); showToast('تم تأكيد الطلب!'); setCartItems([]); setCartCount(0); setCartTotal(0); }}>
              <Ionicons name="card" size={24} color={COLORS.gold} />
              <Text style={styles.paymentOptionText}>فيزا</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption} onPress={() => { if(!currentUser) { setShowAuthModal(true); setShowOrderModal(false); showToast('سجّل دخول أولاً'); return; } setShowOrderModal(false); setShowCustomerModal(true); }}>
              <Ionicons name="cash" size={24} color={COLORS.gold} />
              <Text style={styles.paymentOptionText}>الدفع عند الاستلام</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowOrderModal(false)}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showCustomerModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>تأكيد الطلب</Text>
            <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>مرحباً {currentUser?.name || 'ضيف'}! اطلب الآن.</Text>
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={async () => { 
              let phoneNum = currentUser?.phone || customerPhone;
              console.log('Phone number for order:', phoneNum, 'from user:', currentUser?.phone);
              if (!phoneNum || phoneNum === '00000000') {
                showToast('❌ يرجى إدخال رقم الهاتف');
                return;
              }
              const name = currentUser?.name || customerName || 'ضيف';
              try { 
                let token = '';
                try { token = await messaging().getToken(); } catch(e) { console.log('No token'); }
                await firestore().collection('orders').add({ 
                  userId: currentUser?.uid || null, 
                  userName: name, 
                  name, 
                  phone: phoneNum, 
                  fcmToken: token || null,
                  items: cartItems.map(i => ({name: i.name, price: i.price, finalPrice: i.finalPrice || i.price, selectedOptions: i.selectedOptions || []})), 
                  total: getCartTotal(), 
                  status: 'pending', 
                  createdAt: new Date().toISOString() 
                }); 
                showToast('✅ تم حفظ الطلب!' + (token ? ' ✓' : ' ✗'));
              } catch(e) { showToast('تم تأكيد الطلب!'); } 
              try {
                await registerFCMToken(phoneNum);
              } catch(e) {
                console.log('Token reg error:', e);
              }
              setShowCustomerModal(false); setCartItems([]); setCartCount(0); setCartTotal(0); setCustomerName(''); setCustomerPhone(''); 
            }}>
              <Text style={styles.confirmOrderBtnText}>تأكيد الطلب</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCustomerModal(false)}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderPosts = () => (
    <View style={styles.page}>
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersTitleCentered}>المنشورات</Text>
        <Text style={styles.ordersSubCentered}>تابع جديد عروضنا ومقالاتنا</Text>
      </View>
      {isAdmin && (
        <TouchableOpacity style={styles.createPostBtn} onPress={() => setShowCreatePost(true)}>
          <Ionicons name="add-circle" size={22} color="#000" />
          <Text style={styles.createPostBtnText}>إنشاء منشور جديد</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <Text style={styles.emptyOrdersText}>لا توجد منشورات</Text>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDesc}>{post.desc}</Text>
              <Text style={styles.postDate}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('ar-SA') : ''}</Text>
              {isAdmin && (
                <TouchableOpacity style={styles.deletePostBtn} onPress={() => {
                  Alert.alert(
                    'حذف المنشور',
                    'هل أنت متأكد من حذف هذا المنشور؟',
                    [
                      { text: 'إلغاء', onPress: () => {} },
                      { text: 'حذف', onPress: async () => {
                        try {
                          await firestore().collection('posts').doc(post.id).delete();
                          showToast('تم حذف المنشور');
                        } catch(e) {
                          showToast('Error: ' + e.message);
                        }
                      }}
                    ]
                  );
                }}>
                  <Ionicons name="trash" size={18} color={COLORS.red} />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {showCreatePost && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>إنشاء منشور جديد</Text>
            <TextInput style={styles.customerInput} placeholder="العنوان" placeholderTextColor="#666" value={newPostTitle} onChangeText={setNewPostTitle} />
            <TextInput style={[styles.customerInput, { height: 80 }]} placeholder="الوصف" placeholderTextColor="#666" value={newPostDesc} onChangeText={setNewPostDesc} multiline />
            <TouchableOpacity style={styles.pickImageBtn} onPress={async () => { const result = await ImagePicker.launchImageLibraryAsync(); if (!result.canceled) { setNewPostImage(result.assets[0].uri); } }}>
              <Ionicons name="image" size={18} color={COLORS.gold} />
              <Text style={styles.pickImageBtnText}>اختر صورة</Text>
            </TouchableOpacity>
            {newPostImage ? <Image source={{ uri: newPostImage }} style={styles.postImagePreview} /> : null}
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={async () => { if(newPostTitle && newPostDesc) { try { await firestore().collection('posts').add({ title: newPostTitle, desc: newPostDesc, image: newPostImage, createdAt: new Date().toISOString() }); showToast('✅ تم إنشاء المنشور!'); try { const usersSnapshot = await firestore().collection('users').get(); const tokens = usersSnapshot.docs.map(doc => doc.data().token); console.log('Found tokens:', tokens.length); if (tokens.length > 0) { const response = await fetch('https://superresturantb-production.up.railway.app/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokens: tokens, title: 'منشور جديد!', body: newPostTitle }) }); const result = await response.json(); console.log('Send result:', result); showToast(result.success ? `📢 تم إرسال!` : `❌ فشل: ${result.error || 'خطأ'}`); } else { showToast('لا توجد tokens'); } } catch(e) { console.log('Notification error:', e.message); Alert.alert('Error', e.message); } } catch(e) { showToast('Error: ' + e.message); } setShowCreatePost(false); setNewPostTitle(''); setNewPostDesc(''); setNewPostImage(''); } else { showToast('املأ جميع الحقول'); } }}>
              <Text style={styles.confirmOrderBtnText}>نشر</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCreatePost(false)}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
)}

      {editingMenuItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>تعديل الصنف</Text>
            <TextInput style={styles.menuMgmtInput} placeholder="اسم الصنف" placeholderTextColor="#666" value={editItemName || editingMenuItem.name} onChangeText={(text) => { setEditItemName(text); setEditingMenuItem({ ...editingMenuItem, name: text }); }} />
            <TextInput style={styles.menuMgmtInput} placeholder="الوصف" placeholderTextColor="#666" value={editItemDesc || editingMenuItem.desc} onChangeText={(text) => { setEditItemDesc(text); setEditingMenuItem({ ...editingMenuItem, desc: text }); }} />
            <TextInput style={styles.menuMgmtInput} placeholder="السعر" placeholderTextColor="#666" keyboardType="numeric" value={String(editItemPrice || editingMenuItem.price)} onChangeText={(text) => { setEditItemPrice(text); setEditingMenuItem({ ...editingMenuItem, price: parseFloat(text) || 0 }); }} />
            <Text style={[styles.menuMgmtTitle, { fontSize: 14, marginTop: 8 }]}>الإضافات</Text>
            {editingMenuItem.options?.map((opt, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <TextInput style={[styles.menuMgmtInput, { flex: 1, marginBottom: 0 }]} placeholder="اسم الإضافة" placeholderTextColor="#666" value={opt.name} onChangeText={(text) => { const newOpts = [...editingMenuItem.options]; newOpts[idx] = { ...opt, name: text }; setEditingMenuItem({ ...editingMenuItem, options: newOpts }); }} />
                <TextInput style={[styles.menuMgmtInput, { width: 60, marginBottom: 0 }]} placeholder="سعر" placeholderTextColor="#666" keyboardType="numeric" value={String(opt.price || 0)} onChangeText={(text) => { const newOpts = [...editingMenuItem.options]; newOpts[idx] = { ...opt, price: parseFloat(text) || 0 }; setEditingMenuItem({ ...editingMenuItem, options: newOpts }); }} />
                <TouchableOpacity onPress={() => { const newOpts = editingMenuItem.options.filter((_, i) => i !== idx); setEditingMenuItem({ ...editingMenuItem, options: newOpts }); }} style={{ padding: 8 }}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={async () => { try { await firestore().collection('menu').doc(editingMenuItem.id).update({ name: editingMenuItem.name, desc: editingMenuItem.desc, price: editingMenuItem.price, options: editingMenuItem.options || [] }); showToast('✅ تم التحديث!'); } catch(e) { showToast('Error: ' + e.message); } setEditingMenuItem(null); setEditItemName(''); setEditItemDesc(''); setEditItemPrice(''); }}>
              <Text style={styles.confirmOrderBtnText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setEditingMenuItem(null)}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {editingItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>تعديل الصنف</Text>
            <TextInput style={styles.menuMgmtInput} placeholder="اسم الصنف" placeholderTextColor="#666" value={editingItem.name} onChangeText={(text) => setEditingItem({ ...editingItem, name: text })} />
            <TextInput style={styles.menuMgmtInput} placeholder="الوصف" placeholderTextColor="#666" value={editingItem.desc} onChangeText={(text) => setEditingItem({ ...editingItem, desc: text })} />
            <TextInput style={styles.menuMgmtInput} placeholder="السعر" placeholderTextColor="#666" keyboardType="numeric" value={String(editingItem.price)} onChangeText={(text) => setEditingItem({ ...editingItem, price: text })} />
            <Text style={[styles.menuMgmtTitle, { fontSize: 14, marginTop: 8 }]}>الإضافات</Text>
            {editingItem.options?.map((opt, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <TextInput style={[styles.menuMgmtInput, { flex: 1, marginBottom: 0 }]} placeholder="اسم الإضافة" placeholderTextColor="#666" value={opt.name} onChangeText={(text) => { const newOpts = [...editingItem.options]; newOpts[idx] = { ...opt, name: text }; setEditingItem({ ...editingItem, options: newOpts }); }} />
                <TextInput style={[styles.menuMgmtInput, { width: 60, marginBottom: 0 }]} placeholder="سعر" placeholderTextColor="#666" keyboardType="numeric" value={String(opt.price || 0)} onChangeText={(text) => { const newOpts = [...editingItem.options]; newOpts[idx] = { ...opt, price: parseFloat(text) || 0 }; setEditingItem({ ...editingItem, options: newOpts }); }} />
                <TouchableOpacity onPress={() => { const newOpts = editingItem.options.filter((_, i) => i !== idx); setEditingItem({ ...editingItem, options: newOpts }); }} style={{ padding: 8 }}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={updateMenuItem}>
              <Text style={styles.confirmOrderBtnText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setEditingItem(null)}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderMenuManagement = () => {
    const allMenuItems = menuFromDB.length > 0 ? menuFromDB : menuData;
    return (
      <View style={styles.page}>
        <View style={styles.ordersHeader}>
          <Text style={styles.ordersTitle}>إدارة القائمة</Text>
          <TouchableOpacity onPress={() => setActiveTab('admin')}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.menuMgmtSection}>
            <Text style={styles.menuMgmtTitle}>إضافة صنف جديد</Text>
            <TextInput style={styles.menuMgmtInput} placeholder="اسم الصنف" placeholderTextColor="#666" value={newItemName} onChangeText={setNewItemName} />
            <TextInput style={styles.menuMgmtInput} placeholder="الوصف" placeholderTextColor="#666" value={newItemDesc} onChangeText={setNewItemDesc} />
            <TextInput style={styles.menuMgmtInput} placeholder="السعر" placeholderTextColor="#666" keyboardType="numeric" value={newItemPrice} onChangeText={setNewItemPrice} />
            
            <View style={styles.menuMgmtCatRow}>
              {['burger', 'chicken', 'extras'].map(cat => (
                <TouchableOpacity key={cat} style={[styles.menuMgmtCatBtn, newItemCat === cat && styles.menuMgmtCatBtnActive]} onPress={() => setNewItemCat(cat)}>
                  <Text style={[styles.menuMgmtCatBtnText, newItemCat === cat && styles.menuMgmtCatBtnTextActive]}>
                    {cat === 'burger' ? 'برجر' : cat === 'chicken' ? 'دجاج' : 'إضافات'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.menuMgmtTitle, { fontSize: 14, marginTop: 8 }]}>الإضافات (اختياري)</Text>
            <View style={styles.optionsInputRow}>
              <TextInput style={[styles.menuMgmtInput, { flex: 1 }]} placeholder="اسم الإضافة (مثال: جبنة)" placeholderTextColor="#666" value={newOptionName || ''} onChangeText={(text) => setNewOptionName(text)} />
              <TextInput style={[styles.menuMgmtInput, { width: 70 }]} placeholder="السعر" placeholderTextColor="#666" keyboardType="numeric" value={newOptionPrice || ''} onChangeText={(text) => setNewOptionPrice(text)} />
              <TouchableOpacity style={styles.addOptionBtn} onPress={() => {
                if (newOptionName && newOptionPrice) {
                  setNewItemOptions([...newItemOptions, { name: newOptionName, price: parseInt(newOptionPrice) }]);
                  setNewOptionName('');
                  setNewOptionPrice('');
                }
              }}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            {newItemOptions.length > 0 && (
              <View style={styles.optionsList}>
                {newItemOptions.map((opt, idx) => (
                  <View key={idx} style={styles.optionTag}>
                    <Text style={styles.optionTagText}>{opt.name} +₪{opt.price}</Text>
                    <TouchableOpacity onPress={() => setNewItemOptions(newItemOptions.filter((_, i) => i !== idx))}>
                      <Ionicons name="close" size={14} color="#000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.menuMgmtAddBtn} onPress={addMenuItem}>
              <Text style={styles.menuMgmtAddBtnText}>إضافة</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.adminSectionTitle, { marginTop: 20 }]}>الأصناف الحالية ({allMenuItems.length})</Text>

          {allMenuItems.map((item) => (
            <View key={item.id || item.name} style={styles.menuMgmtItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuMgmtItemName}>{item.name}</Text>
                <Text style={styles.menuMgmtItemPrice}>₪{item.price}</Text>
                {item.options && item.options.length > 0 && (
                  <Text style={styles.menuMgmtItemOptions}>إضافات: {item.options.length}</Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {item.id && (
                  <TouchableOpacity style={styles.menuMgmtDeleteBtn} onPress={() => deleteMenuItem(item.id)}>
                    <Ionicons name="trash" size={18} color={COLORS.red} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAdmin = () => (
    <View style={styles.page}>
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersTitle}>لوحة التحكم</Text>
        <Text style={styles.ordersSub}>إدارة الطلبات</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.adminSectionBtn} onPress={() => setShowMenuManagement(true)}>
          <Ionicons name="restaurant" size={20} color={COLORS.gold} />
          <Text style={styles.adminSectionBtnText}>إدارة القائمة</Text>
        </TouchableOpacity>

        <View style={styles.adminDivider} />

        <Text style={styles.adminSectionTitle}>الطلبات ({adminOrders.length})</Text>
        {adminOrders.length === 0 ? (
          <Text style={styles.emptyOrdersText}>لا توجد طلبات</Text>
        ) : (
          <View style={styles.ordersList}>
            {adminOrders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <Text style={styles.orderItems}>{order.name}</Text>
                  <Text style={{ color: COLORS.gold, fontWeight: '900' }}>₪{order.total}</Text>
                </View>
                <Text style={styles.orderItems}>{order.phone}</Text>
                {order.items && order.items.map((item, i) => (
                  <View key={i}>
                    <Text style={styles.orderItemSub}>• {item.name} - ₪{item.price || item.finalPrice}</Text>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <Text style={{ color: COLORS.gold, fontSize: 11, marginLeft: 10 }}>
                        + {item.selectedOptions.map(o => o.name).join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
                  <TextInput 
                    style={{ backgroundColor: '#222', color: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, width: 60, textAlign: 'center', fontSize: 14 }}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={orderPrepTimes[index] || ''}
                    onChangeText={(val) => setOrderPrepTimes({...orderPrepTimes, [index]: val})}
                  />
                  <Text style={{ color: '#888', fontSize: 12 }}>دقيقة</Text>
                  <TouchableOpacity style={styles.whatsappBtn} onPress={async () => { 
                  const time = orderPrepTimes[index] || 25; 
                  let timeWord = 'دقائق';
                  if (parseInt(time) === 1) timeWord = 'دقيقة';
                  else if (parseInt(time) === 2) timeWord = 'دقيقتين';
                  else if (parseInt(time) >= 3 && parseInt(time) <= 10) timeWord = 'دقائق';
                  else timeWord = 'دقيقة';
                  // Send push notification instead of WhatsApp
                  const body = `طلبك سيتم تجهيزه خلال ${time} ${timeWord} - سوبر برجر 🍔`;
                  try {
                    const res = await fetch('https://superresturantb-production.up.railway.app/send-notification', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: order.fcmToken || null, title: '📦 سوبر برجر', body })
                    });
                    const data = await res.json();
                    showToast(data.success ? '✅ تم إرسال الإشعار!' : '❌ فشل');
                  } catch(e) {
                    showToast('Error: ' + e.message);
                  }
                }}>
                    <Text style={styles.whatsappBtnText}>إرسال</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#ff4444', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginLeft: 8 }} onPress={() => { 
                    setConfirmData({ order, action: 'end' });
                  }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>إنهاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {showAdminNotification && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>تم إشعار الزبون!</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'menu' && renderMenu()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'admin' && renderAdmin()}
      {activeTab === 'menuMgmt' && renderMenuManagement()}

      {toast !== '' && <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
      {notifData && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#1c1810', borderWidth: 2, borderColor: COLORS.gold }]}>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Ionicons name="notifications" size={50} color={COLORS.gold} />
              <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.gold, marginTop: 10 }}>{notifData.title}</Text>
              <Text style={{ fontSize: 16, color: '#fff', marginTop: 15, textAlign: 'center' }}>{notifData.body}</Text>
            </View>
            <TouchableOpacity style={[styles.confirmOrderBtn, { marginTop: 20 }]} onPress={() => setNotifData(null)}>
              <Text style={styles.confirmOrderBtnText}>تم</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {confirmData && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#1c1810', borderWidth: 2, borderColor: COLORS.gold }]}>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Ionicons name="help-circle" size={50} color={COLORS.gold} />
              <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.gold, marginTop: 10 }}>إنهاء الطلب</Text>
              <Text style={{ fontSize: 16, color: '#fff', marginTop: 15, textAlign: 'center' }}>?سيتم إرسال إشعار لـ {confirmData.order.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#333', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }} onPress={() => setConfirmData(null)}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#ff4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }} onPress={async () => {
                setConfirmData(null);
                try { 
                  if (!confirmData.order.fcmToken) {
                    showToast('❌ لا يوجد token لهذا الطلب');
                    return;
                  }
                  await firestore().collection('orders').doc(confirmData.order.id).delete(); 
                  setAdminOrders(adminOrders.filter(o => o.id !== confirmData.order.id));
                  const notifRes = await fetch('https://superresturantb-production.up.railway.app/send-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: confirmData.order.fcmToken, title: 'سوبر برجر', body: 'طلبك جاهز! تعال استلمه الآن 🍔' })
                  });
                  const notifData_result = await notifRes.json();
                  showToast(notifData_result.success ? '✅ تم إرسال الإشعار!' : '❌ فشل');
                } catch(e) { showToast('Error: ' + e.message); }
              }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>نعم</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'home' && styles.navBtnActive]} onPress={() => setActiveTab('home')}>
          <Ionicons name="home" size={24} color={activeTab === 'home' ? COLORS.gold : COLORS.textMuted} />
          <Text style={[styles.navBtnText, activeTab === 'home' && styles.navBtnTextActive]}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'menu' && styles.navBtnActive]} onPress={() => setActiveTab('menu')}>
          <MaterialCommunityIcons name="food-variant" size={24} color={activeTab === 'menu' ? COLORS.gold : COLORS.textMuted} />
          <Text style={[styles.navBtnText, activeTab === 'menu' && styles.navBtnTextActive]}>القائمة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'orders' && styles.navBtnActive]} onPress={() => setActiveTab('orders')}>
          <Ionicons name="cart" size={24} color={activeTab === 'orders' ? COLORS.gold : COLORS.textMuted} />
          <Text style={[styles.navBtnText, activeTab === 'orders' && styles.navBtnTextActive]}>السلة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'posts' && styles.navBtnActive]} onPress={() => setActiveTab('posts')}>
          <Ionicons name="newspaper" size={24} color={activeTab === 'posts' ? COLORS.gold : COLORS.textMuted} />
          <Text style={[styles.navBtnText, activeTab === 'posts' && styles.navBtnTextActive]}>المنشورات</Text>
        </TouchableOpacity>
        {isAdmin && (
          <>
            <TouchableOpacity style={[styles.navBtn, activeTab === 'menuMgmt' && styles.navBtnActive]} onPress={() => setActiveTab('menuMgmt')}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={activeTab === 'menuMgmt' ? COLORS.gold : COLORS.textMuted} />
              <Text style={[styles.navBtnText, activeTab === 'menuMgmt' && styles.navBtnTextActive]}>المطعم</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navBtn, activeTab === 'admin' && styles.navBtnActive]} onPress={() => setActiveTab('admin')}>
              <Ionicons name="settings" size={24} color={activeTab === 'admin' ? COLORS.gold : COLORS.textMuted} />
              <Text style={[styles.navBtnText, activeTab === 'admin' && styles.navBtnTextActive]}>الطلبات</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {showMenuModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.menuOption} onPress={() => { setShowMenuModal(false); setActiveTab('home'); }}>
              <Ionicons name="home" size={20} color={COLORS.gold} />
              <Text style={styles.menuOptionText}>الرئيسية</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption} onPress={() => { setShowMenuModal(false); setActiveTab('menu'); }}>
              <MaterialCommunityIcons name="food-variant" size={20} color={COLORS.gold} />
              <Text style={styles.menuOptionText}>القائمة</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuOption} onPress={() => { setShowMenuModal(false); setShowAuthModal(true); }}>
              <Ionicons name="person" size={20} color={COLORS.gold} />
              <Text style={styles.menuOptionText}>{currentUser ? `مرحباً ${currentUser.name}` : 'دخول / تسجيل'}</Text>
            </TouchableOpacity>
            {currentUser && (
              <TouchableOpacity style={styles.menuOption} onPress={() => { handleLogout(); setShowMenuModal(false); }}>
                <Ionicons name="log-out" size={20} color={COLORS.red} />
                <Text style={styles.menuOptionText}>تسجيل خروج</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowMenuModal(false)}>
              <Text style={styles.modalCloseBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showOptionsModal && selectedMenuItem && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]}>
            <Text style={styles.modalTitle}>اختر الإضافات</Text>
            <Text style={{ color: COLORS.gold, textAlign: 'center', marginBottom: 16 }}>{selectedMenuItem.name}</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {selectedMenuItem.options.map((opt, idx) => {
                const isSelected = selectedOptions.some(o => o.name === opt.name);
                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedOptions(selectedOptions.filter(o => o.name !== opt.name));
                      } else {
                        setSelectedOptions([...selectedOptions, opt]);
                      }
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={22} color={isSelected ? COLORS.gold : COLORS.textMuted} />
                      <Text style={[styles.optionItemText, isSelected && styles.optionItemTextSelected]}>{opt.name}</Text>
                    </View>
                    <Text style={styles.optionItemPrice}>+₪{opt.price}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.optionsTotalRow}>
              <Text style={styles.optionsTotalLabel}>المجموع:</Text>
              <Text style={styles.optionsTotalPrice}>₪{selectedMenuItem.price + selectedOptions.reduce((s, o) => s + o.price, 0)}</Text>
            </View>
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={confirmAddWithOptions}>
              <Text style={styles.confirmOrderBtnText}>إضافة للسلة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => { setShowOptionsModal(false); setSelectedOptions([]); setSelectedMenuItem(null); }}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showAuthModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{isLoginMode ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
            
            {!isLoginMode && (
              <>
                <TextInput style={styles.customerInput} placeholder="الاسم" placeholderTextColor="#666" value={authName} onChangeText={setAuthName} />
                <TextInput style={styles.customerInput} placeholder="رقم الهاتف" placeholderTextColor="#666" value={authPhone} onChangeText={setAuthPhone} keyboardType="phone-pad" />
              </>
            )}
            <TextInput style={styles.customerInput} placeholder="البريد الإلكتروني" placeholderTextColor="#666" value={authEmail} onChangeText={setAuthEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.customerInput} placeholder="كلمة المرور" placeholderTextColor="#666" value={authPassword} onChangeText={setAuthPassword} secureTextEntry />
            
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={isLoginMode ? handleLogin : handleRegister}>
              <Text style={styles.confirmOrderBtnText}>{isLoginMode ? 'دخول' : 'تسجيل'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setIsLoginMode(!isLoginMode)}>
              <Text style={{ color: COLORS.gold, textAlign: 'center' }}>
                {isLoginMode ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخول'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAuthModal(false)}>
              <Text style={styles.modalCloseBtnText}>إغلاق</Text>
            </TouchableOpacity>

            <View style={{ borderTopWidth: 1, borderTopColor: '#333', marginTop: 16, paddingTop: 16 }}>
              <TouchableOpacity style={{ backgroundColor: '#222', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.gold }} onPress={() => { setShowAuthModal(false); setTimeout(() => setPhoneStep('enterPhone'), 300); }}>
                <Text style={{ color: COLORS.gold, textAlign: 'center', fontWeight: '700' }}>تسجيل برقم الهاتف</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {phoneStep === 'enterPhone' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📱 تسجيل برقم الهاتف</Text>
            <Text style={{ color: '#888', textAlign: 'center', marginBottom: 16 }}>سيصلك كود عبر SMS</Text>
            <TextInput 
              style={styles.customerInput} 
              placeholder="رقم الهاتف (مثال: 0599123456)" 
              placeholderTextColor="#666" 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
              keyboardType="phone-pad" 
            />
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={sendVerificationCode}>
              <Text style={styles.confirmOrderBtnText}>إرسال كود التحقق</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPhoneStep('success')}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {phoneStep === 'enterCode' && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🔢 أدخل الكود</Text>
            <Text style={{ color: '#888', textAlign: 'center', marginBottom: 16 }}>الكود المرسل لرقمك</Text>
            <TextInput 
              style={[styles.customerInput, { fontSize: 24, textAlign: 'center', letterSpacing: 8 }]} 
              placeholder="000000" 
              placeholderTextColor="#666" 
              value={verificationCode} 
              onChangeText={setVerificationCode} 
              keyboardType="number-pad" 
              maxLength={6}
            />
            <TouchableOpacity style={styles.confirmOrderBtn} onPress={verifyCode}>
              <Text style={styles.confirmOrderBtnText}>تحقق</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => { setPhoneStep('enterPhone'); setVerificationCode(''); }}>
              <Text style={{ color: COLORS.gold, textAlign: 'center' }}>إعادة إرسال الكود</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPhoneStep('success')}>
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  page: { flex: 1, backgroundColor: COLORS.bg },
  goldText: { color: COLORS.gold },
  homeHeader: { position: 'absolute', top: 70, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, paddingVertical: 8 },
  logoBox: { flexDirection: 'row', alignItems: 'center' },
  logoImg: { width: 30, height: 30, resizeMode: 'contain', marginRight: 8 },
  logoName: { fontSize: 18, fontWeight: '900', color: COLORS.gold },
  headerIcons: { flexDirection: 'row', gap: 10 },
  hicon: { width: 36, height: 36, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  hero: { height: 240, position: 'relative', justifyContent: 'flex-end', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  heroImage: { position: 'absolute', top: -40, left: 0, right: 0, bottom: -40, width: '100%', height: '120%' },
  heroText: { position: 'absolute', bottom: 20, right: 20, left: 20 },
  heroTag: { backgroundColor: COLORS.gold, color: '#000', fontWeight: '900', fontSize: 10, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 6 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 36 },
  heroSub: { fontSize: 12, color: '#ccc', marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2a2418', borderRadius: 16, padding: 12, alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statVal: { fontSize: 16, fontWeight: '900', color: COLORS.gold },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  gallerySection: { marginHorizontal: 16, marginTop: 20 },
  galleryTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 12, textAlign: 'center' },
  galleryLineWrap: { alignItems: 'center', marginBottom: 16 },
  galleryLine: { width: 100, height: 2, backgroundColor: COLORS.gold, borderRadius: 1 },
  galleryRow: { flexDirection: 'row', gap: 10, height: 200 },
  galleryMain: { flex: 2 },
  galleryMainImg: { width: '100%', height: '100%', borderRadius: 16 },
  gallerySmallCol: { flex: 1, gap: 10 },
  gallerySmall: { flex: 1 },
  galleryPlaceholder: { flex: 1, backgroundColor: '#1c1810', borderRadius: 16, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  gallerySmallImg: { width: '100%', height: '100%', borderRadius: 16 },
  galleryPlaceholderSmall: { width: '100%', height: '100%', backgroundColor: '#1c1810', borderRadius: 16, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  couponCard: { marginHorizontal: 16, marginTop: 20, flexDirection: 'row', backgroundColor: '#1c1810', borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold, overflow: 'hidden', position: 'relative' },
  couponLeft: { flex: 2, padding: 20 },
  couponBadge: { backgroundColor: COLORS.gold, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 12 },
  couponBadgeText: { fontSize: 28, fontWeight: '900', color: '#000' },
  couponBadgeOff: { fontSize: 12, fontWeight: '700', color: '#000', textAlign: 'center' },
  couponTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  couponDesc: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },
  couponDivider: { height: 1, backgroundColor: '#333', marginBottom: 12 },
  couponCodeLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 6 },
  couponCodeBox: { backgroundColor: COLORS.bg, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gold, paddingHorizontal: 12, paddingVertical: 8 },
  couponCode: { fontSize: 12, fontWeight: '900', color: COLORS.gold, letterSpacing: 1 },
  couponRight: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(245,197,24,0.1)', paddingVertical: 20 },
  couponCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.gold },
  couponDashed: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, borderLeftWidth: 2, borderLeftColor: COLORS.gold, borderStyle: 'dashed' },
  postsPreview: { marginHorizontal: 16, marginTop: 20 },
  postsPreviewCard: { backgroundColor: '#1c1810', borderRadius: 16, borderWidth: 1, borderColor: '#333', overflow: 'hidden', flexDirection: 'row' },
  postsPreviewImg: { width: 100, height: 120, backgroundColor: '#2a2418', justifyContent: 'center', alignItems: 'center' },
  postsPreviewContent: { flex: 1, padding: 12 },
  postsPreviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  postsPreviewUsername: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  postsPreviewDesc: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16, marginBottom: 8 },
  postsPreviewStats: { flexDirection: 'row', gap: 16 },
  postsPreviewStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postsPreviewStatText: { fontSize: 12, color: COLORS.textMuted },
  postsPreviewText: { marginTop: 16, alignItems: 'center' },
  postsPreviewTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 4 },
  postsPreviewSub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  postsSection: { marginHorizontal: 16, marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  postsPhone: { width: 90, height: 150, backgroundColor: '#1c1810', borderRadius: 16, borderWidth: 2, borderColor: COLORS.gold, padding: 6, justifyContent: 'center', alignItems: 'center' },
  postsPhoneScreen: { width: '100%', height: '100%', backgroundColor: '#1c1810', borderRadius: 10, overflow: 'hidden', padding: 6 },
  postsPhoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  postsPhoneAvatar: { width: 24, height: 24, borderRadius: 12, resizeMode: 'contain' },
  postsPhoneName: { width: 40, height: 6, backgroundColor: '#333', borderRadius: 3 },
  postsPhoneImage: { width: '100%', height: 70, backgroundColor: COLORS.gold, borderRadius: 6, marginBottom: 6, justifyContent: 'center', alignItems: 'center' },
  postsPhoneImgRow: { flexDirection: 'row', gap: 8 },
  postsPhoneActions: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  postsPhoneAction: { width: 16, height: 16, backgroundColor: '#1c1810', borderRadius: 4 },
  phoneActionRight: { width: 16, height: 16, backgroundColor: '#1c1810', borderRadius: 4, marginLeft: 'auto' },
  postsPhoneLikes: { marginTop: 2 },
  postsPhoneLikesText: { fontSize: 8, color: '#1c1810', fontWeight: '600' },
  postsText: { flex: 1, alignItems: 'flex-end' },
  postsTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 12 },
  postsSub: { fontSize: 13, color: COLORS.gold, textAlign: 'right' },
  postsBtn: { backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  postsBtnText: { fontSize: 13, fontWeight: '800', color: '#000' },
  premiumCoupon: { marginHorizontal: 16, marginTop: 20, backgroundColor: COLORS.gold, borderRadius: 24, padding: 24, borderWidth: 2, borderColor: COLORS.goldDark, position: 'relative', overflow: 'hidden', shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  premiumCouponGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24 },
  premiumCouponContent: { alignItems: 'flex-end', zIndex: 1 },
  premiumCouponHeadline: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 6, letterSpacing: 0.5 },
  premiumCouponSub: { fontSize: 14, color: '#fff', marginBottom: 16, fontWeight: '600' },
  premiumCouponCodeWrap: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  premiumCouponCode: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  premiumCopyBtn: { padding: 4 },
  premiumCouponDecor1: { position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  premiumCouponDecor2: { position: 'absolute', bottom: -15, left: 20, width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  yellowCoupon: { marginHorizontal: 16, marginTop: 20, backgroundColor: COLORS.gold, borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden', borderWidth: 2, borderColor: '#D4A017' },
  yellowCouponDecor1: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 50 },
  yellowCouponDecor2: { position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40 },
  yellowCouponContent: { alignItems: 'flex-end', zIndex: 1 },
  yellowCouponHeadline: { fontSize: 26, fontWeight: '900', color: '#1c1810', marginBottom: 6 },
  yellowCouponRow: { flexDirection: 'row' },
  yellowCouponSub: { fontSize: 12, color: '#1c1810', opacity: 0.8, marginBottom: 8, textAlign: 'right' },
  yellowCouponCode: { fontSize: 14, fontWeight: '900', color: '#1c1810', letterSpacing: 1 },
  yellowCouponCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  copyIconBtn: { padding: 4 },
  contactSection: { marginHorizontal: 16, marginTop: 32 },
  contactCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: '#2a2418', overflow: 'hidden' },
  contactHeader: { alignItems: 'center', marginBottom: 20 },
  contactTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 10 },
  contactLine: { width: 80, height: 2, backgroundColor: COLORS.gold, borderRadius: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 14 },
  contactDivider: { height: 1, backgroundColor: '#2a2418', marginHorizontal: 16 },
  contactIconBox: { width: 44, height: 44, backgroundColor: COLORS.gold, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, alignItems: 'flex-start' },
  contactLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
  contactText: { fontSize: 15, color: '#fff', fontWeight: '600', textAlign: 'right', lineHeight: 22 },
  createPostBtn: { backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, marginBottom: 8, alignSelf: 'flex-end' },
  createPostBtnText: { fontSize: 14, fontWeight: '800', color: '#000' },
  bannerImage: { width: 150, height: 150, resizeMode: 'cover', borderRadius: 15 },
  bannerWrap: { marginLeft: 16, marginTop: 20 },
  whySuperCard: { marginHorizontal: 16, marginTop: 20, backgroundColor: '#1c1810', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' },
  whySuperHeader: { alignItems: 'center', marginBottom: 20 },
  whySuperTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  whySuperLineWrap: { marginTop: 10, alignItems: 'center', width: 120, shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 4 },
  whySuperLine: { height: 2, backgroundColor: COLORS.gold, width: 120, borderRadius: 1 },
  whySuperFeatures: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  whySuperFeature: { alignItems: 'center' },
  whySuperFeatureText: { fontSize: 13, color: COLORS.textMuted, marginTop: 8 },
  whySuperSub: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },
  cop1Container: { marginLeft: 16, marginRight: 16, marginTop: 40, backgroundColor: '#000', borderRadius: 15, padding: 16, paddingTop: 20, borderWidth: 1, borderColor: '#333', position: 'relative', overflow: 'visible' },
  cop1TextWrap: { flex: 1, marginRight: 16 },
  cop1Title: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
  cop1Sub: { fontSize: 12, color: COLORS.gold },
  cop1Image: { position: 'absolute', top: -35, right: 10, width: 100, height: 100, resizeMode: 'contain' },
  sectionTitleCentered: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'center', marginVertical: 16 },
  promoCard: { marginHorizontal: 16, backgroundColor: COLORS.gold, borderRadius: 24, padding: 24, alignItems: 'center', overflow: 'hidden', position: 'relative', borderWidth: 3, borderColor: '#D4A017' },
  promoDisc: { position: 'absolute', left: -50, top: -50, width: 200, height: 200, resizeMode: 'contain' },
  promoShine: { position: 'absolute', top: -50, right: -50, width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 60 },
  promoShape1: { position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 50 },
  promoShape2: { position: 'absolute', top: 10, right: -20, width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 30 },
  promoEmoji: { fontSize: 56, marginBottom: 8 },
  promoTop: { fontSize: 14, fontWeight: '700', color: '#1c1810', marginBottom: 4 },
  promoMain: { fontSize: 18, fontWeight: '900', color: '#1c1810', marginBottom: 12 },
  promoBadgeRow: { flexDirection: 'row', marginBottom: 12 },
  promoBadge: { backgroundColor: '#1c1810', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 8 },
  promoBadgeText: { fontSize: 36, fontWeight: '900', color: COLORS.gold },
  promoSub: { fontSize: 11, fontWeight: '600', color: '#1c1810', marginBottom: 12, textAlign: 'center' },
  promoDecorRow: { flexDirection: 'row', gap: 16 },
  promoDecor: { fontSize: 24 },
  hero2Card: { marginHorizontal: 16, backgroundColor: '#1c1810', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: COLORS.gold, position: 'relative', overflow: 'hidden', marginTop: 20 },
  hero2Badge: { backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6, position: 'absolute', top: -1, right: 20 },
  hero2BadgeText: { fontSize: 14, fontWeight: '900', color: '#000' },
  hero2Title: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 16, marginBottom: 4 },
  hero2Sub: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
  hero2CodeBox: { backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.gold, flexDirection: 'row', alignItems: 'center', gap: 10 },
  hero2CodeLabel: { fontSize: 12, color: COLORS.textMuted },
  hero2Code: { fontSize: 14, fontWeight: '900', color: COLORS.gold },
  hero2Decors: { flexDirection: 'row', gap: 20, marginTop: 16 },
  whySuperSection: { paddingHorizontal: 16, alignItems: 'center' },
  whySuperImage: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10 },
  featuresRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 20, marginBottom: 16 },
  featureCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 14, alignItems: 'center' },
  featureTitle: { fontSize: 12, fontWeight: '900', color: '#fff', marginTop: 8, textAlign: 'center' },
  featureSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  orderNowCard: { marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: '#2a2418', marginBottom: 16, marginTop: 20, overflow: 'hidden' },
  orderNowBgIcon: { position: 'absolute', opacity: 0.1 },
  orderNowText: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  orderNowBtn: { backgroundColor: COLORS.gold, borderRadius: 30, paddingHorizontal: 24, paddingVertical: 8 },
  orderNowBtnText: { fontSize: 12, fontWeight: '900', color: '#000' },
  searchBarInline: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30, paddingHorizontal: 16 },
  searchBarInlineInput: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 6 },
  searchResultsCard: { position: 'absolute', top: 120, left: 16, right: 16, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.goldDark, padding: 16, zIndex: 20, maxHeight: 300 },
  searchResultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  searchCloseBtn: { width: 28, height: 28, backgroundColor: COLORS.gold, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  searchResultsTitle: { fontSize: 16, fontWeight: '900', color: '#fff', textAlign: 'center' },
  searchResultsScroll: { maxHeight: 220 },
  searchResultItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: 12, padding: 12, marginBottom: 8 },
  searchResultName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  searchResultPrice: { fontSize: 14, fontWeight: '900', color: COLORS.gold },
  notifCard: { position: 'absolute', top: 70, right: 16, backgroundColor: 'rgba(28,24,16,0.9)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, zIndex: 20, width: 250 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  notifTitle: { fontSize: 16, fontWeight: '900', color: '#fff' },
  notifCloseBtn: { width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  notifEmpty: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  postCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12, marginHorizontal: 16 },
  postTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 6 },
  postDesc: { fontSize: 13, color: COLORS.textMuted },
  postImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  postDate: { fontSize: 11, color: COLORS.gold, marginTop: 8 },
  deletePostBtn: { position: 'absolute', top: 12, right: 12, padding: 8 },
  couponCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2a2418', borderRadius: 16, padding: 16 },
  couponTitle: { fontSize: 14, fontWeight: '900', color: '#fff', marginBottom: 12, textAlign: 'right' },
  couponInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  couponInput: { flex: 1, backgroundColor: COLORS.bg, borderWidth: 1.5, borderColor: '#333', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 14, textAlign: 'right' },
  couponInputError: { borderColor: COLORS.red },
  couponInputSuccess: { borderColor: COLORS.green },
  couponBtn: { backgroundColor: COLORS.gold, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10 },
  couponBtnApplied: { backgroundColor: COLORS.green },
  couponBtnText: { fontSize: 14, fontWeight: '900', color: '#000' },
  couponSuccessText: { fontSize: 12, fontWeight: '700', color: COLORS.green, marginTop: 10, textAlign: 'right' },
  catsScroll: { paddingHorizontal: 16, marginBottom: 14 },
  catPill: { flexShrink: 0, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, borderWidth: 1.5, borderColor: '#333', marginRight: 8, backgroundColor: COLORS.card },
  catPillActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  catPillText: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textAlign: 'center' },
  catPillTextActive: { color: '#000' },
  menuList: { paddingHorizontal: 16, gap: 12, paddingBottom: 20 },
  menuCouponCard: { margin: 16, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.gold },
  menuCouponTitle: { fontSize: 18, fontWeight: '700', color: COLORS.gold, textAlign: 'center', marginBottom: 14 },
  menuCouponRow: { flexDirection: 'row', gap: 10 },
  menuCouponInput: { flex: 1, backgroundColor: '#111', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  menuCouponBtn: { backgroundColor: COLORS.gold, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  menuCouponBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  menuCouponSuccess: { fontSize: 13, color: COLORS.green, textAlign: 'center', marginTop: 10 },
  menuCouponError: { fontSize: 13, color: COLORS.red, textAlign: 'center', marginTop: 10 },
  menuCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2a2418', borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, flexWrap: 'wrap' },
  menuCardHighlighted: { backgroundColor: '#2a2410', borderWidth: 2, borderColor: COLORS.gold, borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  menuCardImage: { width: 80, height: 80, borderRadius: 12, resizeMode: 'cover' },
  menuCardInfo: { flex: 1, alignItems: 'flex-end' },
  menuCardName: { fontSize: 15, fontWeight: '900', color: '#fff' },
  menuCardDesc: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, textAlign: 'right' },
  menuCardExpanded: { backgroundColor: COLORS.bg, borderRadius: 8, padding: 8, marginTop: 8 },
  menuCardDescExpanded: { fontSize: 12, color: COLORS.textMuted, textAlign: 'right', lineHeight: 18 },
  menuCardBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: COLORS.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  menuCardBadgeNew: { backgroundColor: COLORS.red },
  menuCardBadgeText: { fontSize: 9, fontWeight: '900', color: '#000' },
  menuCardFooter: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  menuCardPrice: { fontSize: 17, fontWeight: '900', color: COLORS.gold },
  addBtn: { width: 30, height: 30, backgroundColor: COLORS.gold, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 20, fontWeight: '700', color: '#000' },
  menuPageHeader: { padding: 16, paddingTop: 50 },
  menuPageTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 12, textAlign: 'center' },
  menuSearch: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#333', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 10 },
  searchInput: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 14, textAlign: 'right' },
  ordersHeader: { padding: 20, paddingTop: 50, alignItems: 'flex-end' },
  ordersTitle: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center' },
  ordersSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  orderTabs: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  orderTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#333' },
  orderTabActive: { borderBottomColor: COLORS.gold },
  orderTabText: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
  orderTabTextActive: { color: COLORS.gold },
  ordersList: { paddingHorizontal: 16, gap: 14, paddingBottom: 20 },
  orderCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2a2418', borderRadius: 16, padding: 14 },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 13, fontWeight: '900', color: COLORS.gold },
  orderStatus: { fontSize: 11, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusPreparing: { backgroundColor: 'rgba(245,197,24,0.15)', color: COLORS.gold },
  statusDelivered: { backgroundColor: 'rgba(39,174,96,0.15)', color: COLORS.green },
  statusCancelled: { backgroundColor: 'rgba(231,76,60,0.15)', color: COLORS.red },
  orderItems: { fontSize: 13, color: COLORS.textMuted, textAlign: 'right', lineHeight: 22 },
  orderItemSub: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#2a2418' },
  orderDate: { fontSize: 11, color: COLORS.textMuted },
  orderTotal: { fontSize: 16, fontWeight: '900', color: COLORS.gold },
  reorderBtn: { backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  reorderBtnText: { fontSize: 12, fontWeight: '900', color: '#000' },
  emptyOrdersText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 40 },
  customerInput: { backgroundColor: '#1c1810', borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 12, color: '#fff', fontSize: 14, marginBottom: 12, textAlign: 'right' },
  completeOrderBtn: { backgroundColor: COLORS.green, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  completeOrderBtnText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  confirmOrderBtn: { backgroundColor: COLORS.gold, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  adminPrepRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  adminPrepInput: { flex: 1, backgroundColor: '#111', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#333', textAlign: 'center' },
  adminPrepBtn: { backgroundColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  adminPrepBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  whatsappBtn: { backgroundColor: '#25D366', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  whatsappBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  pickImageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 12, paddingVertical: 10, marginTop: 12 },
  verifySubText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 16, marginTop: -10 },
  verifyCodeInput: { backgroundColor: '#111', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, color: '#fff', fontSize: 24, fontWeight: '900', textAlign: 'center', borderWidth: 1, borderColor: '#333', marginBottom: 16, letterSpacing: 8 },
  pickImageBtnText: { fontSize: 14, color: COLORS.gold },
  postImagePreview: { width: '100%', height: 150, borderRadius: 12, marginTop: 10, resizeMode: 'cover' },
  confirmOrderBtnText: { fontSize: 16, fontWeight: '900', color: '#000' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 300 },
  modalCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 20, padding: 24, width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 20 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1c1810', borderWidth: 1, borderColor: '#2a2418', borderRadius: 12, padding: 14, marginBottom: 12 },
  paymentOptionText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalCloseBtn: { alignItems: 'center', marginTop: 10 },
  modalCloseBtnText: { fontSize: 14, color: COLORS.textMuted },
  menuOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2a2418' },
  menuOptionText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  menuDivider: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  cartOverlay: { position: 'absolute', bottom: 70, left: 16, right: 16, zIndex: 50 },
  cartBar: { backgroundColor: COLORS.gold, borderRadius: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 32, elevation: 8 },
  cartBarTotal: { fontSize: 16, fontWeight: '900', color: '#000' },
  cartBarText: { fontSize: 14, fontWeight: '900', color: '#000' },
  cartBarInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartCount: { width: 26, height: 26, backgroundColor: '#000', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  cartCountText: { fontSize: 12, fontWeight: '900', color: COLORS.gold },
  toast: { position: 'absolute', bottom: 150, left: '50%', backgroundColor: COLORS.gold, borderWidth: 1, borderColor: '#000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, zIndex: 200 },
  toastText: { fontSize: 13, fontWeight: '700', color: '#000', whiteSpace: 'nowrap' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, paddingBottom: 8, backgroundColor: '#0e0c0a', borderTopWidth: 1, borderTopColor: '#2a2418', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 },
  navBtn: { alignItems: 'center', paddingVertical: 8 },
  navBtnActive: {},
  navBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginTop: 4 },
  navBtnTextActive: { color: COLORS.gold },
  adminSectionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.gold },
  adminSectionBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  adminSectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.gold, marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  adminDivider: { height: 1, backgroundColor: '#333', marginHorizontal: 16, marginVertical: 16 },
  galleryEditLabel: { fontSize: 14, fontWeight: '700', color: COLORS.gold, marginBottom: 8, marginTop: 12 },
  galleryEditImgBox: { height: 100, backgroundColor: '#1c1810', borderRadius: 12, borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  galleryEditImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  galleryEditText: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#1c1810', borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  optionItemSelected: { borderColor: COLORS.gold, backgroundColor: '#2a2410' },
  optionItemText: { fontSize: 14, color: COLORS.textMuted },
  optionItemTextSelected: { color: '#fff', fontWeight: '700' },
  optionItemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.gold },
  optionsTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16, paddingHorizontal: 8 },
  optionsTotalLabel: { fontSize: 16, color: '#fff', fontWeight: '700' },
  optionsTotalPrice: { fontSize: 18, color: COLORS.gold, fontWeight: '900' },
  menuMgmtSection: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 20 },
  menuMgmtTitle: { fontSize: 18, fontWeight: '900', color: COLORS.gold, marginBottom: 16 },
  menuMgmtInput: { backgroundColor: '#111', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  menuMgmtCatRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  menuMgmtCatBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  menuMgmtCatBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  menuMgmtCatBtnText: { fontSize: 13, color: COLORS.textMuted },
  menuMgmtCatBtnTextActive: { color: '#000', fontWeight: '700' },
  menuMgmtAddBtn: { backgroundColor: COLORS.gold, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  menuMgmtAddBtnText: { fontSize: 16, fontWeight: '900', color: '#000' },
  menuMgmtItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 10 },
  menuMgmtItemName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  menuMgmtItemPrice: { fontSize: 14, color: COLORS.gold },
  menuMgmtItemOptions: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  menuMgmtDeleteBtn: { padding: 8 },
  menuMgmtEditBtn: { padding: 8 },
  optionsInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addOptionBtn: { width: 44, height: 44, backgroundColor: COLORS.gold, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  optionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  optionTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  optionTagText: { fontSize: 12, color: '#000', fontWeight: '600' },
});
