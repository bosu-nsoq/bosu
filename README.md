# Bosu - แหล่งรวมแอปที่พัฒนาโดย Bosu

เว็บแอปพลิเคชัน Hub สำหรับรวบรวมและเปิดใช้งานเว็บแอปต่างๆ ที่พัฒนาโดย Bosu โดยสามารถเปิดใช้งานแบบ Web App ได้เต็มจอโดยไม่ต้องแสดงแถบ URL ของเบราว์เซอร์ พร้อมรองรับ PWA (Progressive Web App) สำหรับติดตั้งลงบน iOS, Android และ Desktop

---

## 📱 รายชื่อเว็บแอปที่รวมไว้
1. **WNTK Library System**
   - URL: `https://bosu-nsoq.github.io/wntk-library-system/`
   - Icon: `https://i.postimg.cc/D0Dw84J1/WNTK.png`
   - หมวดหมู่: ระบบห้องสมุด
2. **Financial**
   - URL: `https://bosu-nsoq.github.io/financial/`
   - Icon: `https://i.postimg.cc/T2Cngdnd/Financial.png`
   - หมวดหมู่: การเงินและบัญชี
3. **Lunar**
   - URL: `https://bosu-nsoq.github.io/lunar/`
   - Icon: `https://i.postimg.cc/xC1sKNwZ/Lunar.png`
   - หมวดหมู่: บันทึกรายจ่าย

---

## ✨ จุดเด่นและการทำงาน
- **In-App Fullscreen Web App Viewer:** เมื่อคลิกปุ่ม "เปิดใช้งานแอป" แอปจะแสดงผลเต็มจอภายในหน้าต่าง Bosu ทันที โดย**ไม่มีแถบ URL** พร้อมแถบเครื่องมือด้านบนที่มีปุ่มกลับหน้าหลัก Bosu, ปุ่มรีเฟรช และปุ่มเต็มจอ
- **PWA (Progressive Web App):** มีไฟล์ `manifest.json`, `sw.js` และ Apple Mobile Web App tags พร้อมติดตั้งลงหน้าจอโฮมของ iPhone, iPad, Android หรือ Chrome/Edge บนคอมพิวเตอร์
- **ฟอนต์ 'Mali':** ดีไซน์น่ารัก สบายตา เป็นกันเอง
- **มาตรฐานวันที่ พ.ศ. (dd/mm/yyyy):** แสดงวันที่ปัจจุบันตามมาตรฐานไทย พ.ศ.
- **Responsive Header:** แถบหัวข้อบนมือถือแนวตั้งล็อกไว้บรรทัดเดียว (`white-space: nowrap`) ไม่ตัดบรรทัดตกหล่น

---

## 🚀 วิธีการนำขึ้น GitHub Pages (เช่น `https://bosu-nsoq.github.io/bosu/`)
1. สร้าง Repository ใหม่บน GitHub ชื่อ `bosu`
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (`index.html`, `manifest.json`, `sw.js`, `README.md`) ไปยัง Repository
3. ไปที่แท็บ **Settings** > **Pages** บน GitHub
4. ในส่วน **Build and deployment** ให้เลือก Branch เป็น `main` แล้วกด **Save**
5. รอประมาณ 1-2 นาที คุณจะได้ลิงก์ `https://bosu-nsoq.github.io/bosu/` สำหรับเข้าใช้งานได้ทันที!
