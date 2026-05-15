# StoreStokeSystem

ระบบจัดการคลังวัสดุสำหรับบันทึกวัสดุคงเหลือ รับเข้าคลัง เบิกออกคลัง ดูประวัติการเคลื่อนไหว และจัดการรูปภาพวัสดุผ่าน Supabase Storage

## ภาพรวม

โปรเจกต์นี้เป็นเว็บแอป Next.js ที่ใช้ Supabase เป็นฐานข้อมูล, ระบบล็อกอิน, Row Level Security และ Storage สำหรับรูปภาพสินค้า/วัสดุ เหมาะกับงานคลังวัสดุแบบง่ายที่ต้องรู้ว่า:

- มีวัสดุอะไรอยู่ในคลัง
- แต่ละรายการเหลือจำนวนเท่าไร
- ใครเป็นคนรับเข้า/เอาออก
- มีหมายเหตุอะไรในแต่ละรายการเคลื่อนไหว
- วัสดุไหนใกล้หมดหรือหมดสต็อก
- แนบรูปวัสดุได้

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase RLS
- Recharts

## ฟีเจอร์หลัก

### Dashboard

- สรุปจำนวนวัสดุในคลัง
- สรุปจำนวนวัสดุทั้งหมดและหมวดหมู่
- ดูรายการวัสดุใกล้หมด
- กราฟภาพรวมการเคลื่อนไหว

### คลังวัสดุ

- เพิ่มวัสดุใหม่
- แก้ไขวัสดุ
- ลบวัสดุ
- อัปโหลดรูปวัสดุ
- เลือกหมวดหมู่วัสดุ
- เลือกผู้จำหน่ายถ้ามี
- ค้นหาและกรองรายการ

### รับเข้า/เอาออกคลัง

- หน้า `ขอเข้าคลัง` สำหรับเพิ่มจำนวนวัสดุ
- หน้า `ของออกคลัง` สำหรับตัดจำนวนวัสดุ
- ใส่หมายเหตุในแต่ละรายการได้
- ระบบเช็กไม่ให้เบิกออกเกินจำนวนคงเหลือ
- บันทึกคนทำรายการจากบัญชีที่ล็อกอินอยู่

### ประวัติ

- หน้า `ประวัติ` สำหรับดูรายการรับเข้า/เอาออกทั้งหมด
- แสดงวันที่, วัสดุ, ประเภทการเคลื่อนไหว, จำนวน, ผู้ทำรายการ, หมายเหตุ
- ในหน้ารายละเอียดวัสดุมีแท็บ `History` เพื่อดูประวัติเฉพาะวัสดุนั้น

### รูปภาพ

- ใช้ Supabase Storage bucket ชื่อ `images`
- bucket ต้องเป็น public เพื่อให้ Next.js โหลดรูปได้
- อัปโหลดรูปสินค้า/วัสดุได้จากหน้าเพิ่มหรือแก้ไข

## โครงสร้างโปรเจกต์

```text
src/
  app/
    (auth)/              หน้าล็อกอิน สมัครสมาชิก ลืมรหัสผ่าน
    (app)/               หน้าหลังล็อกอิน เช่น dashboard, inventory, history
  components/
    features/            component ตามฟีเจอร์ เช่น inventory, stock, product
    layout/              sidebar, topbar
    ui/                  component กลาง
    icons/               icon svg
  lib/
    actions/             server actions สำหรับอ่าน/เขียน Supabase
    supabase/            client, server, middleware
    utils/               helper functions
    constants.ts         navigation, category, config
    types.ts             TypeScript types
```

ไฟล์ SQL สำคัญ:

- `schema.sql` schema หลักของระบบ
- `stock_movements_setup.sql` สร้างตารางประวัติรับเข้า/เอาออก
- `storage_images_setup.sql` สร้าง Storage bucket และ policy สำหรับรูปภาพ

## Environment Variables

