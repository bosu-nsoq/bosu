# Bosu Cloud Backend (Google Apps Script)

ระบบ Cloud Sync เชื่อมโยงข้อมูลเว็บแอป Bosu ข้ามหลายเครื่องอัตโนมัติ โดยบันทึกลงใน Google Drive และ Google Sheets

---

## สรุปโครงสร้างระบบ:
1. **Google Drive:** สร้างโฟลเดอร์ชื่อ `Bosu`
2. **Google Sheets:** สร้างสเปรดชีตชื่อ `Bosu_Database` อยู่ภายในโฟลเดอร์ `Bosu`
3. **Google Apps Script:** เชื่อมต่อเป็น Web App API คอยรับคำขอ Read (GET) และ Sync/Save (POST)

---

## ขั้นตอนการเริ่มใช้งานครั้งแรก (One-time Setup):
1. เปิดโปรเจกต์ Google Apps Script:
   👉 [https://script.google.com/d/126IoLzmW493lSPZKc1DWuvmU1MQOLmbJE4kgDG6y68qjZ4jbmZhipuaW/edit](https://script.google.com/d/126IoLzmW493lSPZKc1DWuvmU1MQOLmbJE4kgDG6y68qjZ4jbmZhipuaW/edit)
2. ด้านบนตรงช่องเลือกฟังก์ชัน ให้เลือก **`initBosuDatabase`**
3. กดปุ่ม **"เรียกใช้" (Run)**
4. Google จะแสดงหน้าต่างแจ้งขอสิทธิ์การเข้าถึง (Google Drive & Google Sheets):
   - คลิก **ตรวจสอบสิทธิ์ (Review Permissions)**
   - เลือกบัญชี Google ของท่าน
   - คลิก **ขั้นสูง (Advanced)** ➔ คลิก **ไปยัง Bosu_Backend (ไม่ปลอดภัย) / Go to Bosu_Backend (unsafe)**
   - คลิก **อนุญาต (Allow)**
5. ในช่องบันทึกการทำงาน (Execution Log) ด้านล่าง จะแสดงลิงก์โฟลเดอร์ `Bosu` ใน Drive และลิงก์สเปรดชีต `Bosu_Database` ทันที!
6. Web App API URL จะเริ่มทำงานและซิงค์ข้อมูลกับเว็บแอป Bosu ในทุกเครื่องแบบเรียลไทม์ครับ
