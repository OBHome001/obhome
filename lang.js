/* ════════════════════════════════════════════════════════
   OB HOME — Language Switcher  (lang.js)  v2
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const T = {
    /* ── NAVBAR ── */
    nav_home:         { th:'หน้าแรก',            en:'Home' },
    nav_products:     { th:'สินค้า',              en:'Products' },
    nav_projects:     { th:'ผลงานติดตั้ง',       en:'Projects' },
    nav_reviews:      { th:'รีวิวลูกค้า',        en:'Reviews' },
    nav_contact:      { th:'ติดต่อเรา',           en:'Contact' },
    nav_spc:          { th:'แผ่นผนัง SPC',            en:'SPC Flooring' },
    nav_lath:         { th:'ไม้ระแนง WPC',            en:'WPC Lath Wood' },
    nav_wooden:       { th:'ไม้สั่งตัด',          en:'Custom Wood' },
    nav_stainless:    { th:'สแตนเลส',          en:'Stainless' },
    nav_furniture:    { th:'เฟอร์นิเจอร์ฟิตติ้ง',          en:'Furniture Fittings' },
    nav_accessories:  { th:'ฮาร์ดแวร์ & อุปกรณ์ติดตั้ง',     en:'Hardware & Accessories' },

    /* ── HOME ── */
    hero_tag:         { th:'OB HOME MATERIALS',   en:'OB HOME MATERIALS' },
    hero_title:       { th:'ศูนย์รวมสินค้า<br><strong><i>ไม้ระแนง</i> & <i>แผ่น SPC</i></strong>', en:'Your One-Stop Shop<br><strong><i>Lath Wood</i> & <i>SPC Flooring</i></strong>' },
    hero_desc:        { th:'วัสดุตกแต่งคุณภาพสูง พร้อมทีมติดตั้งมืออาชีพ', en:'Premium decor materials with professional installation team' },
    hero_btn:         { th:'ดูหมวดสินค้า 🛒',    en:'Browse Products 🛒' },
    highlights_tag:   { th:'WHY CHOOSE US',       en:'WHY CHOOSE US' },
    highlights_title: { th:'จุดเด่นของ <b>OB HOME</b>', en:'Why Choose <b>OB HOME</b>' },
    high1_title:      { th:'วัสดุคุณภาพสูง',      en:'Premium Materials' },
    high1_desc:       { th:'คัดสรรวัสดุที่สวยงาม แข็งแรง และเหมาะกับการใช้งานจริง', en:'Carefully selected beautiful, durable, and practical materials' },
    high2_title:      { th:'ทีมช่างมืออาชีพ',    en:'Professional Team' },
    high2_desc:       { th:'ประสบการณ์ติดตั้งจริงมากกว่า 5 ปี พร้อมดูแลทุกขั้นตอน', en:'Over 5 years of installation experience, supporting every step' },
    high3_title:      { th:'ราคาคุ้มค่า',         en:'Great Value' },
    high3_desc:       { th:'ราคาโรงงาน คุ้มค่าทุกบาท คุณภาพระดับพรีเมียม', en:'Factory pricing, premium quality, best value for money' },
    high4_title:      { th:'บริการหลังการขาย',   en:'After-Sales Service' },
    high4_desc:       { th:'ดูแลลูกค้าต่อเนื่อง ไม่ทิ้งหลังขาย พร้อมให้คำปรึกษา', en:'Ongoing support after every sale, always ready to advise' },
    reviews_tag:      { th:'CUSTOMER REVIEW',     en:'CUSTOMER REVIEW' },
    reviews_title:    { th:'เสียงตอบรับจาก <b>ลูกค้าจริง</b>', en:'What Our <b>Customers Say</b>' },
    reviews_desc:     { th:'ลูกค้าหลายร้อยครัวเรือนไว้วางใจเลือกใช้วัสดุและบริการจาก OB HOME<br>มาดูประสบการณ์จริงจากลูกค้าของเราได้เลย', en:'Hundreds of households trust OB HOME.<br>See real experiences from our customers.' },
    stat_household:   { th:'ครัวเรือน',           en:'Households' },
    stat_rating:      { th:'คะแนนเฉลี่ย',        en:'Avg. Rating' },
    stat_years:       { th:'ประสบการณ์',          en:'Experience' },
    years:            { th:'2 ปี',                en:'2 Years' },
    reviews_btn:      { th:'ดูรีวิวทั้งหมด →',   en:'View All Reviews →' },
    ba_title:         { th:'เปลี่ยนพื้นที่ธรรมดา<br>ให้กลายเป็น <b>มุมพิเศษ !</b>', en:'Transform Ordinary Spaces<br>into <b>Something Special!</b>' },
    ba_btn:           { th:'ดูเพิ่มเติม →',       en:'View More →' },
    products_tag:     { th:'PRODUCTS',            en:'PRODUCTS' },
    products_title:   { th:'หมวดหมู่ <b>สินค้า</b>', en:'Product <b>Categories</b>' },
    prod1_name:       { th:'ไม้ระแนง',            en:'Lath Wood' },
    prod2_name:       { th:'แผ่น SPC',            en:'SPC Flooring' },
    prod3_name:       { th:'ผนังตกแต่ง',          en:'Wall Panel' },
    prod4_name:       { th:'อุปกรณ์ติดตั้ง',     en:'Accessories' },
    prod5_name:       { th:'ไม้สั่งตัด',          en:'Custom Wood' },
    prod_btn:         { th:'ดูสินค้าเพิ่มเติม',  en:'View Products' },
    projects_tag:     { th:'OUR PROJECTS',        en:'OUR PROJECTS' },
    projects_title:   { th:'ผลงาน <b>ติดตั้ง</b>', en:'Installation <b>Projects</b>' },
    projects_desc:    { th:'รีโนเวทผนังและพื้นด้วยวัสดุคุณภาพสูง ติดตั้งจบภายในวันเดียว', en:'Wall and floor renovation with premium materials. Completed in one day.' },
    projects_btn:     { th:'ดูผลงานติดตั้ง',     en:'View All Projects' },
    proj1_title:      { th:'งานไม้ระแนงห้องนั่งเล่น', en:'Living Room Lath Wood' },
    proj1_desc:       { th:'ตกแต่งผนังสไตล์ Modern Luxury', en:'Modern Luxury wall decoration' },
    proj2_title:      { th:'งานแผ่น SPC',         en:'SPC Flooring Installation' },
    proj2_desc:       { th:'แผ่นสวย ลวดลายดี ดูแลรักษาง่าย', en:'Beautiful patterns, easy to maintain' },
    proj3_title:      { th:'งานผนังตกแต่ง',       en:'Decorative Wall Panel' },
    proj3_desc:       { th:'เพิ่มมิติให้พื้นที่ภายในบ้าน', en:'Add dimension to your living space' },
    contact_tag:      { th:'CONTACT',             en:'CONTACT' },
    contact_title:    { th:'ติดต่อ <b>OB HOME</b>', en:'Contact <b>OB HOME</b>' },
    contact_phone:    { th:'091-7036286',          en:'091-7036286' },
    contact_line:     { th:'@203fmurc',            en:'@203fmurc' },
    contact_fb:       { th:'OB HOME ไม้ระแนงพัทยา ราคาถูก', en:'OB HOME Pattaya' },
    contact_hours:    { th:'จันทร์ - เสาร์ / 07:30 - 17:00 น.', en:'Mon - Sat / 07:30 - 17:00' },
    contact_addr:     { th:'54/13 หมู่ 1 3240 ตำบล หนองปรือ,<br> อำเภอ บางละมุง,<br> จังหวัด ชลบุรี 20150', en:'54/13 Moo 1 Tambon Nong Prue,<br>Amphoe Bang Lamung,<br> Chang Wat Chon Buri 20150' },
    lbl_tel:          { th:'โทร',                 en:'Tel' },
    lbl_hours:        { th:'เวลาทำการ',           en:'Opening Hours' },
    lbl_address:      { th:'ที่อยู่',              en:'Address' },
    btn_tel:          { th:'โทรเลย',              en:'Call Now' },
    footer_text:      { th:'© 2026 OB HOME Materials Co., Ltd. All Rights Reserved.', en:'© 2026 OB HOME Materials Co., Ltd. All Rights Reserved.' },
    footer_privacy:   { th:'นโยบายความเป็นส่วนตัว', en:'Privacy Policy' },
    promo_badge:      { th:'🔥 โปรโมชั่น',        en:'🔥 Promotion' },
    promo_cta:        { th:'สอบถามราคา',          en:'Inquire Now' },

    /* ── PRODUCT PAGES (lath/spc/wooden/wallpanel/accessories) ── */
    filter_sort_label:{ th:'เรียงตาม',            en:'Sort by' },
    filter_default:   { th:'-- ค่าเริ่มต้น --',  en:'-- Default --' },
    filter_price_asc: { th:'ราคา: น้อย → มาก',   en:'Price: Low → High' },
    filter_price_desc:{ th:'ราคา: มาก → น้อย',   en:'Price: High → Low' },
    filter_groove_deep:       { th:'ร่อง: ลึก',              en:'Groove: Deep' },
    filter_groove_shallow:    { th:'ร่อง: ตื้น',             en:'Groove: Shallow' },
    filter_groove_curve:      { th:'ร่อง: เว้าโค้ง',         en:'Groove: Curved' },
    filter_groove_shallow3:   { th:'ร่อง: ตื้น 3 รอน',      en:'Groove: Shallow 3-Rib' },
    filter_groove_halfcircle: { th:'ร่อง: รอนโค้งครึ่งวงกลม', en:'Groove: Half-Circle Rib' },
    filter_groove_largerib:   { th:'ร่อง: ตื้นรอนใหญ่',     en:'Groove: Large Rib' },
    filter_groove_wide:       { th:'ร่อง: ตื้นหน้ากว้าง',   en:'Groove: Wide Face' },
    filter_groove_flat:       { th:'ร่อง: แผ่นเรียบ',        en:'Groove: Flat' },
    filter_groove_acoustic:   { th:'ร่อง: เก็บเสียง',        en:'Groove: Acoustic' },
    filter_clear:     { th:'ล้างทั้งหมด',         en:'Clear All' },
    filter_noresult:  { th:'ไม่พบสินค้าที่ตรงกัน', en:'No matching products found' },
    filter_showing:   { th:'แสดง',                en:'Showing' },
    filter_items:     { th:'รายการ',              en:'items' },
    lbl_price:        { th:'ราคา',                en:'Price' },
    lbl_special_price:{ th:'ราคาพิเศษ',          en:'Special Price' },
    lbl_groove:       { th:'ร่อง',               en:'Groove' },
    lbl_size:         { th:'ขนาด',               en:'Size' },
    lbl_thick:        { th:'ความหนา',            en:'Thickness' },
    lbl_pattern:      { th:'ลาย / สี',           en:'Pattern / Color' },
    btn_line_inquiry: { th:'สอบถามทาง LINE',     en:'Inquire via LINE' },
    btn_tel_inquiry:  { th:'โทรสอบถาม',          en:'Call to Inquire' },
    modal_hint:       { th:'คลิกที่รูปหรือกด ESC เพื่อปิด', en:'Click image or press ESC to close' },
    section_lath:     { th:'Premium ไม้ระแนง',   en:'Premium Lath Wood' },
    section_spc:      { th:'Premium แผ่น SPC',   en:'Premium SPC Flooring' },
    section_wooden:   { th:'Premium ไม้สั่งตัด', en:'Premium Custom Wood' },
    section_wallpanel:{ th:'Premium ผนังตกแต่ง', en:'Premium Wall Panel' },
    section_acc:      { th:'Premium อุปกรณ์',    en:'Premium Accessories' },
    btn_view:         { th:'ดูรายละเอียด',    en:'View Details' },
    pattern_label:      { th:'ลาย',                en:'Pattern' },

    /* ── REVIEWS PAGE ── */
    rev_label:        { th:'CUSTOMER REVIEW',     en:'CUSTOMER REVIEW' },
    rev_title:        { th:'รีวิวลูกค้า',         en:'Customer Reviews' },
    rev_subtitle:     { th:'รวมรีวิวจากลูกค้าจริง ทั้งรูปภาพและวิดีโอ', en:'Real customer reviews — photos and videos' },

    /* ── INSTALLATIONS PAGE ── */
    inst_label:       { th:'OUR WORK',            en:'OUR WORK' },
    inst_title:       { th:'ผลงานการติดตั้ง',    en:'Installation Projects' },
    inst_subtitle:    { th:'รวมผลงานจริงจากลูกค้าของเรา ทั้งรูปภาพและวิดีโอ', en:'Real projects from our customers — photos and videos' },

    /* ── BEFORE & AFTER PAGE ── */
    ba_label:         { th:'BEFORE & AFTER',      en:'BEFORE & AFTER' },
    ba_page_title:    { th:'ก่อน & หลัง',         en:'Before & After' },
    ba_subtitle:      { th:'เห็นความแตกต่างได้ชัดเจน ก่อนและหลังการติดตั้ง', en:'See the clear difference before and after installation' },

    /* ── CHATBOT ── */
    chat_header:      { th:'ช่องทางติดต่อ',       en:'Contact Us' },
    chat_line_sub:    { th:'OB HOME ไม้ระแนงพัทยา', en:'OB HOME Pattaya' },
    chat_call:        { th:'โทรหาเรา',            en:'Call Us' },

    /* ── PAGE TITLES ── */
    title_home:       { th:'OB HOME - วัสดุแต่งบ้านคุณภาพ', en:'OB HOME - Quality Home Materials' },
    title_lath:       { th:'ไม้ระแนงทุกแบบ - OB HOME', en:'All Lath Wood - OB HOME' },
    title_spc:        { th:'แผ่น SPC Marble Board - OB HOME', en:'SPC Marble Board - OB HOME' },
    title_wooden:     { th:'ไม้สั่งตัด - OB HOME', en:'Custom Wood - OB HOME' },
    title_wallpanel:  { th:'ผนังตกแต่ง - OB HOME', en:'Wall Panel - OB HOME' },
    title_accessories:{ th:'อุปกรณ์ติดตั้ง - OB HOME', en:'Accessories - OB HOME' },
    title_reviews:    { th:'รีวิวลูกค้า - OB HOME', en:'Customer Reviews - OB HOME' },
    title_installations:{ th:'ผลงานติดตั้ง - OB HOME', en:'Installation Projects - OB HOME' },
    title_ba:         { th:'Before & After - OB HOME', en:'Before & After - OB HOME' },
  };

  const STORAGE_KEY = 'ob_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'th';

  function t(key) {
    return (T[key] && T[key][currentLang]) || null;
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    /* 1. data-cms-text */
    document.querySelectorAll('[data-cms-text]').forEach(el => {
      const v = T[el.dataset.cmsText];
      if (v && v[lang] !== undefined) el.innerHTML = v[lang];
    });

    /* 2. data-lang */
    document.querySelectorAll('[data-lang]').forEach(el => {
      const v = T[el.dataset.lang];
      if (v && v[lang] !== undefined) el.innerHTML = v[lang];
    });

    /* 3. <title> */
    const pageKey = document.body.dataset.langPage;
    if (pageKey && T[pageKey] && T[pageKey][lang]) {
      document.title = T[pageKey][lang];
    }

    /* 4. <select> options (filter/sort) */
    document.querySelectorAll('option[data-lang]').forEach(el => {
      const v = T[el.dataset.lang];
      if (v && v[lang] !== undefined) el.textContent = v[lang];
    });

    /* 5. html lang attribute */
    document.documentElement.lang = lang;

    /* 6. switcher active state */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('lang-active', btn.dataset.langTarget === lang);
    });

    /* 7. remove anti-flash style */
    const antiFlash = document.getElementById('lang-anti-flash');
    if (antiFlash) antiFlash.remove();

    /* 8. re-apply lang to dynamically created cards (cms products) */
    document.querySelectorAll('[data-lang]').forEach(el => {
      const v = T[el.dataset.lang];
      if (v && v[lang] !== undefined) el.innerHTML = v[lang];
    });

    /* 9. re-render product price tags (innerHTML ถูก hardcode ไว้ — ต้อง rebuild ใหม่) */
    const priceLbl  = (T['lbl_price']  && T['lbl_price'][lang])  || 'ราคา';
    const grooveLbl = (T['lbl_groove'] && T['lbl_groove'][lang]) || 'ร่อง';
    document.querySelectorAll('.product-card').forEach(card => {
      /* price tag */
      const tag = card.querySelector('.product-price-tag');
      if (tag) {
        const price    = (card.dataset.pdmPrice    || '').trim();
        const discount = (card.dataset.pdmDiscount || '').trim();
        if (price && discount) {
          tag.innerHTML = '<span class="price-original">' + priceLbl + ': ' + price + ' ฿</span>'
            + '<span class="price-discount">' + discount + ' ฿</span>';
        } else if (price) {
          tag.innerHTML = priceLbl + ': ' + price + ' ฿';
          tag.style.display = '';
        }
      }
      /* groove label */
      const grooveSpan = card.querySelector('.product-groove-tag [data-lang="lbl_groove"]');
      if (grooveSpan) grooveSpan.textContent = grooveLbl;
    });
  }

  function createSwitcher() {
    const wrap = document.createElement('li');
    wrap.className = 'lang-switcher';
    wrap.innerHTML = `
      <button class="lang-btn lang-btn-th" data-lang-target="th" aria-label="ภาษาไทย">TH</button>
      <span class="lang-divider">|</span>
      <button class="lang-btn lang-btn-en" data-lang-target="en" aria-label="English">EN</button>`;
    wrap.querySelector('.lang-btn-th').addEventListener('click', () => applyLang('th'));
    wrap.querySelector('.lang-btn-en').addEventListener('click', () => applyLang('en'));
    return wrap;
  }

  function injectSwitcher() {
    const nav = document.getElementById('navLinks');
    if (!nav || nav.querySelector('.lang-switcher')) return;
    nav.appendChild(createSwitcher());
  }

  function injectCSS() {
    if (document.getElementById('lang-style')) return;
    const s = document.createElement('style');
    s.id = 'lang-style';
    s.textContent = `
      .lang-switcher{display:flex;align-items:center;gap:4px;padding:0 6px;margin-left:4px}
      .lang-btn{background:transparent;border:1.5px solid rgba(255,255,255,.35);color:rgba(255,255,255,.75);font-size:.8rem;font-weight:600;letter-spacing:.06em;padding:4px 9px;border-radius:6px;cursor:pointer;font-family:inherit;transition:background .18s,color .18s,border-color .18s;line-height:1}
      .lang-btn:hover{background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.6)}
      .lang-btn.lang-active{background:rgba(255,255,255,.22);color:#fff;border-color:rgba(255,255,255,.7)}
      .lang-divider{color:rgba(255,255,255,.3);font-size:.75rem;user-select:none}
      @media(max-width:768px){
        .lang-switcher{justify-content:flex-start;padding:8px 14px;margin-left:0;border-top:1px solid rgba(255,255,255,.1);margin-top:4px}
        .lang-btn{font-size:.85rem;padding:6px 14px}
      }`;
    document.head.appendChild(s);

    /* ── Anti-flash: ถ้า lang=en ให้ซ่อน [data-lang] ก่อน จนกว่าจะ apply เสร็จ ── */
    if (currentLang !== 'th') {
      const antiFlash = document.createElement('style');
      antiFlash.id = 'lang-anti-flash';
      antiFlash.textContent = '[data-lang],[data-cms-text]{visibility:hidden!important}';
      document.head.appendChild(antiFlash);
    }
  }

  function init() {
    injectCSS();
    injectSwitcher();
    applyLang(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window._obLang = { apply: applyLang, current: () => currentLang, t };
})();