export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const { messages, productContext } = body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'ขออภัยครับ เกิดข้อผิดพลาดในการส่งข้อมูล' });
  }

  const systemPrompt = `คุณคือ "น้องโอบี" ผู้ช่วยขายของร้าน OB HOME จำหน่ายวัสดุแต่งบ้านคุณภาพสูง
ตอบเป็นภาษาไทยเสมอ กระชับ เป็นมิตร และแม่นยำ ใช้ emoji ได้บ้างให้ดูน่าใช้

ข้อมูลร้าน:
- ที่อยู่: 54/13 หมู่ 1 หนองปรือ อ.บางละมุง จ.ชลบุรี 20150
- โทร: 091-7036286
- LINE: @203fmurc
- Facebook: OB HOME ไม้ระแนงพัทยา ราคาถูก
- เวลาทำการ: จันทร์-เสาร์ 07:30-17:00 น.
- พื้นที่บริการ: พัทยา หนองปรือ ชลบุรี และทั่วประเทศ

สินค้าหลัก:
- ไม้ระแนง WPC (ร่อง: ลึก, ตื้น, เว้าโค้ง, ตื้น 3 รอน, รอนโค้งครึ่งวงกลม, ตื้นรอนใหญ่, ตื้นหน้ากว้าง, แผ่นเรียบ, เก็บเสียง)
- แผ่น SPC Marble Board (กันน้ำ 100% ทนทาน)
- ผนังตกแต่ง Wall Panel
- ไม้สั่งตัด
- อุปกรณ์ติดตั้ง

ข้อมูลสินค้าปัจจุบัน:
${productContext || 'ไม่มีข้อมูลสินค้าในขณะนี้'}

กฎการตอบ:
- ถ้าถามราคา ให้บอกจากข้อมูลด้านบน ถ้าไม่มีให้แนะนำโทรถามร้าน
- ถ้าถามนอกเหนือสินค้าร้าน ให้แนะนำติดต่อร้านโดยตรง
- ห้ามแต่งข้อมูลหรือเดาราคา`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          generationConfig: { maxOutputTokens: 1024, temperature: 0.3 }
        })
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      console.error('Gemini error:', data.error);
      return res.status(200).json({ reply: 'ขออภัยครับ ระบบ AI มีปัญหาชั่วคราว กรุณาติดต่อร้านโดยตรงที่ 091-7036286 ครับ' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'ขออภัยครับ ไม่สามารถตอบได้ในขณะนี้';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(200).json({ reply: 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งครับ 🙏' });
  }
}