ต้องมีไฟล์ `.env` หรือ `.env.local` ในเครื่อง และต้องตั้งค่าเดียวกันบน Vercel ตอน deploy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co/
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

ในโปรเจกต์นี้โค้ดอ่านค่าจาก:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## วิธีรันในเครื่อง

ติดตั้ง dependencies:

```bash
npm install
```

รัน dev server:

```bash
npm run dev
```

เปิดเว็บ:

```text
http://localhost:3000
```

เช็ก TypeScript:

```bash
npx tsc --noEmit
```

Build production:

```bash
npm run build
```

ถ้า build แล้วเจอไฟล์ `.next` ถูกล็อกบน Windows ให้ปิด `npm run dev` ก่อน แล้วค่อย build ใหม่

## Supabase Setup

### 1. สร้างโปรเจกต์ Supabase

สร้าง project ใหม่ใน Supabase แล้วเอาค่า Project URL และ Publishable key มาใส่ใน `.env`

### 2. รัน schema หลัก

ไปที่ Supabase Dashboard:

```text
SQL Editor -> New query
```

วางเนื้อหาใน `schema.sql` แล้วกด Run

ถ้ามีตารางเดิมอยู่แล้ว ไม่ควรรัน `schema.sql` ทั้งไฟล์ซ้ำแบบสุ่ม เพราะ `CREATE TABLE` บางส่วนอาจชน ให้ใช้ไฟล์ setup เฉพาะด้านล่างแทน

### 3. เปิดระบบประวัติรับเข้า/เอาออก

รันไฟล์:

```text
stock_movements_setup.sql
```

ไฟล์นี้จะสร้าง:

- ตาราง `public.stock_movements`
- index สำหรับโหลดประวัติตามสินค้า
- RLS policy ให้ user เห็นและจัดการเฉพาะข้อมูลของตัวเอง
- backfill รายการตั้งต้นจากสินค้าที่มีอยู่แล้ว

### 4. เปิดระบบอัปโหลดรูป

รันไฟล์:

```text
storage_images_setup.sql
```

ไฟล์นี้จะสร้าง/อัปเดต:

- Storage bucket ชื่อ `images`
- ตั้ง bucket เป็น public
- policy สำหรับอ่านรูป
- policy สำหรับ authenticated user upload/update/delete รูป

ถ้าอัปโหลดรูปไม่สำเร็จ ให้เช็ก:

- มี bucket ชื่อ `images`
- bucket เป็น public
- user ล็อกอินอยู่
- policy ใน `storage_images_setup.sql` ถูก run แล้ว

## Supabase Auth URL

ถ้าจะ deploy ขึ้น public ต้องตั้งค่า Auth URL ใน Supabase:

ไปที่:

```text
Authentication -> URL Configuration
```

ตั้ง:

```text
Site URL = https://your-vercel-domain.vercel.app
```

เพิ่ม Redirect URLs:

```text
https://your-vercel-domain.vercel.app/**
```

ระหว่างพัฒนา local อาจเพิ่ม:

```text
http://localhost:3000/**
```

## Deploy ขึ้น Vercel

1. Push code ขึ้น GitHub
2. เข้า Vercel
3. Import repository นี้
4. Framework preset เลือก `Next.js`
5. Root directory ใช้ `./`
6. เพิ่ม Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

7. กด Deploy
8. นำ URL จาก Vercel ไปตั้งใน Supabase Auth URL Configuration

## การใช้งานระบบ

### เพิ่มวัสดุ

1. ไปที่ `คลังวัสดุ`
2. กด `เพิ่มวัสดุ`
3. ใส่ชื่อวัสดุ, หมวดหมู่, จำนวน
4. อัปโหลดรูปถ้าต้องการ
5. กดบันทึก

ถ้าใส่จำนวนตั้งต้นมากกว่า 0 ระบบจะสร้างประวัติรับเข้าเริ่มต้นให้ใน `stock_movements`

