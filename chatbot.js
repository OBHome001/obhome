/**
 * OB HOME Chatbot — Keyword-based
 * inject ตัวเองเข้า chat widget ที่มีอยู่ทุกหน้า
 * ไม่ต้องแก้ไฟล์ HTML ใดๆ
 */
(function () {
  'use strict';
  

  /* ═══════════════════════════════════════════════════
     1.  KNOWLEDGE BASE — แก้ตรงนี้เพื่ออัปเดตข้อมูล
  ═══════════════════════════════════════════════════ */
  const KB = [
    // ── ทักทาย ──
    {
      keys: ['สวัสดี','หวัดดี','hello','hi','ดีครับ','ดีค่ะ','ไหมครับ','ไหมคะ','มีไหม','มีอะไร'],
      answer: `สวัสดีครับ! ยินดีต้อนรับสู่ **OB HOME Materials** 🏠\n\nเราจำหน่าย:\n• ไม้ระแนง\n• แผ่น SPC\n• ผนังตกแต่ง\n• ไม้สั่งตัด\n• อุปกรณ์ติดตั้ง\n\nพิมพ์ชื่อสินค้าที่สนใจได้เลยครับ หรือถามคำถามอื่นๆ ได้เลย 😊`
    },

    // -- คุยเล่น --
    {
      keys: ['ชื่อ','ชื่ออะไร','คุณคือใคร','ทำอะไรได้บ้าง','ช่วยอะไรได้บ้าง','ช่วยอะไรได้บ้าง','ช่วยอะไรได้','ช่วยอะไรได้บ้างครับ','ช่วยอะไรได้บ้างคะ'],
      answer: `สวัสดีครับ! ยินดีต้อนรับสู่ **OB HOME Materials** 🏠\n\n ฉันชื่อ OB BOT !\nฉันมีหน้าที่ !!! ตอบคำถาม เช่น\n• ไม้ระแนง\n• แผ่น SPC\n• ผนังตกแต่ง\n• ไม้สั่งตัด\n• อุปกรณ์ติดตั้ง\n\nพิมพ์ชื่อสินค้าที่สนใจได้เลยครับ หรือถามคำถามอื่นๆ ได้เลย 😊`
    },

    // ── ไม้ระแนง ──
    {
      keys: ['ไม้ระแนง','ระแนง','lath','wood slat'],
      answer: `**ไม้ระแนง OB HOME** 🪵\n\nมีให้เลือกหลายขนาดและสี เหมาะสำหรับ:\n• ผนังภายใน/ภายนอก\n• เพดาน\n• ฉากกั้นห้อง\n• ระเบียงและสวน\n\n📐 ขนาดมาตรฐาน: 1×4, 1×6, 2×4 นิ้ว\n🎨 มีหลายสีให้เลือก\n\nดูสินค้าได้ที่ <a href="/lath" style="color:var(--warm)">หน้าไม้ระแนง</a> หรือติดต่อสอบถามราคาได้เลยครับ 📞 091-703-6286`
    },

    // ── SPC ──
    {
      keys: ['spc','แผ่น spc','พื้น spc','กระเบื้อง spc','vinyl','วีนิล'],
      answer: `**แผ่น SPC OB HOME** ✨\n\nStone Plastic Composite คุณภาพพรีเมียม:\n• กันน้ำ 100% เหมาะห้องน้ำ ครัว\n• ทนทาน ไม่โก่ง ไม่บวม\n• ติดตั้งง่าย ระบบ Click-Lock\n• ลวดลายสวย เหมือนไม้จริง\n\n📐 ขนาด: 18×122 ซม. / 23×152 ซม.\n📏 ความหนา: 4mm, 5mm, 6mm\n\nดูสินค้าได้ที่ <a href="/spc" style="color:var(--warm)">หน้า SPC</a> ครับ`
    },

    // ── ผนัง / Wall Panel ──
    {
      keys: ['ผนัง','wall panel','วอลล์','วอล','wall','แผ่นผนัง','ตกแต่งผนัง'],
      answer: `**ผนังตกแต่ง OB HOME** 🏡\n\nแผ่นตกแต่งผนังสไตล์พรีเมียม:\n• WPC (Wood Plastic Composite)\n• PVC ลายไม้และหิน\n• ติดตั้งง่าย ไม่ต้องฉาบปูน\n• กันน้ำ กันปลวก ทนทาน\n\nเหมาะสำหรับทั้งภายในและภายนอก\n\nดูสินค้าได้ที่ <a href="/wallpanel" style="color:var(--warm)">หน้าผนังตกแต่ง</a> ครับ`
    },

    // ── ไม้สั่งตัด ──
    {
      keys: ['ไม้สั่งตัด','สั่งตัด','ตัดไม้','custom','ไม้จริง','ไม้แปรรูป'],
      answer: `**ไม้สั่งตัด OB HOME** 🪚\n\nบริการตัดไม้ตามขนาดที่ต้องการ:\n• ไม้จริงคุณภาพดี\n• ตัดได้ทุกขนาดตามสั่ง\n• รองรับงานโปรเจกต์ทุกขนาด\n\n📞 แนะนำโทรปรึกษาก่อนสั่งครับ\n091-703-6286\n\nดูข้อมูลเพิ่มเติมที่ <a href="/wooden" style="color:var(--warm)">หน้าไม้สั่งตัด</a>`
    },

    // ── อุปกรณ์ ──
    {
      keys: ['อุปกรณ์','accessories','น็อต','สกรู','คลิป','clip','screw','กาว','กาวติด'],
      answer: `**อุปกรณ์ติดตั้ง OB HOME** 🔧\n\nครบครันทุกอย่างที่ต้องการ:\n• คลิปล็อค / Hidden Clip\n• สกรูและน็อตสเตนเลส\n• กาวและซิลิโคน\n• อุปกรณ์เสริมต่างๆ\n\nดูสินค้าได้ที่ <a href="/accessories" style="color:var(--warm)">หน้าอุปกรณ์</a> ครับ`
    },

    // ── ราคา ──
    {
      keys: ['ราคา','price','เท่าไหร่','เท่าไร','ค่า','cost','งบ','budget','ถูก','แพง'],
      answer: `**ราคาสินค้า OB HOME** 💰\n\nราคาขึ้นอยู่กับชนิดและขนาดสินค้าครับ\n\nแนะนำติดต่อสอบถามโดยตรง เพื่อรับราคาที่ดีที่สุด:\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**\n📘 Facebook: **OB HOME ไม้ระแนงพัทยา**\n\n⏰ จ-ส 07:30–17:00 น.`
    },

    // ── การสั่งซื้อ ──
    {
      keys: ['สั่ง','order','ซื้อ','buy','จัดส่ง','ส่ง','delivery','shipping','โอน','เงิน','ชำระ','จ่าย'],
      answer: `**วิธีสั่งซื้อ OB HOME** 🛒\n\n1. ติดต่อเรา LINE/Facebook/โทร\n2. แจ้งชนิดสินค้า ขนาด จำนวน\n3. รับใบเสนอราคา\n4. โอนเงินมัดจำ\n5. นัดรับหรือจัดส่ง\n\n📍 มีบริการจัดส่งทั่วประเทศ\n\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**`
    },

    // ── ที่อยู่ / แผนที่ ──
    {
      keys: ['ที่อยู่','แผนที่','map','อยู่ที่ไหน','location','ตั้งอยู่','พัทยา','ชลบุรี','ไปยังไง','เดินทาง','ติดต่อเรา'],
      answer: `**ที่ตั้ง OB HOME** 📍\n\nOB HOME Materials พัทยา ชลบุรี\n\n🗺️ ดูแผนที่ได้ที่หน้า <a href="/home#contact" style="color:var(--warm)">ติดต่อเรา</a>\n\n📞 **091-703-6286**\n⏰ จ-ส 07:30–17:00 น.\n\nโทรนัดหมายก่อนเดินทางได้เลยครับ`
    },

    // ── เวลาทำการ ──
    {
      keys: ['เปิด','ปิด','เวลา','กี่โมง','วันไหน','เสาร์','อาทิตย์','จันทร์','working hour','open','close'],
      answer: `**เวลาทำการ OB HOME** ⏰\n\n🟢 จันทร์ – เสาร์\n🕢 07:30 – 17:00 น.\n\n🔴 หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์\n\n📞 **091-703-6286**`
    },

    // ── ติดตั้ง ──
    {
      keys: ['ติดตั้ง','install','ช่าง','รับติด','บริการ','service'],
      answer: `**บริการติดตั้ง OB HOME** 🔨\n\nมีบริการแนะนำช่างติดตั้งในพื้นที่ครับ\n\nสอบถามรายละเอียดได้ที่:\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**\n\n⏰ จ-ส 07:30–17:00 น.`
    },

    // ── ผลงาน / รีวิว ──
    {
      keys: ['ผลงาน','รีวิว','review','ตัวอย่าง','before after','before','after','portfolio','งานที่ผ่านมา'],
      answer: `**ผลงานและรีวิว OB HOME** 🌟\n\nดูผลงานจริงได้เลยครับ:\n📸 <a href="/installations" style="color:var(--warm)">ผลงานติดตั้ง</a>\n⭐ <a href="/reviews" style="color:var(--warm)">รีวิวลูกค้า</a>\n🔄 <a href="/before-after" style="color:var(--warm)">Before & After</a>`
    },

    // ── LINE ──
    {
      keys: ['line','ไลน์','line id','ไลน์ไอดี','add line'],
      answer: `**LINE OB HOME** 💚\n\nLINE ID: **@203fmurc**\n\n👉 <a href="https://page.line.me/203fmurc?openQrModal=true" target="_blank" style="color:var(--warm)">คลิกเพื่อเพิ่มเพื่อน</a>\n\n⏰ ตอบกลับ จ-ส 07:30–17:00 น.`
    },

    // ── Facebook ──
    {
      keys: ['facebook','เฟส','fb','เฟสบุ๊ค'],
      answer: `**Facebook OB HOME** 📘\n\n👉 <a href="https://www.facebook.com/obhomestore" target="_blank" style="color:var(--warm)">OB HOME ไม้ระแนงพัทยา</a>\n\nติดตามเพื่อรับโปรโมชันและผลงานใหม่ๆ ครับ`
    },

    // ── ลูกเล่น ──
    {
      keys: ['หล่ม','วุ่นวาย','บ้าน','บ้านเอง','บ้านต้องการ','บ้านอยาก','สวย','สวยมาก','ดี','ดีเลย','เยี่ยม','ยอดเยี่ยม','โอเค','โอเคนะ','ใช่','ใช่แล้ว'],
      answer: `เยี่ยมไปเลยครับ! 🎉\n\nบ้านที่สวยงาม ต้องได้ตกแต่งด้วยวัสดุคุณภาพ\n\nOB HOME มีอะไรเหมาะสำหรับบ้านของคุณ:\n• **ไม้ระแนง** — สร้างบรรยากาศเป็นธรรมชาติ 🪵\n• **แผ่น SPC** — กันน้ำ ทนทาน ใจเย็นใจสบาย 💧\n• **ผนังตกแต่ง** — เปลี่ยนลุคห้องในพริบตา ✨\n\nมาช่วยบ้านของคุณสวยกว่านี้ได้ครับ! 📱 **091-703-6286**`
    },

    {
      keys: ['หิว','อยาก','ดื่ม','น้ำ','กาแฟ','ชา','โจ๊ก','กัน'],
      answer: `หิวสิครับ ไปดื่มน้ำหรือกาแฟสักแก้วสบายๆ ☕\n\nตัดสินใจเสร็จแล้วว่าจะตกแต่งบ้านด้วยอะไร มาคุยกันอีกครั้งได้เลยครับ 😊`
    },

    {
      keys: ['เบื่อ','เหนื่อย','ท้อ','วิตกกังวล','กังวล','เครียด','ปัญหา','ไม่ดี','เศร้า','ร้องไห้'],
      answer: `ขอให้แจ่มใจนะครับ! 💙\n\nบางครั้งตกแต่งห้องใจจริงๆ ช่วยให้รู้สึกดีขึ้นได้เลยครับ 🏠✨\n\nคุณอยากให้บ้านเป็นห้องพักใจสงบสำหรับตัวเอง ลองคิดดู OB HOME ช่วยได้แน่นอน\n\nมาถามรายละเอียดสินค้าใหม่ๆ ได้เลย 😌`
    },

    {
      keys: ['รักแร่','รักทะเล','ชอบทะเล','ชอบแร่','ชอบเที่ยว','ท่องเที่ยว','บ้านพัฒนา'],
      answer: `มีใจรักธรรมชาติใช่ไหมครับ! 🌴🏖️\n\nนั่นแหละ! ไม้และวัสดุธรรมชาติของ OB HOME จะช่วยให้บ้านของคุณเหมือน\nขนาดเล็กของสถานที่ที่คุณชอบได้เลยครับ 🪵\n\n• **ไม้ระแนง** — ให้รู้สึกเป็นธรรมชาติ 🌿\n• **แผ่น SPC** — เคลียร์แบบทะเลใจเย็น 💧\n\nมาช่วยสร้างเอกเทศในบ้านของคุณกันครับ 🏡`
    },

    {
      keys: ['ความฝัน','ฝัน','เปลี่ยนแปลง','ใหม่','ต้องการ','ปรารถนา'],
      answer: `ฝันสวยๆ ใช่ไหมครับ! 💭✨\n\nบ้านคุณสามารถเป็นไปตามความฝันได้!\nด้วย OB HOME ที่มี:\n• ไม้ระแนง หลายสี หลายสไตล์\n• แผ่น SPC ที่ทันสมัย\n• ผนังตกแต่งมากมายหลายแบบ\n\n📞 มาคุยกันเลยครับว่าต้องการอะไร: **091-703-6286**`
    },

    {
      keys: ['สุขสันต์','สุขสันต์วันเกิด','วันเกิด','วันครบรอบ','ฉลองเก่า'],
      answer: `สุขสันต์ด้วยครับ! 🎉🎂\n\nวันสำคัญ วันพิเศษสมควรได้บ้านที่สวยงาม\nเชิญให้เราช่วยตกแต่งบ้านของคุณให้สดใหม่ขึ้น! 🏠✨\n\nติดต่อเรา: 📞 **091-703-6286**`
    },

    {
      keys: ['โชคดี','โชค','ดวงดี','โชคลาภ','เฮง','รวย'],
      answer: `โชคดีด้วยครับ! 🍀✨\n\nสำหรับคนที่โชคดีเหมือนคุณ ควรมีบ้านที่สวยงามเท่ากับโชคของตัวเองแน่นอน! 🏠\n\nมา OB HOME เลือกสินค้าคุณภาพสร้างเสริมดวง 😊`
    },

    {
      keys: ['ขอบคุณครับ','ขอบคุณค่ะ','ขอบคุณจริงๆ','ขอบคุณมากมาย','thank you','thanks','thx'],
      answer: `ยินดีที่ได้ช่วยครับ! 🙏💛\n\nหากมีคำถามเพิ่มเติม หรืออยากสั่งซื้อสินค้า\nติดต่อเราได้เลยครับ:\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**`
    },

    {
      keys: ['ยา','ยาหาย','ไข้','ป่วย','หวัด','ปวด','เจ็บ'],
      answer: `เอ้า ขอให้หายเร็วนะครับ 💊\n\nพักผ่อนให้มากๆ ดื่มน้ำอุ่นๆ และตอนสวยใจแล้ว\nมาตกแต่งบ้านด้วยสินค้า OB HOME ให้เป็นที่พักใจที่สวยงาม 🏠\n\nได้ยิน ชอบอยู่บ้านสำหรับคนป่วย! 😊`
    },

    {
      keys: ['อร่อย','หรั่ง','ซั่ว','ชี่','เซียะ','หลิน','เฮง','ไหว','ง่ายปะ'],
      answer: `เอ้เอ้! 🤣\n\nท่านวิธีคุยเก่าๆ แบบ "ซั่ว" ใช่ไหมครับ\nเราเข้าใจความสนุกของท่าน 😄\n\nเดี๋ยวท่านหัวเราะเพราะเห็นบ้านตัวเองสวยสนิท\nด้วยสินค้า OB HOME ครับ! 🏠✨`
    },

    {
      keys: ['หนักแน่น','ต่ืน','ตื่น','นอนไม่หลับ','นิด','นิดหน่อย','หน่อยครับ','หน่อยค่ะ'],
      answer: `ตื่นเต้นใจรึไง กับบ้านใหม่ของคุณ! 😴✨\n\nไม้ระแนง และแผ่น SPC ของ OB HOME ก็มีคุณสมบัติผ่อนคลายให้บรรยากาศห้องนอนสบายๆ เหมาะที่สุด 🛏️💤\n\nมาช่วยให้นอนหลับสะใจด้วย OB HOME ได้ครับ`
    },

    {
      keys: ['อย่ามา','ไม่มา','ไม่ได้','ไม่ทำ','เลิก','ปิด','ไป','กลับ'],
      answer: `ได้ครับ ขอให้ฟิตแล้วเจอกันใหม่ 👋\n\nหากคิดจะตกแต่งบ้านสักวันนึง\nOB HOME ตั้งรอคอยให้บริการเสมอเลยครับ 🏠\n\n📞 **091-703-6286**`
    },

    // ── โทร ──
    {
      keys: ['โทร','phone','เบอร์','tel','call','091','0917'],
      answer: `**เบอร์โทร OB HOME** 📞\n\n**091-703-6286**\n\n👉 <a href="tel:0917036286" style="color:var(--warm)">กดเพื่อโทรเลย</a>\n\n⏰ จ-ส 07:30–17:00 น.`
    },

    // ── ขอบคุณ ──
    {
      keys: ['ขอบคุณ','thank','thanks','ขอบใจ','โอเค','ok','okay','ได้เลย','เข้าใจ'],
      answer: `ขอบคุณที่สนใจ OB HOME นะครับ 🙏\n\nมีคำถามอื่นๆ พิมพ์ถามได้เลย หรือติดต่อเราโดยตรง:\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**`
    },
  ];

  // fallback ถ้าไม่เจอ keyword
  const FALLBACK = `ขอโทษครับ ไม่เข้าใจคำถาม 😅\n\nลองถามเรื่อง:\n• **สินค้า** (ไม้ระแนง, SPC, ผนัง)\n• **ราคา** และ **การสั่งซื้อ**\n• **ที่อยู่** และ **เวลาทำการ**\n\nหรือติดต่อเราโดยตรง:\n📞 **091-703-6286**\n💬 LINE: **@203fmurc**`;

  /* ═══════════════════════════════════════════════════
     2.  MATCH ENGINE
  ═══════════════════════════════════════════════════ */
  function findAnswer(text) {
    const q = text.toLowerCase().trim();
    for (const item of KB) {
      if (item.keys.some(k => q.includes(k.toLowerCase()))) {
        return item.answer;
      }
    }
  
    return FALLBACK;
  }

  /* ═══════════════════════════════════════════════════
     3.  RENDER MARKDOWN-LITE → HTML
  ═══════════════════════════════════════════════════ */
  function renderMd(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /* ═══════════════════════════════════════════════════
     4.  INJECT CHAT PANEL UI
  ═══════════════════════════════════════════════════ */
  const HISTORY_KEY = 'ob_chat_history';

  function getHistory() {
    try { return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  }
  function saveHistory(h) {
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-40))); } catch {}
  }

  function injectBot() {
    const widget = document.getElementById('chatWidget');
    const options = document.getElementById('chatOptions');
    if (!widget || !options) return;

    // ── เพิ่ม style ──
    const style = document.createElement('style');
    style.textContent = `
      /* Chat tabs */
      .chat-tabs {
        display: flex;
        border-bottom: 1px solid rgba(188,165,142,.2);
        background: var(--warm, #bca58e);
        border-radius: 10px;
      }
      .chat-tab {
        flex: 1; padding: 10px 0;
        background: none; border: none;
        color: rgba(255,255,255,.7);
        font-size: .78rem; letter-spacing: .04em;
        font-family: 'Opun', 'IBM Plex Sans Thai', sans-serif;
        cursor: pointer; transition: color .2s, background .2s;
        border-radius: 10px;
      }
      .chat-tab.active {
        color: #fff;
        background: rgba(0,0,0,.12);
        font-weight: 700;
      }
      .chat-tab:hover { color: #fff; }

      /* Panel visibility */
      .chat-panel { display: none; }
      .chat-panel.active { display: flex; flex-direction: column; }

      /* Chat panel layout */
      #chatBotPanel {
        flex-direction: column;
        height: 420px;
      }

      /* Messages */
      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }
      .chatbot-messages::-webkit-scrollbar { width: 4px; }
      .chatbot-messages::-webkit-scrollbar-thumb { background: rgba(188,165,142,.3); border-radius: 4px; }

      .cb-msg {
        max-width: 84%;
        padding: 11px 15px;
        border-radius: 14px;
        font-size: .88rem;
        line-height: 1.7;
        animation: cbFadeIn .2s ease;
      }
      @keyframes cbFadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: none; }
      }
      .cb-msg.bot {
        align-self: flex-start;
        background: var(--off-white, #f3f1ec);
        color: #1a1a16;
        border-bottom-left-radius: 4px;
      }
      .cb-msg.user {
        align-self: flex-end;
        background: var(--warm, #bca58e);
        color: #fff;
        border-bottom-right-radius: 4px;
      }

      /* typing indicator */
      .cb-typing {
        align-self: flex-start;
        display: flex; gap: 4px; align-items: center;
        padding: 10px 14px;
        background: var(--off-white, #f3f1ec);
        border-radius: 14px 14px 14px 4px;
        animation: cbFadeIn .2s ease;
      }
      .cb-typing span {
        width: 6px; height: 6px;
        background: var(--warm, #bca58e);
        border-radius: 50%;
        animation: cbBounce 1s infinite;
      }
      .cb-typing span:nth-child(2) { animation-delay: .15s; }
      .cb-typing span:nth-child(3) { animation-delay: .3s; }
      @keyframes cbBounce {
        0%,60%,100% { transform: translateY(0); }
        30%          { transform: translateY(-5px); }
      }

      /* Quick replies */
      .cb-quick-replies {
        padding: 6px 12px 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        border-top: 1px solid rgba(188,165,142,.1);
      }
      .cb-quick-btn {
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid rgba(188,165,142,.4);
        background: transparent;
        color: var(--warm-dark, #8a7560);
        font-size: .8rem;
        font-family: 'Opun','IBM Plex Sans Thai', sans-serif;
        cursor: pointer;
        transition: background .2s, color .2s;
        white-space: nowrap;
      }
      .cb-quick-btn:hover {
        background: var(--warm, #bca58e);
        color: #fff;
        border-color: var(--warm, #bca58e);
      }

      /* Input row */
      .chatbot-input-row {
        display: flex;
        gap: 8px;
        padding: 10px 12px;
        border-top: 1px solid rgba(188,165,142,.2);
        background: #fff;
      }
      .chatbot-input {
        flex: 1;
        border: 1.5px solid rgba(188,165,142,.35);
        border-radius: 20px;
        padding: 10px 16px;
        font-size: .88rem;
        font-family: 'Opun','IBM Plex Sans Thai', sans-serif;
        outline: none;
        background: var(--off-white, #f3f1ec);
        transition: border-color .2s;
      }
      .chatbot-input:focus { border-color: var(--warm, #bca58e); }
      .chatbot-send {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--warm, #bca58e);
        color: #fff;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: background .2s, transform .15s;
      }
      .chatbot-send:hover { background: var(--warm-dark, #8a7560); transform: scale(1.08); }
      .chatbot-send svg { pointer-events: none; }
    `;
    document.head.appendChild(style);

    // ── ปรับ options panel: เพิ่ม tabs ──
    function getLang() {
      return (window._obLang && window._obLang.current()) || 'th';
    }
    const CHAT_I18N = {
      th: {
        tab_contact: 'ติดต่อเรา',
        tab_bot: '🤖 แชทบอท',
        header_contact: 'ช่องทางติดต่อ',
        fb_sub: 'OB HOME ไม้ระแนงพัทยา',
        call_label: 'โทรหาเรา',
        quick: ['ราคาสินค้า','ไม้ระแนง','แผ่น SPC','ที่อยู่ร้าน','วิธีสั่งซื้อ','ติดต่อเรา'],
        placeholder: 'พิมพ์คำถาม…',
        send_label: 'ส่ง',
      },
      en: {
        tab_contact: 'Contact Us',
        tab_bot: '🤖 Chatbot',
        header_contact: 'Contact Channels',
        fb_sub: 'OB HOME Pattaya',
        call_label: 'Call Us',
        quick: ['Pricing','Lath Wood','SPC Flooring','Store Location','How to Order','Contact Us'],
        placeholder: 'Type your question…',
        send_label: 'Send',
      },
    };

    /* ── Bot state (ประกาศก่อน ใช้ได้ทุกฟังก์ชัน) ── */
    let initialized = false;

    /* ── Helper: หา messagesEl จาก DOM เสมอ (ไม่ cache เพราะ rebuild ได้) ── */
    function getMsgsEl()  { return document.getElementById('cbMessages'); }
    function getInputEl() { return document.getElementById('cbInput'); }

    /* ── addMsg / showTyping / hideTyping ── */
    function addMsg(text, role) {
      const msgsEl = getMsgsEl();
      if (!msgsEl) return;
      const el = document.createElement('div');
      el.className = 'cb-msg ' + role;
      el.innerHTML = renderMd(text);
      msgsEl.appendChild(el);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      return el;
    }

    function showTyping() {
      const msgsEl = getMsgsEl();
      if (!msgsEl) return;
      const el = document.createElement('div');
      el.className = 'cb-typing'; el.id = 'cbTyping';
      el.innerHTML = '<span></span><span></span><span></span>';
      msgsEl.appendChild(el);
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }
    function hideTyping() {
      const el = document.getElementById('cbTyping');
      if (el) el.remove();
    }

    /* ── sendMessage ── */
    function sendMessage(text) {
      text = text.trim();
      if (!text) return;

      const inputEl = getInputEl();
      const history = getHistory();
      addMsg(text, 'user');
      history.push({ role: 'user', text });
      if (inputEl) inputEl.value = '';

      showTyping();
      setTimeout(() => {
        hideTyping();
        const ans = findAnswer(text);
        addMsg(ans, 'bot');
        history.push({ role: 'bot', text: ans });
        saveHistory(history);
      }, 400 + Math.random() * 300);
    }

    /* ── initBotSession ── */
    function initBotSession() {
      if (initialized) return;
      initialized = true;

      const history = getHistory();
      if (history.length > 0) {
        history.forEach(m => addMsg(m.text, m.role));
      } else {
        addMsg('สวัสดีครับ! 👋 ผมคือ OB Bot ช่วยตอบคำถามเกี่ยวกับสินค้าและบริการของ OB HOME\n\nถามอะไรได้เลยครับ หรือกดปุ่มด้านล่าง 👇', 'bot');
      }
    }

    /* ── buildOptions: สร้าง HTML + ผูก events ทุกครั้งที่เรียก ── */
    function buildOptions(restoreTab) {
      const lang = getLang();
      const i18n = CHAT_I18N[lang] || CHAT_I18N.th;
      const activeTab = restoreTab || 'contact';

      options.innerHTML = `
      <div class="chat-tabs">
        <button class="chat-tab${activeTab === 'contact' ? ' active' : ''}" data-tab="contact">${i18n.tab_contact}</button>
        <button class="chat-tab${activeTab === 'bot'     ? ' active' : ''}" data-tab="bot">${i18n.tab_bot}</button>
      </div>

      <!-- Tab: ติดต่อเรา (เดิม) -->
      <div class="chat-panel${activeTab === 'contact' ? ' active' : ''}" id="chatContactPanel">
        <div class="chat-options-header" style=" padding:12px 16px 6px;font-size:.72rem;letter-spacing:.1em;color:rgba(255,255,255,.7);text-transform:uppercase;">${i18n.header_contact}</div>
        <a href="https://www.facebook.com/obhomestore" target="_blank" rel="noopener noreferrer" class="chat-option chat-option--fb">
          <span class="chat-option-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </span>
          <span class="chat-option-text">
            <span class="chat-option-name">Facebook</span>
            <span class="chat-option-sub">${i18n.fb_sub}</span>
          </span>
        </a>
        <a href="https://page.line.me/203fmurc?openQrModal=true" target="_blank" rel="noopener noreferrer" class="chat-option chat-option--line">
          <span class="chat-option-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          </span>
          <span class="chat-option-text">
            <span class="chat-option-name">LINE</span>
            <span class="chat-option-sub">@203fmurc</span>
          </span>
        </a>
        <a href="tel:0917036286" class="chat-option chat-option--phone">
          <span class="chat-option-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z"/></svg>
          </span>
          <span class="chat-option-text">
            <span class="chat-option-name">${i18n.call_label}</span>
            <span class="chat-option-sub">091-7036286</span>
          </span>
        </a>
      </div>

      <!-- Tab: แชทบอท -->
      <div class="chat-panel${activeTab === 'bot' ? ' active' : ''}" id="chatBotPanel">
        <div class="chatbot-messages" id="cbMessages"></div>
        <div class="cb-quick-replies" id="cbQuickReplies">
          ${i18n.quick.map(q => `<button class="cb-quick-btn">${q}</button>`).join('\n          ')}
        </div>
        <div class="chatbot-input-row">
          <input class="chatbot-input" id="cbInput" type="text" placeholder="${i18n.placeholder}" autocomplete="off" maxlength="200">
          <button class="chatbot-send" id="cbSend" aria-label="${i18n.send_label}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    `;

      /* ── ผูก events ทันทีหลัง innerHTML พร้อม ── */

      // Tab switching
      options.querySelectorAll('.chat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          options.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
          options.querySelectorAll('.chat-panel').forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          const panelId = tab.dataset.tab === 'bot' ? 'chatBotPanel' : 'chatContactPanel';
          const panel = document.getElementById(panelId);
          if (panel) panel.classList.add('active');
          if (tab.dataset.tab === 'bot') initBotSession();
        });
      });

      // Send button
      const sendBtn = document.getElementById('cbSend');
      const inputEl = document.getElementById('cbInput');
      if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
      if (inputEl) inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(inputEl.value); });

      // Quick reply buttons
      const qr = document.getElementById('cbQuickReplies');
      if (qr) qr.querySelectorAll('.cb-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => sendMessage(btn.textContent));
      });

      // ถ้า restore กลับมาที่แท็บบอท ให้ init session ด้วย
      if (activeTab === 'bot') initBotSession();
    }

    buildOptions();

    // ── re-build เมื่อเปลี่ยนภาษา ── คืนค่า tab เดิม และ reset initialized
    function rebuildOnLangChange() {
      const activeTab = options.querySelector('.chat-tab.active')?.dataset?.tab || 'contact';
      // ถ้าอยู่ที่แท็บบอท ต้อง reset initialized เพื่อให้ history re-render หลัง rebuild
      if (activeTab === 'bot') initialized = false;
      buildOptions(activeTab);
    }
    window.addEventListener('ob-lang-changed', rebuildOnLangChange);
  }

  /* ═══════════════════════════════════════════════════
     5.  INIT — รอ DOM พร้อม
  ═══════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBot);
  } else {
    injectBot();
  }

})();