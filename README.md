# OB HOME CMS — คู่มือติดตั้งและใช้งาน

## ไฟล์ทั้งหมดที่ได้รับ

```
ob-home-cms/
├── firebase-config.js   ← ตั้งค่า Firebase (แก้ครั้งเดียว)
├── cms.js               ← ระบบ CMS หลัก (ไม่ต้องแก้)
├── admin.html           ← หน้า Login + Dashboard
├── home.html            ← หน้าแรก (เพิ่ม data-cms แล้ว)
└── spc.html             ← หน้าสินค้า SPC (เพิ่ม data-cms แล้ว)
```

> ⚠️ หน้า lath.html, wooden.html, wallpanel.html, accessories.html
> ให้ทำแบบเดียวกับ spc.html (ดูขั้นตอนในส่วนที่ 4)

---
## ขั้นตอนที่ 1 — สร้าง Firebase Project (ทำครั้งเดียว ~10 นาที)

### 1.1 สร้าง Project

1. ไปที่ https://console.firebase.google.com
2. กด **"Add project"** → ตั้งชื่อ เช่น `ob-home-cms`
3. ปิด Google Analytics (ไม่จำเป็น) → กด **Create project**

### 1.2 เปิดใช้ Authentication

1. เมนูซ้าย → **Build → Authentication**
2. กด **"Get started"**
3. แท็บ **Sign-in method** → คลิก **Email/Password** → Enable → Save

### 1.3 สร้าง Realtime Database

1. เมนูซ้าย → **Build → Realtime Database**
2. กด **"Create database"**
3. เลือก location: **asia-southeast1 (Singapore)**
4. เลือก **"Start in test mode"** → Next → Done
5. ไปที่แท็บ **Rules** → ลบทั้งหมด → วางโค้ดนี้ → Publish:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

### 1.4 สร้าง Storage

1. เมนูซ้าย → **Build → Storage**
2. กด **"Get started"** → Next → Done
3. ไปที่แท็บ **Rules** → ลบทั้งหมด → วางโค้ดนี้ → Publish:


--> presentname: f3zirric
--> cloudname: daiipuvsb
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 1.5 Copy firebaseConfig

1. เมนูซ้าย → ⚙️ **Project Settings**
2. เลื่อนลงมา → **Your apps** → กด **"</>"** (Web)
3. App nickname: `ob-home-web` → Register app
4. Copy ค่า `firebaseConfig` ทั้งหมด

---

## ขั้นตอนที่ 2 — แก้ไข firebase-config.js

เปิดไฟล์ `firebase-config.js` แล้วแทนที่ค่าในส่วนนี้:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy-XXX...",    // ← ใส่ค่าจริงจาก Firebase
  authDomain:        "ob-home-cms.firebaseapp.com",
  databaseURL:       "https://ob-home-cms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "ob-home-cms",
  storageBucket:     "ob-home-cms.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:xxxx"
};
```

---

## ขั้นตอนที่ 3 — สร้าง Admin Account แรก

เนื่องจากยังไม่มี account เลย ต้องสร้างผ่าน Firebase Console:

1. เมนูซ้าย → **Authentication → Users**
2. กด **"Add user"**
3. กรอก Email และ Password → Add user
4. จดจำ Email/Password ไว้ใช้ login

---

## ขั้นตอนที่ 4 — อัปโหลดไฟล์ขึ้นเว็บ

copy ไฟล์เหล่านี้ขึ้น server เดียวกับเว็บปัจจุบัน:
- `firebase-config.js`
- `cms.js`
- `admin.html`
- `home.html` (แทนที่ตัวเดิม)
- `spc.html` (แทนที่ตัวเดิม)

### เพิ่ม CMS ให้หน้าอื่น (lath, wooden, wallpanel, accessories)

เปิดแต่ละไฟล์ แล้วทำ 2 ขั้นตอน:

**ขั้นตอน A** — เพิ่ม `data-cms-products` ใน product-grid:
```html
<!-- เดิม -->
<div class="product-grid">

<!-- แก้เป็น -->
<div class="product-grid" data-cms-products>
```

**ขั้นตอน B** — เพิ่ม `data-cms-product-field` และ `data-cms-product-img` ในแต่ละ card:
```html
<!-- เดิม -->
<div class="product-card reveal">
  <div class="product-img-box">
    <img src="" alt="LATH">
  </div>
  <div class="product-info">
    <span class="product-code">ID: LATH-001</span>
    <h3 class="product-name">ชื่อสินค้า</h3>
    <div class="product-pattern">
      <div class="pattern-dot" style="background: #d2b48c;"></div>
      ลาย: ...
    </div>

