/**
 * ============================================================================
 *  KONFIGURASI ENDPOINT BACKEND (Google Apps Script Web App URLs)
 * ============================================================================
 *  SATU-SATUNYA tempat untuk ganti URL backend. Kalau kamu re-deploy salah
 *  satu Apps Script (Projects, Certificates, Rating/Reviews, atau Contact)
 *  dan dapat URL /exec yang baru, cukup update nilai di file ini saja —
 *  TIDAK perlu buka file komponen (.tsx) manapun lagi.
 *
 *  ATURAN PENTING: URL di sini harus PERSIS SAMA dengan URL yang dipakai
 *  AdminModal untuk menulis (POST) data. Kalau URL baca (GET, dipakai di
 *  halaman publik) dan URL tulis (POST, dipakai di Admin) beda, data yang
 *  kamu tambah lewat Admin tidak akan PERNAH muncul di halaman publik —
 *  meski tidak ada error yang terlihat sama sekali. Ini akar dari bug
 *  "data ga muncul" yang paling sering terjadi di setup seperti ini.
 *
 *  Cara paling aman deploy ulang tanpa URL berubah:
 *  Apps Script Editor > Deploy > Manage deployments > (pencet ikon pensil
 *  pada deployment aktif) > pilih "New version" > Deploy.
 *  JANGAN pilih "New deployment" kalau tidak mau URL-nya berubah.
 * ============================================================================
 */

// Backend untuk data Projects (Sheet: "Projects")
export const PROJECTS_API_URL =
  'https://script.google.com/macros/s/AKfycbx-je_dn0pLkSdS4An_QXBC7DybCwFLW92NtE0Soj-T_OnXcpT6Qytleo6hjYVEr3Cq/exec';

// Backend untuk data Certificates (Sheet: "Certificates")
export const CERTIFICATES_API_URL =
  'https://script.google.com/macros/s/AKfycbyWPUQJukAe0766f_Q6WkocJPCItuq3p0gfBJCe4cEg_Adg9bmkaeQ9jBLFe6kf7Jky/exec';

// Backend untuk data Rating / Reviews / Testimonials (Sheet: "Rating")
export const REVIEWS_API_URL =
  'https://script.google.com/macros/s/AKfycbyRJ3mhIIAu4zSbNCTVyt649VV_m0CU74FIgF5t2P3iACzlroEq7gLUOd0PSlhyiLbc/exec';

// Backend untuk pesan dari form Contact (Sheet: "Contacts")
export const CONTACT_API_URL =
  'https://script.google.com/macros/s/AKfycby3rYvevbJGiOb-Pgymc17KT7uWUZZd64roQQ2hgv5XfdQWlHJXmzTrO7UyJNiZH6nB/exec';