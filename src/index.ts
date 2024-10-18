import { extractor } from "./extractor";
import { assembler } from "./assembler";

const q3 = `
6. กำหนดให้ฮาร์ดดิสก์มีคุณสมบัติต่อไปนี้
- มี 8 surfaces หมุนด้วยความเร็ว 15,000 รอบต่อนาที
- จำนวน track ต่อ surface เป็น 10,000 จำนวน sector ต่อ track เป็น 500
- จำนวน byte ต่อ sector เป็น 1,024 Bytes Seek time: จะใช้เฉลี่ย 1 ms ทุกๆ 100 tracks
- การเคลื่อนหัวอ่านเพื่ออ่านข้อมูลจาก track ถัดไปใช้เวลา 0.5 mาร
กำหนดให้ตอนเริ่มต้นหัวอ่านอยู่ที่ track 2500 และได้รับคำสั่งให้อ่านข้อมูลที่ sector / track / surface ใดๆ
อย่างสุ่ม จงคำนวณค่าต่อไปนี้

6.1 average seek time
6.2 เวลาในการ transfer ข้อมูลจำนวน 50 sector
6.3 กำหนดให้ทุก surface มีหัวอ่านที่อยู่ตำแหน่ง cylinder เดียวกัน และอ่านข้อมูลได้พร้อมกัน
จงคำนวณว่า ในการหมุน 1 รอบ จะสามารถอ่านข้อมูลได้สูงสุดกี่ MB ( 1MB = 1,024 Kbytes)
6.4 จงประมาณเวลาที่ใช้ในการถ่ายโอนข้อมูลจำนวน 5 CB ถ้าไฟล์มีการจัดเรียงต่อเนื่องอย่างดี
สามารถอ่านข้อมูลจาก track ต่อไปได้อย่างต่อเนื่อง (1 GB = 1,024 MBytes)
`;

const result = await extractor(q3);
console.log(await assembler(q3, result.answer));
