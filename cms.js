/**
 * OB HOME CMS — cms.js
 * ============================================================
 * วิธีใช้: ใส่ <script src="cms.js"></script> ก่อน </body>
 * ในทุกหน้า HTML ของเว็บ (home, spc, lath, wooden, wallpanel, accessories)
 *
 * ต้องการ: firebase-config.js โหลดก่อน cms.js เสมอ
 * อัปโหลดรูปภาพ: Cloudinary (cloud: daiipuvsb, preset: f3zirric)
 * ============================================================
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     CLOUDINARY CONFIG
  ═══════════════════════════════════════════════════════ */
  const CLOUDINARY_CLOUD  = 'daiipuvsb';
  const CLOUDINARY_PRESET = 'f3zirric';
  const CLOUDINARY_URL    = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

  /* ═══════════════════════════════════════════════════════
     0.  รอ Firebase พร้อม
  ═══════════════════════════════════════════════════════ */
  function waitForFirebase(cb) {
    if (window._cmsDB && window._cmsAuth) {
      cb();
    } else {
      /* ใช้ event แทน polling — เร็วกว่า 80ms loop มาก */
      window.addEventListener("firebase-ready", cb, { once: true });
      /* fallback polling ทุก 50ms สำหรับกรณีที่ event หลุด */
      const _fbPoll = setInterval(() => {
        if (window._cmsDB && window._cmsAuth) { clearInterval(_fbPoll); cb(); }
      }, 50);
    }
  }

  /* ═══════════════════════════════════════════════════════
     1.  ตัวแปรหลัก
  ═══════════════════════════════════════════════════════ */
  let editMode = false;
  let currentUser = null;
  const PAGE = (function () {
    const path = location.pathname.split('/').pop().replace('.html', '') || 'home';
    return path === '' ? 'home' : path;
  })();

  /* ═══════════════════════════════════════════════════════
     2.  UI Bar (ลอยด้านล่าง — เห็นเฉพาะเมื่อ login แล้ว)
  ═══════════════════════════════════════════════════════ */
  function injectBar() {
    const bar = document.createElement('div');
    bar.id = 'cms-bar';
    bar.style.display = 'none'; /* ซ่อนไว้ก่อน รอ auth */
    bar.innerHTML = `
      <div id="cms-bar-inner">
        <span id="cms-bar-logo">✦ OB CMS</span>
        <span id="cms-bar-page">หน้า: <b>${PAGE}</b></span>
        <div id="cms-bar-actions">
          <button id="cms-btn-toggle" class="cms-btn cms-btn-primary">✏️ เปิดแก้ไข</button>
          <button id="cms-btn-save"   class="cms-btn cms-btn-save" style="display:none">💾 บันทึก</button>
          <button id="cms-btn-cancel" class="cms-btn"              style="display:none">✕ ยกเลิก</button>
          <button id="cms-btn-sync" class="cms-btn cms-btn-sync" title="ซิงค์ข้อความจากโค้ด HTML ไปยัง Firebase">🔄 ซิงค์จากโค้ด</button>
          <button id="cms-btn-logout" class="cms-btn cms-btn-danger">ออกจากระบบ</button>
        </div>
        <div id="cms-toast"></div>
      </div>
    `;
    document.body.appendChild(bar);

    const style = document.createElement('style');
    style.textContent = `
      body { transition: opacity 0.2s ease; }
      #cms-bar {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 999999;
        background: #1a1a16; color: #faf9f6;
        font-family: 'IBM Plex Sans Thai', 'Opun', sans-serif;
        font-size: 13px; padding: 0 16px;
        box-shadow: 0 -4px 24px rgba(0,0,0,.35);
        border-top: 1px solid rgba(255,255,255,.08);
      }
      #cms-bar-inner {
        max-width: 1200px; margin: 0 auto;
        display: flex; align-items: center; gap: 16px;
        min-height: 52px; padding: 8px 0; /* เปลี่ยนจาก height ล็อกตายตัว เป็น min-height */
        flex-wrap: wrap;
      }
      #cms-bar-logo { font-weight: 700; color: #bca58e; letter-spacing: .06em; }
      #cms-bar-page { color: rgba(255,255,255,.5); font-size: 12px; }
      #cms-bar-page b { color: #fff; }
      #cms-bar-actions { display: flex; gap: 8px; margin-left: auto; align-items: center; flex-wrap: wrap; }
      .cms-btn {
        padding: 7px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,.15);
        background: rgba(255,255,255,.08); color: #fff; cursor: pointer;
        font-size: 12px; font-family: inherit; transition: all .2s;
      }
      .cms-btn:hover { background: rgba(255,255,255,.18); }
      .cms-btn-primary { background: #bca58e; border-color: #bca58e; color: #1a1a16; font-weight: 600; }
      .cms-btn-primary:hover { background: #d4c4b0; }
      .cms-btn-save { background: #2c6e3a; border-color: #2c6e3a; font-weight: 600; }
      .cms-btn-save:hover { background: #3a8f4d; }
      .cms-btn-sync { background: rgba(80,120,200,.2); border-color: rgba(80,120,200,.5); color: #9bb8ff; }
      .cms-btn-sync:hover { background: rgba(80,120,200,.35); }
      .cms-btn-danger { background: rgba(220,50,50,.15); border-color: rgba(220,50,50,.4); color: #f88; }
      .cms-btn-danger:hover { background: rgba(220,50,50,.3); }

      /* edit mode highlight */
      [data-cms-text][contenteditable="true"]:empty::before {
        content: attr(data-cms-placeholder);
        color: rgba(188,165,142,.5);
        font-style: italic;
        pointer-events: none;
      }
      [data-cms-text][contenteditable="true"]:focus:empty::before {
        content: 'พิมพ์ข้อความที่นี่…';
        color: rgba(188,165,142,.35);
      }
      [data-cms-text][contenteditable="true"] {
        outline: 2px dashed #bca58e !important;
        outline-offset: 3px;
        border-radius: 4px;
        cursor: text;
        position: relative;
      }
      [data-cms-text][contenteditable="true"]:focus {
        outline: 2px solid #bca58e !important;
        background: rgba(188,165,142,.07);
      }
      [data-cms-img].cms-img-editable {
        outline: 2px dashed #bca58e;
        outline-offset: 3px;
        cursor: pointer;
        position: relative;
        border-radius: 4px;
      }
      [data-cms-img].cms-img-editable::after {
        content: '📷 เปลี่ยนรูป';
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        background: rgba(26,26,22,.8);
        color: #fff; padding: 8px 16px; border-radius: 8px;
        font-size: 13px; font-family: inherit;
        pointer-events: none; white-space: nowrap;
      }
      [data-cms-link].cms-link-editable {
        outline: 2px dashed #6aabff !important;
        outline-offset: 3px;
        border-radius: 4px;
        cursor: pointer !important;
      }
      [data-cms-link].cms-link-editable:hover {
        background: rgba(106,171,255,.1);
      }
      /* field label tooltip on hover in edit mode */
      body.cms-editing [data-cms-text]:hover::before,
      body.cms-editing [data-cms-img].cms-img-editable:hover::before {
        content: attr(data-cms-text) attr(data-cms-img);
        position: absolute; top: -22px; left: 0;
        background: #1a1a16; color: #bca58e;
        font-size: 10px; padding: 2px 7px; border-radius: 4px;
        font-family: monospace; pointer-events: none;
        white-space: nowrap; z-index: 10000;
        letter-spacing: .04em;
      }
      /* extra fields (price/size/thick) — ซ่อนตามปกติ, แสดงในโหมดแก้ไข */
      .cms-extra-fields {
        margin: 6px 0 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .cms-extra-label {
        font-size: 10px; font-weight: 700; letter-spacing: .08em;
        text-transform: uppercase; color: #bca58e; margin-top: 6px;
        font-family: monospace;
      }
      .cms-extra-val {
        font-size: 13px; color: #333;
        border-radius: 3px; padding: 2px 4px;
        outline: 1px dashed #bca58e;
        min-height: 20px; display: block;
      }
      /* สินค้าใหม่ */
      .cms-add-product-btn {
        display: none; width: 100%; margin-top: 20px;
        padding: 14px; border: 2px dashed #bca58e;
        background: rgba(188,165,142,.06); color: #bca58e;
        border-radius: 10px; cursor: pointer; font-size: 14px;
        font-family: inherit; transition: all .2s;
      }
      .cms-add-product-btn:hover { background: rgba(188,165,142,.14); }
      .cms-delete-card-btn {
        display: none; position: absolute; top: 8px; right: 8px;
        background: #dc3232; color: #fff; border: none;
        width: 28px; height: 28px; border-radius: 50%;
        font-size: 16px; cursor: pointer; z-index: 10;
        align-items: center; justify-content: center;
        line-height: 1;
      }
      body.cms-editing .cms-add-product-btn { display: block; }
      body.cms-editing .cms-delete-card-btn { display: flex; }
      body.cms-editing .product-card { position: relative; }

      /* toast */
      #cms-toast {
        position: fixed; bottom: 62px; right: 20px;
        background: #2c6e3a; color: #fff;
        padding: 10px 20px; border-radius: 10px;
        font-size: 13px; font-family: inherit;
        opacity: 0; transition: opacity .3s; pointer-events: none;
        z-index: 1000000;
      }
      #cms-toast.show { opacity: 1; }

      /* modal รูปภาพ */
      #cms-img-modal {
        display: none; position: fixed; inset: 0; z-index: 1000001;
        background: rgba(0,0,0,.7); align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
      }
      #cms-img-modal.open { display: flex; }
      #cms-img-modal-box {
        background: #1a1a16; border-radius: 16px; padding: 28px 32px;
        width: 90%; max-width: 420px; color: #faf9f6;
        font-family: 'IBM Plex Sans Thai', 'Opun', sans-serif;
      }
      #cms-img-modal h3 { font-size: 16px; margin-bottom: 16px; color: #bca58e; }
      #cms-img-modal input[type=file] {
        width: 100%; padding: 10px; border: 1px dashed rgba(255,255,255,.2);
        border-radius: 8px; color: #fff; background: rgba(255,255,255,.05);
        font-family: inherit; margin-bottom: 8px; cursor: pointer;
      }
      #cms-img-modal-preview {
        width: 100%; max-height: 200px; object-fit: contain;
        border-radius: 8px; margin: 10px 0; display: none;
      }
      #cms-img-modal p { font-size: 12px; color: rgba(255,255,255,.4); margin-bottom: 16px; }
      #cms-img-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

      /* ════ Responsive Mobile ════ */
      @media (max-width: 600px) {
        #cms-bar-inner {
          padding: 12px 0;
        }
        #cms-bar-actions {
          width: 100%; /* บังคับให้ชุดปุ่มตกลงมาอยู่บรรทัดใหม่ */
          margin-left: 0;
          margin-top: 4px;
          justify-content: space-between;
        }
        .cms-btn {
          flex: 1; /* ขยายปุ่มให้เต็มพื้นที่แนวนอนเท่าๆ กัน */
          text-align: center;
          padding: 8px 4px;
          font-size: 11px;
        }
        #cms-toast {
          bottom: 100px; /* ดันตัวแจ้งเตือนขึ้น ไม่ให้โดนบาร์บังตอนขยายความสูง */
        }
      }
    `;
    document.head.appendChild(style);

    // image modal
    const modal = document.createElement('div');
    modal.id = 'cms-img-modal';
    modal.innerHTML = `
      <div id="cms-img-modal-box">
        <h3>📷 เปลี่ยนรูปภาพ</h3>
        <input type="file" id="cms-file-input" accept="image/*">
        <img id="cms-img-modal-preview" src="" alt="preview">
        <p>รองรับ JPG, PNG, WEBP — ขนาดแนะนำ ≤ 5MB</p>
        <div id="cms-img-modal-actions">
          <button class="cms-btn" id="cms-img-cancel-btn">ยกเลิก</button>
          <button class="cms-btn cms-btn-save" id="cms-img-confirm-btn">✓ ใช้รูปนี้</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    return bar;
  }

  /* ═══════════════════════════════════════════════════════
     3.  Toast notification
  ═══════════════════════════════════════════════════════ */
  window._cmsToast = function(msg, isError) { toast(msg, isError); };
  function toast(msg, isError = false) {
    const t = document.getElementById('cms-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.background = isError ? '#8b2020' : '#2c6e3a';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ═══════════════════════════════════════════════════════
     4.  Load content จาก Firebase → ใส่ใน DOM
  ═══════════════════════════════════════════════════════ */
  /* ── snapshot ค่าต้นฉบับจาก HTML ก่อนที่ applyData จะเขียนทับ ──
     เก็บไว้ใช้ตอน syncFromHTML เพื่อให้ได้ค่าจากโค้ดจริงๆ ไม่ใช่ค่า Firebase */
  const _htmlOriginal = { texts: {}, images: {}, mapSrc: null };
  (function snapshotHTML() {
    document.querySelectorAll('[data-cms-text]').forEach(el => {
      const key = el.dataset.cmsText;
      if (!(key in _htmlOriginal.texts)) _htmlOriginal.texts[key] = el.innerHTML;
    });
    document.querySelectorAll('[data-cms-img]').forEach(el => {
      const key = el.dataset.cmsImg;
      if (key in _htmlOriginal.images) return;
      if (el.tagName === 'IMG') {
        const s = el.src || '';
        if (s && !s.startsWith('blob:') && !s.startsWith('data:')) {
          // เก็บเป็น relative path เสมอ (ป้องกัน localhost URL ติดไป Firebase)
          try {
            const u = new URL(s);
            _htmlOriginal.images[key] = (u.hostname === 'localhost' || u.hostname === '127.0.0.1')
              ? u.pathname
              : s;
          } catch(e) { _htmlOriginal.images[key] = s; }
        }
      } else {
        const m = (el.style.backgroundImage || '').match(/url\(['"]?(.+?)['"]?\)\s*$/);
        if (m) _htmlOriginal.images[key] = m[1];
      }
    });
    const mapEl = document.querySelector('[data-cms-map]');
    if (mapEl && mapEl.src) _htmlOriginal.mapSrc = mapEl.src;
  })();

  /* ── cache helpers ── */
  const CACHE_KEY = `cms_cache_${PAGE}`;
  const CACHE_TTL       = 5 * 60 * 1000; // 5 นาที — อายุสูงสุดของ cache
  const CACHE_FRESH_TTL =     30 * 1000; // 30 วินาที — หลัง save/sync ป้องกัน silent fetch ทับ

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null; // หมดอายุ
      return data;
    } catch (e) { return null; }
  }

  function isCacheFresh() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return false;
      const { ts } = JSON.parse(raw);
      return (Date.now() - ts) < CACHE_FRESH_TTL;
    } catch (e) { return false; }
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
  }

  function revealPage() {
    // Apply lang BEFORE adding cms-ready so DOM is in final state before opacity starts
    if (window._obLang) window._obLang.apply(window._obLang.current());
    // rAF: let applyLang DOM writes flush before transition fires
    requestAnimationFrame(function() {
      document.body.classList.add('cms-ready');
    });
  }

  function applyData(data) {
    // ── ป้องกันกระพริบ: ถ้ากำลัง edit อยู่ ไม่ override DOM ──
    if (editMode) return;

    // ── ข้อความ ──
    document.querySelectorAll('[data-cms-text]').forEach(el => {
      const key = el.dataset.cmsText;
      if (data.texts && data.texts[key] !== undefined) el.innerHTML = data.texts[key];
    });
    // ── ลิงก์ ──
    if (data.links) {
      document.querySelectorAll('[data-cms-link]').forEach(el => {
        const key = el.dataset.cmsLink;
        const val = data.links[key];
        if (!val) return;
        // ข้ามค่า localhost หรือ full URL ที่บันทึกผิด — ใช้เฉพาะ relative path
        try {
          const u = new URL(val);
          if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return;
          el.href = val;
        } catch(e) {
          // relative path — ใช้ได้เลย
          el.href = val;
        }
      });
    }
    // ── รูปภาพ ──
    document.querySelectorAll('[data-cms-img]').forEach(el => {
      const key = el.dataset.cmsImg;
      if (!data.images || !data.images[key]) return;

      let imgUrl = sanitizeUrl(data.images[key]);

      // ถ้า URL ว่าง หรือเป็นแค่ blob: → ข้าม ไม่ override
      if (!imgUrl || imgUrl.startsWith('blob:')) return;

      if (el.tagName === 'IMG') {
        // ถ้าเป็น base64 อยู่แล้วและ Firebase ไม่มีค่าที่ดีกว่า → ข้าม
        if (el.src && el.src.startsWith('data:') && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) return;
        el.src = imgUrl;
      } else {
        el.style.backgroundImage = `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.45)), url('${imgUrl}')`;
      }
    });
    // ── สินค้า ──
    if (data.products) renderProducts(data.products);

    // ── gallery (หน้า installations / reviews) ──
    if (data.gallery) {
      const _galleryData = data.gallery;
      if (window._cmsGalleryLoad) {
        window._cmsGalleryLoad(_galleryData);
      } else {
        // รอ function พร้อม — เพิ่ม timeout เป็น 6s กันกรณีโหลดช้า
        const _waitGallery = setInterval(() => {
          if (window._cmsGalleryLoad) {
            clearInterval(_waitGallery);
            window._cmsGalleryLoad(_galleryData);
          }
        }, 30);
        setTimeout(() => clearInterval(_waitGallery), 6000);
        // ยิง event เผื่อ gallery script ฟังอยู่
        window.dispatchEvent(new CustomEvent('cms-gallery-data', { detail: _galleryData }));
      }
    }

    // ── before & after gallery ──
    if (data.before_after) {
      const _baData = data.before_after;
      if (window._cmsBaLoad) {
        window._cmsBaLoad(_baData);
      } else {
        const _waitBA = setInterval(() => {
          if (window._cmsBaLoad) {
            clearInterval(_waitBA);
            window._cmsBaLoad(_baData);
          }
        }, 30);
        setTimeout(() => clearInterval(_waitBA), 6000);
        window.dispatchEvent(new CustomEvent('cms-ba-data', { detail: _baData }));
      }
    }
    // ── แผนที่ ──
    if (data.mapSrc) {
      const mapEl = document.querySelector('[data-cms-map]');
      if (mapEl) mapEl.src = data.mapSrc;
    }

    // ── reviews grid (หน้า home) ──
    if (window._cmsReviewsLoad) {
      // โหลด gallery จาก pages/reviews แยกต่างหาก เพราะ home อยู่คนละ path
      const db = window._cmsDB;
      if (db) {
        db.ref('pages/reviews').once('value').then(snap => {
          if (snap && snap.exists() && snap.val().gallery) {
            window._cmsReviewsLoad(snap.val().gallery);
          }
        }).catch(() => {});
      }
    }

    // ── re-apply ภาษาปัจจุบัน ก่อน reveal หน้า เพื่อไม่ให้กระพริบเป็น TH ──
    if (window._obLang) {
      window._obLang.apply(window._obLang.current());
    }

    // ── แสดงหน้าหลัง apply เสร็จ (ป้องกันกระพริบ) ──
    revealPage();
    // dispatch event ให้ lang.js รู้ว่า CMS เสร็จแล้ว
    window.dispatchEvent(new CustomEvent('cms-data-applied'));
  }

  /* ── แก้ URL ใน Firebase ที่เคยบันทึกเป็น localhost (one-shot fix) ── */
  function sanitizeUrl(url) {
    if (!url) return url;
    try {
      const u = new URL(url);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '0.0.0.0') {
        return u.pathname;
      }
    } catch(e) {}
    return url;
  }

  async function loadContent() {
    const grid = document.querySelector('.product-grid[data-cms-products]');

    // fallback: ถ้า Firebase ช้ากว่า 3 วิ → reveal ไปก่อนเพื่อไม่ค้างขาว
    const _revealTimer = setTimeout(function() {
      if (window._obLang) window._obLang.apply(window._obLang.current());
      revealPage();
    }, 3000);

    /* ── 1. แสดงจาก cache ทันที (ไม่รอ network) ── */
    const cached = readCache();
    if (cached) {
      applyData(cached); // applyData จะ revealPage() ด้วย
      clearTimeout(_revealTimer);
      if (grid) grid.style.visibility = '';
      /* silent fetch เพื่อ sync ข้อมูลล่าสุดจาก Firebase
         แต่ถ้า editMode อยู่ หรือ cache เพิ่ง write — ข้ามทั้งหมด */
      if (!editMode && !isCacheFresh()) {
        fetchAndCache(grid, /* silent= */ true);
      }
      return;
    }

    /* ── 2. ไม่มี cache → fetch แบบปกติ ── */
    if (editMode) { clearTimeout(_revealTimer); return; }
    await fetchAndCache(grid, false);
    clearTimeout(_revealTimer);
    revealPage(); // กรณี fetchAndCache ไม่มีข้อมูลใน Firebase
  }

  async function fetchAndCache(grid, silent) {
    try {
      const db = window._cmsDB;
      const { ref, get } = window._firebaseDB;
      const snap = await get(ref(db, `pages/${PAGE}`));
      if (!snap.exists()) { revealPage(); return; }
      const data = snap.val();
      writeCache(data);
      // ถ้ากำลัง edit อยู่ — บันทึก cache ไว้ แต่ไม่ applyData ทับ DOM
      if (!editMode) {
        if (silent) {
          // Truly silent: cache was already written above — do NOT touch DOM
          // Current view stays stable; fresh data used on next page load
        } else {
          applyData(data); // includes revealPage() + _obLang.apply()
        }
      } else if (!silent) {
        revealPage();
      }
    } catch (e) {
      console.warn('CMS load error:', e);
      if (!silent) revealPage();
    } finally {
      if (grid && !editMode) grid.style.visibility = '';
    }
  }

  /* ═══════════════════════════════════════════════════════
     5.  Render product cards (หน้าสินค้า)
  ═══════════════════════════════════════════════════════ */
  function renderProducts(products) {
    const grid = document.querySelector('.product-grid[data-cms-products]');
    if (!grid) return;
    grid.querySelectorAll('.product-card').forEach(c => c.remove());
    products.forEach((p, i) => {
      const card = buildProductCard(p, i);
      card.classList.add('visible');
      grid.insertBefore(card, grid.querySelector('.cms-add-product-btn'));
    });
    /* re-apply current lang to newly created cards */
    if (window._obLang) window._obLang.apply(window._obLang.current());
  }

  function buildProductCard(p, idx) {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.dataset.cmsProductIdx = idx;
    // เก็บ price/size/thick/groove ไว้ใน data-attribute เพื่อให้ modal และ sort ดึงได้
    if (p.price)    card.dataset.pdmPrice    = p.price;
    if (p.discount) card.dataset.pdmDiscount = p.discount;
    if (p.size)     card.dataset.pdmSize     = p.size;
    if (p.thick)    card.dataset.pdmThick    = p.thick;
    // เสมอ set pdmGroove (แม้จะว่าง) เพื่อให้ sort อ่านได้ถูกต้อง
    card.dataset.pdmGroove = p.groove || '';

    // แสดง groove field เฉพาะหน้า lath เท่านั้น
    const isLath = PAGE === 'lath';
    // data-groove-raw เก็บค่าดิบบน attribute เพื่อให้ sort อ่านได้แม้ display:none
    const grooveField = isLath ? `
          <span class="cms-extra-label">ร่อง:</span>
          <span data-cms-product-field="${idx}:groove" data-groove-raw="${p.groove || ''}" class="cms-extra-val">${p.groove || ''}</span>` : '';

    card.innerHTML = `
      <button class="cms-delete-card-btn" title="ลบสินค้านี้">✕</button>
      <div class="product-img-box">
        <img src="${p.img || ''}" alt="${p.name || ''}" data-cms-product-img="${idx}">
      </div>
      <div class="product-info">
        <span class="product-code" data-cms-product-field="${idx}:code">${p.code || ''}</span>
        <h3 class="product-name" data-cms-product-field="${idx}:name">${p.name || ''}</h3>
        <div class="product-pattern">
          <div class="pattern-dot" style="background:${p.color || '#ccc'}"></div>
          <span data-cms-product-field="${idx}:pattern">${p.pattern || ''}</span>
        </div>
        ${isLath && p.groove ? `<div class="product-groove-tag"><span data-lang="lbl_groove">ร่อง</span>: ${p.groove}</div>` : ''}
        ${p.price && p.discount ? `
        <div class="product-price-tag">
          <span class="price-original"><span data-lang="lbl_price">ราคา</span>: ${p.price} ฿</span>
          <span class="price-discount">${p.discount} ฿</span>
        </div>` : p.price ? `<div class="product-price-tag"><span data-lang="lbl_price">ราคา</span>: ${p.price} ฿</div>` : ''}
        <button class="btn-view" data-lang="btn_view">ดูรายละเอียด</button>
        <div class="cms-extra-fields" style="display:none">
          <span class="cms-extra-label" data-lang="lbl_price">ราคา:</span>
          <span data-cms-product-field="${idx}:price" class="cms-extra-val">${p.price || ''}</span>
          <span class="cms-extra-label">ราคาส่วนลด:</span>
          <span data-cms-product-field="${idx}:discount" class="cms-extra-val">${p.discount || ''}</span>${grooveField}
          <span class="cms-extra-label">ขนาด:</span>
          <span data-cms-product-field="${idx}:size" class="cms-extra-val">${p.size || ''}</span>
          <span class="cms-extra-label">ความหนา:</span>
          <span data-cms-product-field="${idx}:thick" class="cms-extra-val">${p.thick || ''}</span>
        </div>
      </div>
    `;
    // ใช้ live index จาก DOM ไม่ใช่ closure
    card.querySelector('.cms-delete-card-btn').addEventListener('click', () => {
      const grid = document.querySelector('.product-grid[data-cms-products]');
      const liveIdx = Array.from(grid.querySelectorAll('.product-card')).indexOf(card);
      deleteProduct(liveIdx);
    });
    return card;
  }

  /* ═══════════════════════════════════════════════════════
     6.  เปิด / ปิด Edit Mode
  ═══════════════════════════════════════════════════════ */
  function enableEditMode() {
    editMode = true;
    document.body.classList.add('cms-editing');
    document.querySelectorAll('.cms-add-product-btn').forEach(b => b.style.display = '');
    document.getElementById('cms-btn-toggle').style.display = 'none';
    document.getElementById('cms-btn-save').style.display   = '';
    document.getElementById('cms-btn-cancel').style.display = '';

    // ── แสดงภาษาปัจจุบันก่อนเปิด edit ──
    if (window._obLang) window._obLang.apply(window._obLang.current());

    document.querySelectorAll('[data-cms-text]').forEach(el => {
      el.contentEditable = 'true';
      // ป้องกัน element ว่างเปล่าแล้วพิมพ์ใหม่ไม่ได้
      el.dataset.cmsPlaceholder = el.dataset.cmsPlaceholder || el.dataset.cmsText;
      el._cmsInput = () => {
        if (el.innerHTML === '' || el.innerHTML === '<br>') {
          el.innerHTML = '';
        }
      };
      el.addEventListener('input', el._cmsInput);
      // ป้องกัน <a> และ <button> navigate/trigger ขณะแก้ไข
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el._cmsClickBlock = e => { e.preventDefault(); e.stopPropagation(); };
        el.addEventListener('click', el._cmsClickBlock);
      }
    });

    document.querySelectorAll('[data-cms-img]').forEach(el => {
      el.classList.add('cms-img-editable');
      el.removeEventListener('click', onImgClick);
      el.addEventListener('click', onImgClick);

      // ถ้าเป็น section/div (ไม่ใช่ img) — ป้องกัน click ลูกข้างใน bubble ขึ้นมา
      if (el.tagName !== 'IMG') {
        el.querySelectorAll('a, button, input, [contenteditable]').forEach(child => {
          child._cmsStopProp = e => e.stopPropagation();
          child.addEventListener('click', child._cmsStopProp);
        });
      }
    });

    // link editing
    document.querySelectorAll('[data-cms-link]').forEach(el => {
      el.classList.add('cms-link-editable');
      el.addEventListener('click', onLinkClick);
    });

    bindProductEditors();
    enableMapEditor();
  }

  function disableEditMode() {
    editMode = false;
    document.body.classList.remove('cms-editing');
    document.querySelectorAll('.cms-add-product-btn').forEach(b => b.style.display = 'none');
    document.getElementById('cms-btn-toggle').style.display = '';
    document.getElementById('cms-btn-save').style.display   = 'none';
    document.getElementById('cms-btn-cancel').style.display = 'none';

    document.querySelectorAll('[data-cms-text]').forEach(el => {
      el.contentEditable = 'false';
      if (el._cmsInput) {
        el.removeEventListener('input', el._cmsInput);
        delete el._cmsInput;
      }
      if (el._cmsClickBlock) {
        el.removeEventListener('click', el._cmsClickBlock);
        delete el._cmsClickBlock;
      }
    });
    document.querySelectorAll('[data-cms-img]').forEach(el => {
      el.classList.remove('cms-img-editable');
      el.removeEventListener('click', onImgClick);
      if (el.tagName !== 'IMG') {
        el.querySelectorAll('a, button, input, [contenteditable]').forEach(child => {
          if (child._cmsStopProp) {
            child.removeEventListener('click', child._cmsStopProp);
            delete child._cmsStopProp;
          }
        });
      }
    });
    document.querySelectorAll('[data-cms-link]').forEach(el => {
      el.classList.remove('cms-link-editable');
      el.removeEventListener('click', onLinkClick);
    });
    unbindProductEditors();
    disableMapEditor();
  }

  function bindProductEditors() {
    // text fields ภายใน product cards
    document.querySelectorAll('[data-cms-product-field]').forEach(el => {
      el.contentEditable = 'true';
      el.style.outline = '1px dashed #bca58e';
      el.style.borderRadius = '3px';
    });
    // แสดง extra fields (price/size/thick) ในโหมดแก้ไข
    document.querySelectorAll('.cms-extra-fields').forEach(el => {
      el.style.display = '';
    });
    // รูปสินค้า — ป้องกัน listener ซ้ำ
    document.querySelectorAll('[data-cms-product-img]').forEach(img => {
      img.style.cursor = 'pointer';
      img.style.outline = '2px dashed #bca58e';
      img.removeEventListener('click', onProductImgClick);
      img.addEventListener('click', onProductImgClick);
    });
  }

  function unbindProductEditors() {
    document.querySelectorAll('[data-cms-product-field]').forEach(el => {
      el.contentEditable = 'false';
      el.style.outline = '';
      el.style.borderRadius = '';
    });
    // ซ่อน extra fields กลับ
    document.querySelectorAll('.cms-extra-fields').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('[data-cms-product-img]').forEach(img => {
      img.style.cursor = '';
      img.style.outline = '';
      img.removeEventListener('click', onProductImgClick);
    });
  }

  /* ═══════════════════════════════════════════════════════
     MAP EDITOR — เปิด/ปิด overlay แก้ไข iframe แผนที่
  ═══════════════════════════════════════════════════════ */
  function enableMapEditor() {
    const overlay = document.getElementById('cms-map-overlay');
    const mapEl   = document.querySelector('[data-cms-map]');
    if (!overlay || !mapEl) return;

    // แสดง overlay พร้อม cursor ชี้
    overlay.style.display = 'flex';
    mapEl.style.pointerEvents = 'none'; // ป้องกัน iframe กิน click

    const input   = document.getElementById('cms-map-input');
    const confirm = document.getElementById('cms-map-confirm');
    const cancel  = document.getElementById('cms-map-cancel');

    // ใส่ค่า src ปัจจุบันลงช่อง input
    input.value = mapEl.src || '';

    confirm.onclick = function () {
      const val = (input.value || '').trim();
      if (!val) { toast('กรุณากรอก URL', true); return; }
      // รองรับทั้ง full iframe HTML และ src URL ล้วนๆ
      const srcMatch = val.match(/src=["']([^"']+)["']/);
      const finalSrc = srcMatch ? srcMatch[1] : val;
      mapEl.src = finalSrc;
      mapEl._pendingMapSrc = finalSrc;
      toast('อัปเดตแผนที่แล้ว — กดบันทึกเพื่อยืนยัน');
    };

    cancel.onclick = function () {
      input.value = mapEl.src || '';
      toast('ยกเลิกการเปลี่ยนแผนที่');
    };
  }

  function disableMapEditor() {
    const overlay = document.getElementById('cms-map-overlay');
    const mapEl   = document.querySelector('[data-cms-map]');
    if (overlay) overlay.style.display = 'none';
    if (mapEl)   mapEl.style.pointerEvents = '';
  }

  /* ═══════════════════════════════════════════════════════
  ═══════════════════════════════════════════════════════ */
  let _currentImgTarget = null;
  let _currentImgFile   = null;

  function onImgClick(e) {
    if (!editMode) return;
    e.preventDefault(); e.stopPropagation();
    _currentImgTarget = e.currentTarget;
    openImgModal();
  }

  function onProductImgClick(e) {
    if (!editMode) return;
    e.preventDefault(); e.stopPropagation();
    _currentImgTarget = e.currentTarget;
    openImgModal();
  }

  function openImgModal() {
    _currentImgFile = null;
    document.getElementById('cms-file-input').value = '';
    document.getElementById('cms-img-modal-preview').style.display = 'none';
    document.getElementById('cms-img-modal').classList.add('open');
  }

  function closeImgModal() {
    document.getElementById('cms-img-modal').classList.remove('open');
    _currentImgTarget = null;
    _currentImgFile   = null;
  }

  /* link editing */
  function onLinkClick(e) {
    if (!editMode) return;
    e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget;
    const newHref = prompt('แก้ไข URL / ลิงก์:', el.href || '');
    if (newHref !== null) {
      el.href = newHref.trim();
      toast('อัปเดตลิงก์แล้ว — กดบันทึกเพื่อยืนยัน');
    }
  }

  /* ═══════════════════════════════════════════════════════
     8.  Cloudinary Upload Helper
  ═══════════════════════════════════════════════════════ */
  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', `ob-cms/${PAGE}`);

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Cloudinary upload failed (${res.status})`);
    }

    const data = await res.json();
    return data.secure_url;
  }

  /* ═══════════════════════════════════════════════════════
     9.  บันทึก (Save) ข้อมูลทั้งหมด
  ═══════════════════════════════════════════════════════ */
  async function saveAll() {
    const saveBtn = document.getElementById('cms-btn-save');
    saveBtn.textContent = '⏳ กำลังบันทึก...';
    saveBtn.disabled = true;

    try {
      const db = window._cmsDB;
      const { ref: dbRef, set } = window._firebaseDB;

      const texts    = {};
      const images   = {};
      const products = [];

      // ── รวบรวม texts ──
      document.querySelectorAll('[data-cms-text]').forEach(el => {
        texts[el.dataset.cmsText] = el.innerHTML;
      });

      // ── อัปโหลด images → Cloudinary ──
      const uploadJobs = [];
      document.querySelectorAll('[data-cms-img]').forEach(el => {
        const key  = el.dataset.cmsImg;
        const file = el._pendingFile;
        if (file) {
          uploadJobs.push(
            uploadToCloudinary(file).then(url => {
              images[key] = url;
              // Revoke temp object URL, replace with permanent CDN URL
              if (el._pendingObjectUrl) { URL.revokeObjectURL(el._pendingObjectUrl); delete el._pendingObjectUrl; }
              if (el.tagName === 'IMG') el.src = url;
              else el.style.backgroundImage = `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.45)), url('${url}')`;
              delete el._pendingFile;
            })
          );
        } else {
          if (el.tagName === 'IMG') {
            // ป้องกัน save localhost URL เข้า Firebase
            // ถ้าเป็น local dev URL → แปลงเป็น relative path
            const rawSrc = el.src || '';
            const isLocalhost = rawSrc.includes('localhost') || rawSrc.includes('127.0.0.1') || rawSrc.includes('0.0.0.0');
            if (isLocalhost) {
              // เก็บเฉพาะ path หลัง origin (เช่น /assets/logo.png)
              try {
                const u = new URL(rawSrc);
                images[key] = u.pathname; // เช่น /assets/logo.png
              } catch(e) {
                images[key] = rawSrc;
              }
            } else if (rawSrc && !rawSrc.startsWith('blob:')) {
              images[key] = rawSrc;
            }
          } else {
            const m = (el.style.backgroundImage || '').match(/url\(['"]?(.+?)['"]?\)\s*$/);
            if (m) {
              const bgUrl = m[1];
              const isLocalBg = bgUrl.includes('localhost') || bgUrl.includes('127.0.0.1');
              if (isLocalBg) {
                try { images[key] = new URL(bgUrl).pathname; } catch(e) { images[key] = bgUrl; }
              } else {
                images[key] = bgUrl;
              }
            }
          }
        }
      });

      // ── รวบรวม products (อัปโหลดรูปสินค้า → Cloudinary) ──
      const grid = document.querySelector('.product-grid[data-cms-products]');
      if (grid) {
        const cards = grid.querySelectorAll('.product-card');
        const productUploadJobs = [];

        cards.forEach((card, idx) => {
          const p = {
            code:    (card.querySelector('[data-cms-product-field$=":code"]')    || {}).innerText || '',
            name:    (card.querySelector('[data-cms-product-field$=":name"]')    || {}).innerText || '',
            pattern: (card.querySelector('[data-cms-product-field$=":pattern"]') || {}).innerText || '',
            color:   (card.querySelector('.pattern-dot') || {}).style?.background || '#ccc',
            img:     (card.querySelector('img') || {}).src || '',
            price:    (card.querySelector('[data-cms-product-field$=":price"]')    || {}).innerText || '',
            discount: (card.querySelector('[data-cms-product-field$=":discount"]') || {}).innerText || '',
            size:     (card.querySelector('[data-cms-product-field$=":size"]')     || {}).innerText || '',
            thick:    (card.querySelector('[data-cms-product-field$=":thick"]')    || {}).innerText || '',
            groove:   (card.querySelector('[data-cms-product-field$=":groove"]')   || {}).innerText || '',
          };
          const imgEl = card.querySelector('[data-cms-product-img]');
          if (imgEl && imgEl._pendingFile) {
            const file = imgEl._pendingFile;
            productUploadJobs.push(
              uploadToCloudinary(file).then(url => {
                p.img = url;
                if (imgEl._pendingObjectUrl) { URL.revokeObjectURL(imgEl._pendingObjectUrl); delete imgEl._pendingObjectUrl; }
                imgEl.src = url;
                delete imgEl._pendingFile;
              })
            );
          }
          products.push(p);
        });

        await Promise.all(productUploadJobs);
      }

      await Promise.all(uploadJobs);

      // ── เขียน Firebase Realtime DB ──
      const links = {};
      document.querySelectorAll('[data-cms-link]').forEach(el => {
        links[el.dataset.cmsLink] = el.getAttribute('href');
      });

      const payload = { texts };
      if (Object.keys(images).length) payload.images = images;
      if (products.length) payload.products = products;
      if (Object.keys(links).length) payload.links = links;
      // ── แผนที่ ──
      const mapEl = document.querySelector('[data-cms-map]');
      if (mapEl && mapEl.src) payload.mapSrc = mapEl.src;
      // gallery items (หน้า installations/reviews)
      if (window._cmsGallery && window._cmsGallery.length) payload.gallery = window._cmsGallery;
      // before_after hook (หน้า before-after)
      if (window._cmsSaveExtra) await window._cmsSaveExtra(payload);
      await set(dbRef(db, `pages/${PAGE}`), payload);

      const cachePayload = { texts, images, products, links };
      if (mapEl && mapEl.src) cachePayload.mapSrc = mapEl.src;
      if (window._cmsGallery && window._cmsGallery.length) cachePayload.gallery = window._cmsGallery;
      if (payload.before_after) cachePayload.before_after = payload.before_after;
      writeCache(cachePayload); // อัปเดต cache ทันทีหลัง save
      // ── re-apply ภาษาปัจจุบันทันทีหลัง save ──
      if (window._obLang) window._obLang.apply(window._obLang.current());
      toast('✓ บันทึกสำเร็จ!');
    } catch (err) {
      console.error(err);
      toast('เกิดข้อผิดพลาด: ' + err.message, true);
    } finally {
      saveBtn.textContent = '💾 บันทึก';
      saveBtn.disabled = false;
    }
  }

  /* ═══════════════════════════════════════════════════════
     10.  เพิ่ม / ลบ สินค้า
  ═══════════════════════════════════════════════════════ */
  function addProduct() {
    const grid = document.querySelector('.product-grid[data-cms-products]');
    if (!grid) return;
    const cards = grid.querySelectorAll('.product-card');
    const idx   = cards.length;
    const newP  = { code: `ID: NEW-${String(idx+1).padStart(3,'0')}`, name: 'ชื่อสินค้าใหม่', pattern: 'ลาย: -', color: '#bca58e', img: '' };
    const card  = buildProductCard(newP, idx);
    grid.insertBefore(card, grid.querySelector('.cms-add-product-btn'));
    if (editMode) {
      card.querySelector('[data-cms-product-field]') && bindProductEditors();
      const delBtn = card.querySelector('.cms-delete-card-btn');
      if (delBtn) delBtn.style.display = 'flex';
    }
    toast('เพิ่มสินค้าแล้ว — กรอกข้อมูลแล้วกดบันทึก');
  }

  function deleteProduct(idx) {
    if (!confirm('ลบสินค้านี้?')) return;
    const grid = document.querySelector('.product-grid[data-cms-products]');
    if (!grid) return;
    const card = grid.querySelector(`[data-cms-product-idx="${idx}"]`);
    if (card) card.remove();
    grid.querySelectorAll('.product-card').forEach((c, i) => {
      c.dataset.cmsProductIdx = i;
    });
    toast('ลบสินค้าแล้ว — กดบันทึกเพื่อยืนยัน');
  }

  /* ═══════════════════════════════════════════════════════
     11.  Auth — ตรวจว่า login อยู่ไหม
  ═══════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════
     SYNC: อ่านจาก HTML → เขียนลง Firebase
  ═══════════════════════════════════════════════════════ */
  async function syncFromHTML() {
    if (!currentUser) { toast('กรุณา login ก่อน', true); return; }
    if (!confirm('ซิงค์ข้อมูลจากโค้ด HTML ไปเขียนทับ Firebase?\n\nข้อมูลที่เคยแก้จาก admin จะถูกแทนที่ด้วยค่าในโค้ด')) return;

    const syncBtn = document.getElementById('cms-btn-sync');
    syncBtn.textContent = '⏳ กำลังซิงค์...';
    syncBtn.disabled = true;

    try {
      const db = window._cmsDB;
      const { ref: dbRef, set } = window._firebaseDB;

      // ── ใช้ค่าต้นฉบับที่ snapshot ไว้ก่อน applyData จะเขียนทับ ──
      const texts = { ..._htmlOriginal.texts };
      const images = { ..._htmlOriginal.images };

      // ── products (อ่านจาก DOM ได้เลย เพราะ render ใหม่ทุกครั้ง) ──
      const products = [];
      const grid = document.querySelector('.product-grid[data-cms-products]');
      if (grid) {
        grid.querySelectorAll('.product-card').forEach(card => {
          products.push({
            code:    (card.querySelector('[data-cms-product-field$=":code"]')    || {}).innerText || '',
            name:    (card.querySelector('[data-cms-product-field$=":name"]')    || {}).innerText || '',
            pattern: (card.querySelector('[data-cms-product-field$=":pattern"]') || {}).innerText || '',
            color:   (card.querySelector('.pattern-dot') || {}).style?.background || '#ccc',
            img:     (card.querySelector('img') || {}).src || '',
            price:    (card.querySelector('[data-cms-product-field$=":price"]')    || {}).innerText || '',
            discount: (card.querySelector('[data-cms-product-field$=":discount"]') || {}).innerText || '',
            size:     (card.querySelector('[data-cms-product-field$=":size"]')     || {}).innerText || '',
            thick:    (card.querySelector('[data-cms-product-field$=":thick"]')    || {}).innerText || '',
            groove:   (card.querySelector('[data-cms-product-field$=":groove"]')   || {}).innerText || '',
          });
        });
      }

      const payload = { texts };
      if (Object.keys(images).length) payload.images = images;
      if (products.length) payload.products = products;
      // ── แผนที่ ──
      if (_htmlOriginal.mapSrc) payload.mapSrc = _htmlOriginal.mapSrc;

      await set(dbRef(db, `pages/${PAGE}`), payload);

      // ── อัปเดต cache + เขียนลง DOM ทันทีโดยไม่กระพริบ ──
      writeCache(payload);
      // applyData จะเรียก revealPage + _obLang.apply ให้อีกครั้งเองแล้ว
      applyData(payload);
      toast('✓ ซิงค์จากโค้ดสำเร็จ!');
    } catch (err) {
      console.error(err);
      toast('ซิงค์ไม่สำเร็จ: ' + err.message, true);
    } finally {
      syncBtn.textContent = '🔄 ซิงค์จากโค้ด';
      syncBtn.disabled = false;
    }
  }

  function initAuth() {
    const auth = window._cmsAuth;
    const { onAuthStateChanged, signOut } = window._firebaseAuth;

    // บันทึกหน้าปัจจุบันลง localStorage เสมอ (เพื่อให้ admin.html รู้ว่าจะ redirect ไปไหน)
    try {
      const currentFile = location.pathname.split('/').pop() || 'home.html';
      if (currentFile && currentFile !== 'admin.html') {
        localStorage.setItem('cms_lastPage', currentFile);
      }
    } catch(e) {}

    onAuthStateChanged(auth, user => {
      currentUser = user;
      const bar = document.getElementById('cms-bar');
      if (!bar) return;

      if (user) {
        bar.style.display = '';
        loadContent().then(() => {
          // auto-open edit mode ถ้า URL มี ?edit=1 (มาจาก admin redirect)
          if (location.search.includes('edit=1')) {
            // ลบ param ออกจาก URL โดยไม่ reload
            const clean = location.pathname + location.hash;
            history.replaceState(null, '', clean);
            enableEditMode();
            toast('✏️ โหมดแก้ไขเปิดอัตโนมัติ');
          }
        });
      } else {
        bar.style.display = 'none';
        loadContent();
        // ถ้า URL มี ?edit=1 แต่ยัง logout → redirect ไป admin.html เพื่อ login ก่อน
        if (location.search.includes('edit=1')) {
          try { sessionStorage.setItem('cms_returnTo', location.href); } catch(e) {}
          window.location.href = 'admin.html';
        }
      }
    });

    document.getElementById('cms-btn-logout').addEventListener('click', () => {
      signOut(auth).then(() => { disableEditMode(); toast('ออกจากระบบแล้ว'); });
    });
  }

  /* ═══════════════════════════════════════════════════════
     12.  เชื่อม Events ทั้งหมด
  ═══════════════════════════════════════════════════════ */
  function bindEvents() {
    document.getElementById('cms-btn-toggle').addEventListener('click', () => {
      if (!currentUser) { alert('กรุณา login ก่อน'); return; }
      enableEditMode();
    });

    document.getElementById('cms-btn-save').addEventListener('click', saveAll);

    document.getElementById('cms-btn-sync').addEventListener('click', syncFromHTML);

    document.getElementById('cms-btn-cancel').addEventListener('click', () => {
      disableEditMode();
      loadContent();
    });

    // ── image modal ──
    document.getElementById('cms-file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      _currentImgFile = file;
      const preview = document.getElementById('cms-img-modal-preview');
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
    });

    document.getElementById('cms-img-confirm-btn').addEventListener('click', () => {
      if (!_currentImgFile || !_currentImgTarget) { closeImgModal(); return; }
      const el  = _currentImgTarget;
      el._pendingFile = _currentImgFile;
      // Create object URL — admin sees new image immediately, no flicker back to old
      const url = URL.createObjectURL(_currentImgFile);
      // Store it so we can revoke after Cloudinary upload (memory cleanup)
      if (el._pendingObjectUrl) URL.revokeObjectURL(el._pendingObjectUrl);
      el._pendingObjectUrl = url;
      if (el.tagName === 'IMG') {
        el.src = url;
      } else {
        el.style.backgroundImage = `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.45)), url('${url}')`;
      }
      closeImgModal();
      toast('เลือกรูปแล้ว — กดบันทึกเพื่ออัปโหลด');
    });

    document.getElementById('cms-img-cancel-btn').addEventListener('click', closeImgModal);
    document.getElementById('cms-img-modal').addEventListener('click', e => {
      if (e.target === document.getElementById('cms-img-modal')) closeImgModal();
    });

    // ── ปุ่มเพิ่มสินค้า ──
    document.querySelectorAll('.cms-add-product-btn').forEach(btn => {
      btn.addEventListener('click', addProduct);
    });
  }

  /* ═══════════════════════════════════════════════════════
     13.  Bootstrap
  ═══════════════════════════════════════════════════════ */
  function init() {
    document.body.classList.remove('cms-editing');
    injectBar();
    bindEvents();
    initAuth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForFirebase(init));
  } else {
    waitForFirebase(init);
  }

})();