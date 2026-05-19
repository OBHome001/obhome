/**
 * firebase-config.js  — optimised loader
 * วิธีใช้: โหลดไฟล์นี้ก่อน cms.js ในทุกหน้า
 *
 * 🔒  Firebase Realtime Database Rules:
 * { "rules": { ".read": true, ".write": "auth != null" } }
 *
 * 🔒  Firebase Storage Rules:
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey:            "AIzaSyAalOeCqmQh_vZsy3YHkb6vAvEaAxz4hZo",
  authDomain:        "obhome-ceac3.firebaseapp.com",
  databaseURL:       "https://obhome-ceac3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "obhome-ceac3",
  storageBucket:     "obhome-ceac3.firebasestorage.app",
  messagingSenderId: "282767624357",
  appId:             "1:282767624357:web:58913f546cc7f79732654c",
  measurementId:     "G-LSZD5FKL0Z"
};

(function loadFirebase() {
  const BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload  = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /* ✅ แก้ 1: โหลด app ก่อน แล้วโหลด auth+db พร้อมกัน (แทนรอทีละตัว) */
  loadScript(BASE + 'firebase-app-compat.js')
    .then(() => Promise.all([
      loadScript(BASE + 'firebase-auth-compat.js'),
      loadScript(BASE + 'firebase-database-compat.js'),
    ]))
    .then(() => {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

      const auth = firebase.auth();
      const db   = firebase.database();

      /* ✅ แก้ 2: เปิด LOCAL persistence → auth token ถูก cache ไว้
         ไม่ต้องรอ network ตรวจ login ใหม่ทุกครั้ง */
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      window._cmsAuth = auth;
      window._cmsDB   = db;

      window._firebaseAuth = {
        onAuthStateChanged:         (a, cb)        => a.onAuthStateChanged(cb),
        signOut:                    (a)             => a.signOut(),
        signInWithEmailAndPassword: (a, email, pw) => a.signInWithEmailAndPassword(email, pw),
      };
      window._firebaseDB = {
        ref:    (db, path) => db.ref(path),
        get:    (ref)      => ref.once('value').then(s => ({ exists: () => s.exists(), val: () => s.val() })),
        set:    (ref, val) => ref.set(val),
        update: (ref, val) => ref.update(val),
      };

      /* ✅ แก้ 3: ส่ง event แทน polling ทุก 80ms ใน cms.js */
      window.dispatchEvent(new Event('firebase-ready'));
      console.log('[OB CMS] Firebase ready ✓');
    })
    .catch(err => console.error('[OB CMS] Firebase load error:', err));
})();