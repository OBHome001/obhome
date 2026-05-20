/* ═══════════════════════════════════════════════
   OB HOME Chatbot Widget
   ใส่ไว้ก่อน </body> ในทุกหน้า:
   <script src="chatbot.js"></script>
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = `
    #ob-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #bca58e; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,.25);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s, box-shadow .2s;
      font-size: 26px;
    }
    #ob-chat-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(0,0,0,.3); }
    #ob-chat-btn .ob-badge {
      position: absolute; top: -4px; right: -4px;
      background: #e03030; color: #fff; border-radius: 50%;
      width: 18px; height: 18px; font-size: 11px;
      display: none; align-items: center; justify-content: center;
    }

    #ob-chat-box {
      position: fixed; bottom: 90px; right: 24px; z-index: 9998;
      width: min(360px, calc(100vw - 32px));
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.18);
      display: flex; flex-direction: column;
      overflow: hidden; max-height: 520px;
      transform: scale(.9) translateY(16px);
      opacity: 0; pointer-events: none;
      transition: transform .25s cubic-bezier(.16,1,.3,1), opacity .25s;
    }
    #ob-chat-box.open {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    #ob-chat-header {
      background: #bca58e; color: #fff;
      padding: 14px 16px; display: flex; align-items: center; gap: 10px;
    }
    #ob-chat-header .ob-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    #ob-chat-header .ob-info { flex: 1; }
    #ob-chat-header .ob-name { font-weight: 700; font-size: .95rem; }
    #ob-chat-header .ob-status { font-size: .72rem; opacity: .85; }
    #ob-chat-close {
      background: none; border: none; color: #fff;
      font-size: 20px; cursor: pointer; padding: 4px; line-height: 1;
    }

    #ob-chat-messages {
      flex: 1; overflow-y: auto; padding: 14px 12px;
      display: flex; flex-direction: column; gap: 10px;
      background: #faf9f6;
    }
    .ob-msg { display: flex; gap: 8px; max-width: 85%; }
    .ob-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .ob-msg .ob-bubble {
      padding: 9px 13px; border-radius: 14px;
      font-size: .85rem; line-height: 1.55;
      white-space: pre-wrap; word-break: break-word;
    }
    .ob-msg.bot  .ob-bubble { background: #fff; color: #333; border: 1px solid #ede8e1; border-bottom-left-radius: 4px; }
    .ob-msg.user .ob-bubble { background: #bca58e; color: #fff; border-bottom-right-radius: 4px; }
    .ob-msg .ob-av {
      width: 28px; height: 28px; border-radius: 50%;
      background: #e8e0d5; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; align-self: flex-end;
    }
    .ob-typing { display: flex; gap: 4px; padding: 10px 13px; }
    .ob-typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #bca58e;
      animation: obDot 1.2s infinite;
    }
    .ob-typing span:nth-child(2) { animation-delay: .2s; }
    .ob-typing span:nth-child(3) { animation-delay: .4s; }
    @keyframes obDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

    #ob-chat-footer {
      padding: 10px 12px; border-top: 1px solid #ede8e1;
      display: flex; gap: 8px; background: #fff;
    }
    #ob-chat-input {
      flex: 1; border: 1.5px solid #ddd; border-radius: 22px;
      padding: 9px 14px; font-size: .85rem; outline: none;
      font-family: inherit; resize: none; max-height: 90px;
      transition: border-color .18s;
    }
    #ob-chat-input:focus { border-color: #bca58e; }
    #ob-chat-send {
      width: 38px; height: 38px; border-radius: 50%;
      background: #bca58e; border: none; cursor: pointer;
      color: #fff; font-size: 18px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: background .18s, transform .15s;
    }
    #ob-chat-send:hover { background: #8a7560; transform: scale(1.08); }
    #ob-chat-send:disabled { background: #ccc; cursor: default; transform: none; }

    .ob-quick-btns {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 0 12px 10px;
    }
    .ob-quick-btn {
      border: 1.5px solid #bca58e; background: #fff; color: #8a7560;
      border-radius: 16px; padding: 5px 12px; font-size: .78rem;
      cursor: pointer; font-family: inherit; transition: background .15s, color .15s;
    }
    .ob-quick-btn:hover { background: #bca58e; color: #fff; }

    @media (max-width: 400px) {
      #ob-chat-box { bottom: 80px; right: 12px; }
      #ob-chat-btn { bottom: 16px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  var wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="ob-chat-btn" aria-label="แชทกับเรา">
      💬<span class="ob-badge" id="ob-badge"></span>
    </button>
    <div id="ob-chat-box" role="dialog" aria-label="แชทบอท OB HOME">
      <div id="ob-chat-header">
        <div class="ob-avatar">🏠</div>
        <div class="ob-info">
          <div class="ob-name">น้องโอบี · OB HOME</div>
          <div class="ob-status">ออนไลน์ · ตอบทันที</div>
        </div>
        <button id="ob-chat-close" aria-label="ปิด">×</button>
      </div>
      <div id="ob-chat-messages"></div>
      <div class="ob-quick-btns" id="ob-quick-btns"></div>
      <div id="ob-chat-footer">
        <textarea id="ob-chat-input" rows="1" placeholder="พิมพ์ข้อความ..."></textarea>
        <button id="ob-chat-send" aria-label="ส่ง">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  /* ── Elements ── */
  var btn      = document.getElementById('ob-chat-btn');
  var box      = document.getElementById('ob-chat-box');
  var closeBtn = document.getElementById('ob-chat-close');
  var messages = document.getElementById('ob-chat-messages');
  var input    = document.getElementById('ob-chat-input');
  var sendBtn  = document.getElementById('ob-chat-send');
  var quickWrap= document.getElementById('ob-quick-btns');
  var badge    = document.getElementById('ob-badge');

  /* ── State ── */
  var history = [];
  var isOpen  = false;
  var isTyping= false;
  var productContext = '';

  /* ── Quick replies ── */
  var quickReplies = [
    'ราคาไม้ระแนงเท่าไหร่?',
    'แผ่น SPC มีกี่แบบ?',
    'จัดส่งทั่วไทยไหม?',
    'ติดต่อร้านได้ยังไง?'
  ];

  function renderQuickBtns() {
    quickWrap.innerHTML = '';
    quickReplies.forEach(function(q) {
      var b = document.createElement('button');
      b.className = 'ob-quick-btn';
      b.textContent = q;
      b.addEventListener('click', function() {
        quickWrap.innerHTML = '';
        sendMessage(q);
      });
      quickWrap.appendChild(b);
    });
  }

  /* ── Load products from Firebase ── */
  function loadProductContext() {
    var pages = ['lath', 'spc', 'wallpanel', 'wooden', 'accessories'];
    var results = [];
    var done = 0;

    if (!window._firebaseDB) return;
    var _ref = window._firebaseDB.ref;
    var _get = window._firebaseDB.get;
    var db   = window._firebaseDB.db;
    if (!_ref || !_get || !db) return;

    pages.forEach(function(page) {
      _get(_ref(db, 'pages/' + page)).then(function(snap) {
        var data = snap.val();
        if (data && data.products) {
          var items = data.products.map(function(p) {
            var info = '[' + page.toUpperCase() + '] ' + (p.name || '');
            if (p.price)    info += ' ราคา: ' + p.price + '฿';
            if (p.discount) info += ' (ลด: ' + p.discount + '฿)';
            if (p.groove)   info += ' ร่อง: ' + p.groove;
            if (p.size)     info += ' ขนาด: ' + p.size;
            return info;
          });
          results = results.concat(items);
        }
      }).catch(function() {}).finally(function() {
        done++;
        if (done === pages.length) {
          productContext = results.join('\n');
        }
      });
    });
  }

  /* ── Render message ── */
  function addMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'ob-msg ' + role;
    var av = role === 'bot' ? '🏠' : '👤';
    div.innerHTML = '<div class="ob-av">' + av + '</div>'
      + '<div class="ob-bubble">' + text.replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'ob-msg bot';
    div.id = 'ob-typing';
    div.innerHTML = '<div class="ob-av">🏠</div>'
      + '<div class="ob-bubble ob-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('ob-typing');
    if (t) t.remove();
  }

  /* ── Send message ── */
  function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || isTyping) return;
    input.value = '';
    input.style.height = '';

    addMessage('user', text);
    history.push({ role: 'user', content: text });
    isTyping = true;
    sendBtn.disabled = true;
    showTyping();

    var GEMINI_KEY = 'AIzaSyB6hvkVuyWQyxBtLPjk9TsvLJ5s-kkvaXQ'; // ← ใส่ API key ของคุณตรงนี้

    var systemPrompt = [
      'คุณคือ "น้องโอบี" ผู้ช่วยขายของร้าน OB HOME จำหน่ายวัสดุแต่งบ้านคุณภาพสูง',
      'ตอบเป็นภาษาไทยเสมอ กระชับ เป็นมิตร และแม่นยำ ใช้ emoji ได้บ้าง',
      '',
      'ข้อมูลร้าน:',
      '- ที่อยู่: 54/13 หมู่ 1 หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      '- โทร: 091-7036286',
      '- LINE: @203fmurc',
      '- Facebook: OB HOME ไม้ระแนงพัทยา ราคาถูก',
      '- เวลาทำการ: จันทร์-เสาร์ 07:30-17:00 น.',
      '- พื้นที่บริการ: พัทยา หนองปรือ ชลบุรี และทั่วประเทศ',
      '',
      'สินค้าหลัก:',
      '- ไม้ระแนง WPC (หลายแบบร่อง)',
      '- แผ่น SPC Marble Board (กันน้ำ 100%)',
      '- ผนังตกแต่ง Wall Panel',
      '- ไม้สั่งตัด และอุปกรณ์ติดตั้ง',
      '',
      'ข้อมูลสินค้า:',
      productContext || 'ไม่มีข้อมูลสินค้าขณะนี้',
      '',
      'กฎ: ถ้าถามราคาให้บอกจากข้อมูลด้านบน ถ้าไม่มีให้แนะนำโทรถามร้าน ห้ามเดาราคา'
    ].join('\n');

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history.map(function(m) {
          return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
        }),
        generationConfig: { maxOutputTokens: 1024, temperature: 0.3 }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      removeTyping();
      var reply = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text)
        || 'ขออภัยครับ ไม่สามารถตอบได้ กรุณาติดต่อ 091-7036286';
      addMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });
    })
    .catch(function() {
      removeTyping();
      addMessage('bot', 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง 🙏');
    })
    .finally(function() {
      isTyping = false;
      sendBtn.disabled = false;
    });
  }

  /* ── Toggle ── */
  function openChat() {
    isOpen = true;
    box.classList.add('open');
    badge.style.display = 'none';
    input.focus();
    if (!messages.children.length) {
      addMessage('bot', 'สวัสดีครับ! 👋 ผมน้องโอบี ผู้ช่วยของร้าน OB HOME\nมีอะไรให้ช่วยไหมครับ? 😊');
      renderQuickBtns();
    }
    loadProductContext();
  }

  function closeChat() {
    isOpen = false;
    box.classList.remove('open');
  }

  btn.addEventListener('click', function() { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);

  /* ── Input ── */
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', function() {
    this.style.height = '';
    this.style.height = Math.min(this.scrollHeight, 90) + 'px';
  });
  sendBtn.addEventListener('click', function() { sendMessage(); });

  /* ── Show badge after 3s ── */
  setTimeout(function() {
    if (!isOpen) {
      badge.style.display = 'flex';
      badge.textContent = '1';
    }
  }, 3000);

})();