<!-- แก้เป็น (เปลี่ยน 0 เป็น index ของ card: 0,1,2,3,...) -->
<div class="product-card reveal">
  <div class="product-img-box">
    <img src="" alt="LATH" data-cms-product-img="0">
  </div>
  <div class="product-info">
    <span class="product-code" data-cms-product-field="0:code">ID: LATH-001</span>
    <h3 class="product-name" data-cms-product-field="0:name">ชื่อสินค้า</h3>
    <div class="product-pattern">
      <div class="pattern-dot" style="background: #d2b48c;"></div>
      <span data-cms-product-field="0:pattern">ลาย: ...</span>
    </div>
```

**ขั้นตอน C** — เพิ่มปุ่ม "เพิ่มสินค้า" และ inject scripts ก่อน `</body>`:
```html
    <!-- ปุ่มเพิ่มสินค้า — วางในสุดของ .product-grid -->
    <button class="cms-add-product-btn">+ เพิ่มสินค้าใหม่</button>
  </div><!-- /product-grid -->

  <!-- ════ OB CMS ════ -->
  <script src="firebase-config.js"></script>
  <script src="cms.js"></script>
</body>
```

---

## ขั้นตอนที่ 5 — วิธีใช้งาน (สำหรับเจ้าของเว็บ)

### เข้าระบบ
1. เปิด `https://yoursite.com/admin.html`
2. กรอก Email + Password → กด "เข้าสู่ระบบ"

### แก้ไขเนื้อหา
1. ใน Dashboard → คลิกการ์ดหน้าที่ต้องการแก้ (เช่น "หน้าแรก")
2. หน้าเว็บเปิดในแท็บใหม่ — จะเห็น **แถบสีเข้มด้านล่าง**
3. กด **"✏️ เปิดแก้ไข"**
4. กรอบสีทองจะปรากฏรอบส่วนที่แก้ได้
5. **แก้ข้อความ**: คลิกที่ข้อความ → พิมพ์ได้เลย
6. **เปลี่ยนรูป**: คลิกที่รูป → เลือกไฟล์ → กด "✓ ใช้รูปนี้"
7. **เพิ่มสินค้า**: กดปุ่ม "+ เพิ่มสินค้าใหม่" ที่ท้ายหน้า
8. **ลบสินค้า**: กดปุ่ม "✕" มุมขวาบนของ card
9. กด **"💾 บันทึก"** เมื่อแก้เสร็จ

### เพิ่มผู้ดูแลระบบ
1. ใน Dashboard → ส่วน "จัดการผู้ดูแลระบบ"
2. กรอก Email + Password → กด "+ เพิ่มผู้ดูแล"

---

## โครงสร้างข้อมูลใน Firebase

```
pages/
├── home/
│   ├── texts/
│   │   ├── hero_tag: "OB HOME MATERIALS"
│   │   ├── hero_title: "..."
│   │   ├── rev1_text: "..."
│   │   └── ...
│   └── images/
│       ├── hero_bg: "https://..."
│       ├── proj1_img: "https://..."
│       └── ...
├── spc/
│   ├── products/
│   │   ├── 0: { code, name, pattern, color, img }
│   │   └── ...
│   └── texts/
└── ...
admins/
└── {uid}: { email, createdAt }
```

---

## Q&A ที่พบบ่อย

**Q: เจ้าของเว็บลืมรหัสผ่าน?**
A: ไป Firebase Console → Authentication → Users → Reset password

**Q: ต้องการย้อนกลับค่าเดิม?**
A: กด "✕ ยกเลิก" ในแถบ CMS — ระบบจะ reload ค่าจาก Firebase ใหม่

**Q: รูปขึ้นช้า?**
A: Firebase Storage ฟรีที่ตั้ง Singapore — ปกติรูปขึ้นใน 1-3 วินาที

**Q: ผู้เยี่ยมชมทั่วไปจะเห็นแถบ CMS ไหม?**
A: ไม่เห็น — แถบปรากฏเฉพาะเมื่อ login แล้วเท่านั้น