### รับเข้าคลัง

1. ไปที่ `ขอเข้าคลัง`
2. เลือกวัสดุ
3. ใส่จำนวน
4. ใส่หมายเหตุถ้ามี
5. กดบันทึก

### เอาออกคลัง

1. ไปที่ `ของออกคลัง`
2. เลือกวัสดุ
3. ใส่จำนวน
4. ใส่หมายเหตุถ้ามี
5. กดบันทึก

ระบบจะไม่ให้เอาออกมากกว่าสต็อกคงเหลือ

### ดูประวัติ

- ไปที่ `ประวัติ` เพื่อดูรายการทั้งหมด
- เข้าไปที่รายละเอียดวัสดุแล้วกดแท็บ `History` เพื่อดูเฉพาะวัสดุนั้น

## หมวดหมู่วัสดุ

หมวดหมู่ถูกกำหนดใน `src/lib/constants.ts`

ตัวอย่าง:

- วัสดุก่อสร้าง
- เครื่องมือช่าง
- อุปกรณ์ไฟฟ้า
- อุปกรณ์ประปา
- สีและเคมีภัณฑ์
- อุปกรณ์ความปลอดภัย
- วัสดุสิ้นเปลือง

## Route สำคัญ

```text
/dashboard        ภาพรวม
/inventory        คลังวัสดุ
/stock-in         ขอเข้าคลัง
/stock-out        ของออกคลัง
/history          ประวัติรับเข้า/เอาออก
/product/[id]     รายละเอียดวัสดุ
/settings         ตั้งค่าบัญชี
```

## หมายเหตุเรื่อง Performance

- ตอนรัน `npm run dev` จะช้ากว่า production เป็นปกติ
- หน้า inventory ถูกปรับให้รวม query สรุปหลายตัวเหลือ query หลักรอบเดียวแล้ว
- มี loading skeleton ตอนเปลี่ยนหน้าและตอนโหลดตารางสินค้า
- Production บน Vercel จะเร็วกว่า local dev โดยทั่วไป

## ปัญหาที่พบบ่อย

### ขึ้นว่าไม่มีตาราง `public.products`

แปลว่ายังไม่ได้รัน `schema.sql` ใน Supabase SQL Editor

### เพิ่มวัสดุแล้วขึ้นว่าไม่มี `stock_movements`

ให้รัน:

```text
stock_movements_setup.sql
```

### อัปโหลดรูปไม่สำเร็จ

ให้รัน:

```text
storage_images_setup.sql
```

แล้วเช็กว่า Storage bucket `images` เป็น public

### รูปไม่แสดงหลังอัปโหลด

เช็กว่า:

- `NEXT_PUBLIC_SUPABASE_URL` ตรงกับโปรเจกต์ Supabase จริง
- restart dev server หลังแก้ `.env` หรือ `next.config.ts`
- รูปสินค้าที่เพิ่มก่อนตั้งค่า Storage อาจต้องกด Edit แล้วอัปโหลดใหม่

### หน้าเปลี่ยนช้า

ถ้าเป็น local dev ให้ลอง build/deploy production ก่อน เพราะ Next dev mode ช้ากว่าจริงมาก โดยเฉพาะบน Windows และ Supabase remote

## GitHub

Repository:

```text
https://github.com/bfirstkok/StoreStokeSystem
```

## สถานะโปรเจกต์

โปรเจกต์นี้ถูกปรับจากระบบ inventory/sales เดิมให้เป็นระบบคลังวัสดุแบบรับเข้า/เอาออกเป็นหลัก บาง table legacy เช่น orders/sales ยังอยู่ใน schema เพื่อรองรับโค้ดเดิมบางส่วน แต่ flow หลักของผู้ใช้ตอนนี้คือ:

```text
เพิ่มวัสดุ -> ขอเข้าคลัง/ของออกคลัง -> ดูประวัติ -> ดู dashboard
```
