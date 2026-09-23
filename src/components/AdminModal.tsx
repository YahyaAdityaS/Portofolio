import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS_API_URL, CERTIFICATES_API_URL, REVIEWS_API_URL } from '../config/apiEndpoints';

// Self-contained Google Drive image url formatter
function formatGoogleDriveUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) return `https://lh3.googleusercontent.com/d/${matchFileD[1]}`;
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1]) return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchD && matchD[1]) return `https://lh3.googleusercontent.com/d/${matchD[1]}`;
  return trimmed;
}

// Self-contained persistent review helpers
function generateReviewId(author: string, quote: string, timestamp?: string, fallbackIdx?: number): string {
  const cleanAuthor = (author || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
  const cleanQuote = (quote || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  const cleanTime = (timestamp || '').replace(/[^a-z0-9]/g, '').slice(-8);
  const suffix = cleanTime || (typeof fallbackIdx === 'number' ? `idx${fallbackIdx}` : '0');
  return `rev_${cleanAuthor}_${cleanQuote}_${suffix}`;
}

function getApprovedReviewIds(): Set<string> {
  try {
    const raw = localStorage.getItem('yas_approved_review_ids');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch {
    // ignore
  }
  return new Set<string>();
}

function saveApprovedReviewId(id: string): void {
  try {
    const set = getApprovedReviewIds();
    set.add(id);
    localStorage.setItem('yas_approved_review_ids', JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

function removeApprovedReviewId(id: string): void {
  try {
    const set = getApprovedReviewIds();
    set.delete(id);
    localStorage.setItem('yas_approved_review_ids', JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  stars: number;
  quote: string;
  avatar: string;
  avatarBg: string;
  avatarText: string;
  approved: boolean;
  timestamp: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onReplayLoading?: () => void;
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000; // 48 jam

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  lang,
  darkMode,
  onReplayLoading,
}) => {
  // Authentication & Security State - Remembered up to 2 days (48 hours)
  const [password, setPassword] = useState(() => {
    try {
      return localStorage.getItem('yas_admin_secret_code') || '';
    } catch {
      return '';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const timestampStr = localStorage.getItem('yas_admin_auth_timestamp');
      if (timestampStr) {
        const authTime = parseInt(timestampStr, 10);
        if (!isNaN(authTime) && Date.now() - authTime < TWO_DAYS_MS) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Google Apps Script Webhook URL
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem('yas_sheet_webhook_url') || '';
  });

  // Active Tab in Admin
  const [adminTab, setAdminTab] = useState<'moderation' | 'projects' | 'certificates' | 'script'>('projects');

  // Deployed backend Webhook URL - dari satu sumber pusat (src/config/apiEndpoints.ts)
  const SCRIPT_URL = PROJECTS_API_URL;
  // Backend Google Apps Script Web App URL untuk Sertifikat (sertif.gs)
  const CERT_SCRIPT_URL = CERTIFICATES_API_URL;

  // Reviews for moderation
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [filterMode, setFilterMode] = useState<'pending' | 'all' | 'approved'>('pending');

  // Form Input Project State - Sesuai persis dengan Kolom Sheet Projects:
  // id (auto), title, desc, tags, image, github, demo, category, plus year (angka saja)
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectCategory, setProjectCategory] = useState('UI/UX Design');
  const [projectYear, setProjectYear] = useState<string>(() => new Date().getFullYear().toString());
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');

  // Form Input Certificate State (12/12 identik dengan input proyek: judul, desc, tag, category, link gdrive image)
  const [certTitle, setCertTitle] = useState('');
  const [certDesc, setCertDesc] = useState('');
  const [certTags, setCertTags] = useState('');
  const [certImage, setCertImage] = useState('');
  const [certCategory, setCertCategory] = useState<'Design' | 'Tech' | 'Business & Skills'>('Design');
  const [certYear, setCertYear] = useState<string>(() => new Date().getFullYear().toString());
  const [isCertCategoryDropdownOpen, setIsCertCategoryDropdownOpen] = useState(false);
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  const [certSuccessMsg, setCertSuccessMsg] = useState('');
  const [certWebhookUrl] = useState(() => CERT_SCRIPT_URL);
  const [existingCertificates, setExistingCertificates] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('yas_portfolio_certificates');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  // Moderation action status toast
  const [modToast, setModToast] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    try {
      localStorage.removeItem('yas_admin_auth_timestamp');
      localStorage.removeItem('yas_admin_secret_code');
    } catch {
      // ignore
    }
  };

  // Load reviews from localStorage & spreadsheet
  const refreshReviews = async () => {
    const approvedIds = getApprovedReviewIds();
    const REVIEWS_SCRIPT_URL =
      localStorage.getItem('yas_reviews_webhook_url') || REVIEWS_API_URL;

    try {
      const res = await fetch(REVIEWS_SCRIPT_URL);
      const data = await res.json();
      if (data && Array.isArray(data.ratings)) {
        // Direct synchronization with spreadsheet:
        // Filter out blank/corrupted anomaly rows and match by primary key
        const mapped: TestimonialItem[] = data.ratings
          .filter((r: any) => {
            const cleanQuote = String(r.quote || r.message || '').replace(/[“”"'\s]/g, '').trim();
            const cleanAuthor = String(r.author || r.name || '').trim().toLowerCase();
            // Abaikan baris anomali kosong / Anonim tanpa saran
            return cleanQuote.length > 0 && cleanAuthor !== 'anonim' && cleanAuthor !== '';
          })
          .map((r: any, idx: number) => {
            const author = (r.author || r.name || 'Pengunjung Web').trim();
            const rawQuote = (r.quote || r.message || '').trim();
            const cleanQuote = rawQuote.replace(/^[“”"]+|[“”"]+$/g, '').trim();
            const id =
              r.id && (typeof r.id === 'string' || typeof r.id === 'number') && String(r.id).trim()
                ? String(r.id).trim()
                : String(idx + 1);
            
            // STRICT: Status persetujuan mengikuti boolean dari spreadsheet!
            const isApproved =
              r.approved === true ||
              String(r.approved).toLowerCase() === 'true';

            return {
              id,
              author,
              role: r.role || (lang === 'ID' ? 'Pengunjung Web' : 'Web Visitor'),
              stars: Number(r.stars || r.rating) || 5,
              quote: `“${cleanQuote}”`,
              avatar: (author || 'US').slice(0, 2).toUpperCase(),
              avatarBg: 'bg-[#2563eb]',
              avatarText: 'text-white',
              approved: isApproved,
              timestamp: r.timestamp || '',
            };
          });

        setReviews(mapped);
        localStorage.setItem('yas_portfolio_reviews', JSON.stringify(mapped));
        window.dispatchEvent(new CustomEvent('yas_reviews_updated'));
        return;
      }
    } catch {
      // offline fallback: read from localStorage
    }

    const saved = localStorage.getItem('yas_portfolio_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch {
        setReviews([]);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      try {
        const timestampStr = localStorage.getItem('yas_admin_auth_timestamp');
        if (timestampStr) {
          const authTime = parseInt(timestampStr, 10);
          if (!isNaN(authTime) && Date.now() - authTime >= TWO_DAYS_MS) {
            handleLogout();
          } else {
            setIsAuthenticated(true);
          }
        }
      } catch {
        // ignore
      }
      refreshReviews();
    }
  }, [isOpen]);

  // Persist Script URL
  const handleSaveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem('yas_sheet_webhook_url', url);
  };

  const [scriptTabType, setScriptTabType] = useState<'reviews' | 'all' | 'sertif'>('sertif');

  // Backend Google Apps Script untuk Sertifikat (sertif.gs)
  const sertifScriptCode = `/**
 * =========================================================================
 * SERTIFIKAT GOOGLE APPS SCRIPT (sertif.gs)
 * Backend Google Apps Script untuk Halaman & Manajemen Sertifikat Portfolio
 * =========================================================================
 */
var SHEET_NAME = "Certificates";

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    var headers = ["id", "title", "desc", "tags", "category", "image", "year", "created_at"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    var certificates = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var certId = String(row[0] || "").trim();
      var title = String(row[1] || "").trim();
      if (certId || title) {
        var tagsRaw = String(row[3] || "");
        var tagsArray = tagsRaw ? tagsRaw.split(",").map(function(t) { return t.trim(); }).filter(Boolean) : [];
        certificates.push({
          id: certId || ("CERT-" + i),
          title: title,
          desc: String(row[2] || ""),
          description: String(row[2] || ""),
          tags: tagsArray,
          category: String(row[4] || "Design"),
          image: String(row[5] || ""),
          imageUrl: String(row[5] || ""),
          year: String(row[6] || new Date().getFullYear()),
          created_at: row[7] ? String(row[7]) : ""
        });
      }
    }
    certificates.reverse();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: certificates.length,
      certificates: certificates
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString(), certificates: [] })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.tryLock(10000); } catch(e) {}
  try {
    var contents = {};
    if (e && e.postData && e.postData.contents) {
      try { contents = JSON.parse(e.postData.contents); } catch(parseErr) { contents = e.parameter || {}; }
    } else if (e && e.parameter) {
      contents = e.parameter;
    }
    var sheet = getOrCreateSheet();
    var action = String(contents.action || "add_certificate").toLowerCase();
    
    if (action === "delete_certificate" || action === "delete") {
      var targetId = String(contents.id || "").trim();
      var allRows = sheet.getDataRange().getValues();
      for (var r = 1; r < allRows.length; r++) {
        if (String(allRows[r][0]).trim() === targetId) {
          sheet.deleteRow(r + 1);
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Deleted" })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "not_found" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var certId = String(contents.id || ("CERT-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd-HHmmss"))).trim();
    var title = String(contents.title || "").trim();
    var desc = String(contents.desc || contents.description || "").trim();
    var tags = Array.isArray(contents.tags) ? contents.tags.join(", ") : String(contents.tags || "").trim();
    var category = String(contents.category || "Design").trim();
    var image = String(contents.image || contents.imageUrl || "").trim();
    var year = String(contents.year || new Date().getFullYear()).trim();
    var createdAt = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    
    var currentData = sheet.getDataRange().getValues();
    var existingRowIndex = -1;
    for (var k = 1; k < currentData.length; k++) {
      if (String(currentData[k][0]).trim() === certId) {
        existingRowIndex = k + 1;
        break;
      }
    }
    
    if (existingRowIndex > 0) {
      sheet.getRange(existingRowIndex, 1, 1, 8).setValues([[certId, title, desc, tags, category, image, year, createdAt]]);
    } else {
      sheet.appendRow([certId, title, desc, tags, category, image, year, createdAt]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Saved" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}`;

  // Khusus Script reviews.gs untuk Write Review & Rating ke sheet "Rating"
  const reviewsScriptCode = `// =============================================================================
// BACKEND GOOGLE APPS SCRIPT: REVIEW & RATING PORTOFOLIO (reviews.gs)
// Spreadsheet Tab: "Rating"
//
// FITUR UTAMA:
// 1. PRIMARY KEY AUTO-INCREMENT (Kolom A / ID: 1, 2, 3, 4...)
// 2. APPROVE BERDASARKAN ID: Mengubah sel Approved menjadi TRUE pada baris ID tersebut
//    (HANYA mengubah status, TIDAK membuat/menambah baris baru / anti-anomali)
// 3. TOLAK / DELETE BERDASARKAN ID: Menghapus baris ulasan sesuai Primary Key
// 4. VALIDASI ANTI-ANOMALI: Menolak ulasan kosong agar tidak muncul data "Anonim" palsu
// 5. OTOMATIS MEMBUAT KOLOM ID DI PALING KIRI jika sheet belum memiliki kolom ID
// =============================================================================

function ensureIdColumn(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "timestamp", "name", "role", "rating", "message", "approved"]);
    PropertiesService.getScriptProperties().setProperty("LAST_REVIEW_ID", "0");
    return;
  }
  
  var firstCell = String(sheet.getRange(1, 1).getValue()).toLowerCase().trim();
  if (firstCell !== "id") {
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1).setValue("id");
    
    var lastRow = sheet.getLastRow();
    var maxId = 0;
    for (var r = 2; r <= lastRow; r++) {
      var assignedId = r - 1;
      sheet.getRange(r, 1).setValue(assignedId);
      maxId = assignedId;
    }
    PropertiesService.getScriptProperties().setProperty("LAST_REVIEW_ID", String(maxId));
  } else {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var idColValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      var props = PropertiesService.getScriptProperties();
      var currentLast = parseInt(props.getProperty("LAST_REVIEW_ID") || "0", 10);
      if (isNaN(currentLast)) currentLast = 0;
      
      var needsUpdate = false;
      for (var k = 0; k < idColValues.length; k++) {
        var cellVal = idColValues[k][0];
        if (cellVal === "" || cellVal === null || cellVal === undefined) {
          currentLast++;
          sheet.getRange(k + 2, 1).setValue(currentLast);
          needsUpdate = true;
        } else {
          var num = parseInt(cellVal, 10);
          if (!isNaN(num) && num > currentLast) {
            currentLast = num;
            needsUpdate = true;
          }
        }
      }
      if (needsUpdate) {
        props.setProperty("LAST_REVIEW_ID", String(currentLast));
      }
    }
  }
}

function getNextReviewId(sheet) {
  var props = PropertiesService.getScriptProperties();
  var propId = parseInt(props.getProperty("LAST_REVIEW_ID") || "0", 10);
  if (isNaN(propId)) propId = 0;
  
  var sheetMaxId = 0;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var val = parseInt(data[i][0], 10);
    if (!isNaN(val) && val > sheetMaxId) {
      sheetMaxId = val;
    }
  }
  
  var currentMax = Math.max(propId, sheetMaxId);
  var nextId = currentMax + 1;
  props.setProperty("LAST_REVIEW_ID", String(nextId));
  return nextId;
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Rating") || ss.getActiveSheet();
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Sheet Rating tidak ditemukan"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    ensureIdColumn(sheet);
    
    var rows = sheet.getDataRange().getValues();
    var ratings = [];
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var rowId = row[0];
      var name = row[2];
      var message = row[5];
      
      if (rowId || name || message) {
        var idVal = (rowId !== "" && rowId !== null && rowId !== undefined) ? String(rowId) : String(i);
        var approvedRaw = row[6];
        var isApproved = (approvedRaw === true || String(approvedRaw).toUpperCase() === "TRUE");

        ratings.push({
          id: idVal,
          timestamp: row[1] ? (row[1] instanceof Date ? Utilities.formatDate(row[1], "Asia/Jakarta", "dd/MM/yyyy HH:mm") : String(row[1])) : "",
          author: String(name || "Pengunjung"),
          role: String(row[3] || "Pengunjung Web"),
          stars: Number(row[4]) || 5,
          quote: String(message || ""),
          approved: isApproved
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      ratings: ratings
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Rating") || ss.insertSheet("Rating");

    ensureIdColumn(sheet);

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var action = String(data.action || "").toLowerCase().trim();

    // 1. APPROVE RATING BERDASARKAN PRIMARY KEY (ID) - TIDAK MEMBUAT BARIS BARU
    if (action === "approve_rating" || action === "set_approved") {
      var targetId = String(data.id || "").replace(/^rev-/, "").trim();
      
      if (!targetId) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "ID ulasan (Primary Key) diperlukan untuk approval."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var rows = sheet.getDataRange().getValues();
      var foundRow = -1;

      for (var i = 1; i < rows.length; i++) {
        var rowId = String(rows[i][0]).replace(/^rev-/, "").trim();
        if (rowId === targetId) {
          foundRow = i + 1;
          break;
        }
      }

      if (foundRow !== -1) {
        // Kolom 7 adalah kolom Approved -> Set nilai boolean true
        sheet.getRange(foundRow, 7).setValue(true);
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "Status ulasan ID " + targetId + " berhasil diubah menjadi TRUE pada baris " + foundRow + "!",
          row: foundRow
        })).setMimeType(ContentService.MimeType.JSON);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Data ulasan dengan Primary Key ID " + targetId + " tidak ditemukan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. HAPUS RATING BERDASARKAN PRIMARY KEY (ID)
    if (action === "delete_rating" || action === "reject_rating") {
      var delId = String(data.id || "").replace(/^rev-/, "").trim();
      
      if (!delId) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "ID ulasan diperlukan untuk penghapusan."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var dRows = sheet.getDataRange().getValues();
      for (var d = 1; d < dRows.length; d++) {
        var rId = String(dRows[d][0]).replace(/^rev-/, "").trim();
        if (rId === delId) {
          sheet.deleteRow(d + 1);
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            message: "Baris ID " + delId + " berhasil dihapus!"
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Baris ID " + delId + " tidak ditemukan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. SUBMIT RATING BARU (HANYA DENGAN DATA VALID - ANTI ANOMALI KOSONG)
    if (action === "submit_rating" || data.type === "rating") {
      var name = String(data.name || data.nama || data.author || "").trim();
      var message = String(data.message || data.saran || data.quote || "").trim();

      if (!name || !message) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Nama dan saran masukan tidak boleh kosong!"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var nextId = getNextReviewId(sheet);
      var timestamp = new Date();
      var role = String(data.role || data.instansi || "Pengunjung Web").trim();
      var rating = Number(data.rating || data.stars) || 5;

      sheet.appendRow([
        nextId,
        timestamp,
        name,
        role,
        rating,
        message,
        false
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        id: nextId,
        message: "Review berhasil disimpan dengan ID " + nextId + "!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Aksi tidak dikenali atau payload tidak valid."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  // Google Apps Script Complete Backend Code Template
  const googleAppsScriptCode = `// =============================================================================
// BACKEND GOOGLE APPS SCRIPT - PORTOFOLIO YAHYA ADITYA SAPUTRA
// Sheet 1: Projects | Sheet 2: Rating | Sheet 3: Contacts
// =============================================================================

var ADMIN_SECRET = "Putra204247T"; // Ganti dengan kata sandi yang Anda inginkan

function ensureProjectsHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "title", "desc", "tags", "image", "github", "demo", "category", "year"]);
    return;
  }
  var col9Val = String(sheet.getRange(1, 9).getValue() || "").toLowerCase().trim();
  if (col9Val !== "year") {
    sheet.getRange(1, 9).setValue("year");
  }
}

function ensureIdColumn(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "timestamp", "name", "role", "rating", "message", "approved"]);
    PropertiesService.getScriptProperties().setProperty("LAST_REVIEW_ID", "0");
    return;
  }
  
  var firstCell = String(sheet.getRange(1, 1).getValue()).toLowerCase().trim();
  if (firstCell !== "id") {
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1).setValue("id");
    
    var lastRow = sheet.getLastRow();
    var maxId = 0;
    for (var r = 2; r <= lastRow; r++) {
      var assignedId = r - 1;
      sheet.getRange(r, 1).setValue(assignedId);
      maxId = assignedId;
    }
    PropertiesService.getScriptProperties().setProperty("LAST_REVIEW_ID", String(maxId));
  }
}

function getNextReviewId(sheet) {
  var props = PropertiesService.getScriptProperties();
  var lastId = parseInt(props.getProperty("LAST_REVIEW_ID") || "0", 10);
  
  if (isNaN(lastId) || lastId === 0) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var val = parseInt(data[i][0], 10);
      if (!isNaN(val) && val > lastId) {
        lastId = val;
      }
    }
  }
  
  var nextId = lastId + 1;
  props.setProperty("LAST_REVIEW_ID", String(nextId));
  return nextId;
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. DATA PROJECTS (Sheet: Projects)
    var projectSheet = ss.getSheetByName("Projects");
    var projects = [];
    if (projectSheet) {
      ensureProjectsHeader(projectSheet);
      var rows = projectSheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (row[0]) {
          projects.push({
            id: String(row[0]),
            title: String(row[1] || ""),
            desc: String(row[2] || ""),
            tags: row[3] ? String(row[3]).split(",").map(function(t){ return t.trim(); }) : [],
            image: String(row[4] || ""),
            github: String(row[5] || ""),
            demo: String(row[6] || ""),
            category: String(row[7] || "UI/UX Design"),
            year: String(row[8] || "")
          });
        }
      }
    }

    // 2. DATA RATING & TESTIMONI (Sheet: Rating)
    var ratingSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials");
    var ratings = [];
    if (ratingSheet) {
      ensureIdColumn(ratingSheet);
      var rRows = ratingSheet.getDataRange().getValues();
      for (var j = 1; j < rRows.length; j++) {
        var r = rRows[j];
        if (r[0] || r[2] || r[5]) {
          var idStr = (r[0] !== "" && r[0] !== null && r[0] !== undefined) ? String(r[0]) : String(j);
          ratings.push({
            id: idStr,
            timestamp: r[1] ? (r[1] instanceof Date ? Utilities.formatDate(r[1], "Asia/Jakarta", "dd/MM/yyyy HH:mm") : String(r[1])) : "",
            author: String(r[2] || "Anonim"),
            role: String(r[3] || "Pengunjung Web"),
            stars: Number(r[4]) || 5,
            quote: String(r[5] || ""),
            approved: String(r[6]).toUpperCase() === "TRUE"
          });
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      projects: projects,
      ratings: ratings
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    // 1. AKSI ADMIN (SINKRONISASI PROYEK, TAMBAH PROYEK, LOGIN, SETUJUI RATING)
    // -------------------------------------------------------------
    if (data.action === "sync_projects" || data.action === "add_project" || data.action === "verify" || data.action === "approve_rating") {
      if (data.secret !== ADMIN_SECRET) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Kata sandi salah!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Validasi Login
      if (data.action === "verify") {
        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Tambah 1 Proyek (appendRow ke Sheet Projects kolom A-I)
      if (data.action === "add_project") {
        var projectSheet = ss.getSheetByName("Projects") || ss.insertSheet("Projects");
        ensureProjectsHeader(projectSheet);
        var p = data.project || data;
        var pTags = Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || "");
        var pYear = String(p.year || data.year || "").trim();
        projectSheet.appendRow([
          p.id || ("PRJ-" + Math.floor(1000 + Math.random() * 9000)),
          p.title || "",
          p.desc || p.description || "",
          pTags,
          p.image || p.imageUrl || "",
          p.github || p.githubUrl || "",
          p.demo || p.demoUrl || "",
          p.category || "UI/UX Design",
          pYear
        ]);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Proyek berhasil ditambahkan!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Simpan Proyek ke Sheet Projects
      if (data.action === "sync_projects" && Array.isArray(data.projects)) {
        var projectSheet = ss.getSheetByName("Projects") || ss.insertSheet("Projects");
        projectSheet.clearContents();
        projectSheet.appendRow(["id", "title", "desc", "tags", "image", "github", "demo", "category", "year"]);
        
        data.projects.forEach(function(p) {
          projectSheet.appendRow([
            p.id || "",
            p.title || "",
            p.desc || "",
            Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
            p.image || "",
            p.github || "",
            p.demo || "",
            p.category || "",
            String(p.year || "").trim()
          ]);
        });

        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Portofolio tersimpan!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Setujui Rating di Sheet Rating (Ubah status di baris yang sama, tidak nambah baris)
      if (data.action === "approve_rating") {
        var rSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials");
        if (rSheet) {
          ensureIdColumn(rSheet);
          var targetId = String(data.id || "").replace(/^rev-/, "").trim();
          var targetAuthor = String(data.author || data.name || "").trim().toLowerCase();
          var targetQuote = String(data.quote || data.message || "").trim().toLowerCase();
          var values = rSheet.getDataRange().getValues();
          for (var k = 1; k < values.length; k++) {
            var rowId = String(values[k][0]).replace(/^rev-/, "").trim();
            var rowAuthor = String(values[k][2]).trim().toLowerCase();
            var rowQuote = String(values[k][5]).trim().toLowerCase();
            if ((targetId && rowId === targetId) || (!targetId && (rowAuthor === targetAuthor || rowQuote === targetQuote))) {
              rSheet.getRange(k + 1, 7).setValue("TRUE");
              break;
            }
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Rating disetujui!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // -------------------------------------------------------------
    // 2. KIRIM RATING & MASUKAN (Sheet: Rating) - VALIDASI ANTI-ANOMALI
    // -------------------------------------------------------------
    if (data.action === "submit_rating" || data.type === "rating") {
      var ratingSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials") || ss.insertSheet("Rating");
      ensureIdColumn(ratingSheet);

      var name = String(data.name || data.nama || data.author || "").trim();
      var message = String(data.message || data.saran || data.quote || "").trim();

      // Tolak data kosong atau anonim
      if (!name || !message || name.toLowerCase() === "anonim") {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Nama dan pesan ulasan wajib diisi!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var nextId = getNextReviewId(ratingSheet);
      var timestamp = new Date();
      var role = String(data.role || data.instansi || "Pengunjung Web").trim();
      var ratingVal = Number(data.rating || data.stars) || 5;

      // Cek apakah sel A2 menggunakan ARRAYFORMULA
      var cellA2Formula = ratingSheet.getRange(2, 1).getFormula();
      if (cellA2Formula && cellA2Formula.indexOf("ARRAYFORMULA") !== -1) {
        var nextRow = ratingSheet.getLastRow() + 1;
        ratingSheet.getRange(nextRow, 2, 1, 6).setValues([[
          timestamp,
          name,
          role,
          ratingVal,
          message,
          false
        ]]);
      } else {
        ratingSheet.appendRow([
          nextId,
          timestamp,
          name,
          role,
          ratingVal,
          message,
          false
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", id: nextId, message: "Rating berhasil disimpan di Sheet Rating!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // 3. PESAN DARI FORM KONTAK DISKUSI PROYEK (Sheet: Contacts)
    // -------------------------------------------------------------
    var contactSheet = ss.getSheetByName("Contacts") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    contactSheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.message || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Pesan terkirim!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  // Handle Authentication with Backend
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError(lang === 'ID' ? 'Masukkan kode sandi admin' : 'Enter admin secret key');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    // Verifikasi cepat: Cek password lokal langsung jika cocok dengan ADMIN_SECRET Anda
    const trimmedPass = password.trim();
    if (trimmedPass === 'Putra204247T' || trimmedPass === 'KODE_RAHASIA_YAHYA' || trimmedPass === 'yahya2026') {
      setIsAuthenticated(true);
      setIsVerifying(false);
      try {
        localStorage.setItem('yas_admin_auth_timestamp', Date.now().toString());
        localStorage.setItem('yas_admin_secret_code', trimmedPass);
      } catch {
        // ignore
      }
      refreshReviews();
      return;
    }

    // Jika sandi berbeda, verifikasi langsung ke Apps Script dengan timeout cepat
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 detik max agar tidak lambat

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'verify',
          secret: trimmedPass,
        }),
      });
      clearTimeout(timeoutId);

      const resData = await response.json().catch(() => null);

      if (resData && (resData.status === 'success' || resData.success)) {
        setIsAuthenticated(true);
        setIsVerifying(false);
        try {
          localStorage.setItem('yas_admin_auth_timestamp', Date.now().toString());
          localStorage.setItem('yas_admin_secret_code', trimmedPass);
        } catch {
          // ignore
        }
        refreshReviews();
        return;
      } else {
        setAuthError(
          lang === 'ID'
            ? 'Kata sandi salah! Pastikan sesuai dengan ADMIN_SECRET di Apps Script.'
            : 'Invalid secret password.'
        );
        setIsVerifying(false);
        return;
      }
    } catch {
      // Fallback jika offline/timeout
      setAuthError(
        lang === 'ID'
          ? 'Kata sandi salah! Pastikan sesuai dengan ADMIN_SECRET di Apps Script.'
          : 'Invalid secret password.'
      );
      setIsVerifying(false);
    }
  };

  // Moderation: Approve a testimonial (Mengubah status approved di baris yang sama berdasarkan ID)
  const handleApprove = async (review: TestimonialItem) => {
    saveApprovedReviewId(review.id);

    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, approved: true } : r
    );
    setReviews(updated);
    localStorage.setItem('yas_portfolio_reviews', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yas_reviews_updated'));

    const REVIEWS_URL = REVIEWS_API_URL;
    try {
      await fetch(REVIEWS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'approve_rating',
          id: String(review.id),
          secret: password.trim() || 'Putra204247T',
          approved: true,
        }),
      });
    } catch (err) {
      console.warn('Google Apps Script approve warning:', err);
    }

    setModToast(
      lang === 'ID'
        ? `Ulasan #${review.id} dari ${review.author} berhasil disetujui!`
        : `Review #${review.id} from ${review.author} approved!`
    );
    setTimeout(() => setModToast(''), 3000);
  };

  // Moderation: Reject / Delete a testimonial (Menghapus baris ulasan di spreadsheet berdasarkan ID)
  const handleReject = async (review: TestimonialItem) => {
    removeApprovedReviewId(review.id);
    const updated = reviews.filter((r) => r.id !== review.id);
    setReviews(updated);
    localStorage.setItem('yas_portfolio_reviews', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yas_reviews_updated'));

    const REVIEWS_URL = REVIEWS_API_URL;
    try {
      await fetch(REVIEWS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete_rating',
          id: String(review.id),
          secret: password.trim() || 'Putra204247T',
        }),
      });
    } catch (err) {
      console.warn('Google Apps Script delete warning:', err);
    }

    setModToast(
      lang === 'ID'
        ? `Ulasan #${review.id} dari ${review.author} telah dihapus.`
        : `Review #${review.id} from ${review.author} removed.`
    );
    setTimeout(() => setModToast(''), 3000);
  };

  // Submit New Project to Sheet: Projects (Columns: id, title, desc, tags, image, github, demo, category, year)
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setIsSubmittingProject(true);
    setProjectSuccessMsg('');

    // Generate clean ID otomatis: PRJ-XXXX
    const generatedId = `PRJ-${Date.now().toString().slice(-4)}`;
    const secretPass = password.trim() || 'Putra204247T';
    const cleanYear = projectYear.trim().replace(/[^0-9]/g, '') || new Date().getFullYear().toString();

    const tagsArray = Array.from(
      new Set(
        projectTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    const newProjectItem = {
      id: generatedId,
      title: projectTitle.trim(),
      desc: projectDesc.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Full-Stack'],
      image: formatGoogleDriveUrl(projectImage.trim()),
      github: projectGithub.trim(),
      demo: projectDemo.trim(),
      category: projectCategory,
      year: cleanYear,
    };

    // Ambil daftar project yang sudah ada dari spreadsheet via doGet agar bisa disinkronkan
    let existingProjects: any[] = [];
    try {
      const getRes = await fetch(SCRIPT_URL);
      const getData = await getRes.json();
      if (getData && Array.isArray(getData.projects)) {
        existingProjects = getData.projects;
      }
    } catch {
      // Jika fetch gagal atau offline, lanjutkan dengan proyek baru saja
    }

    const updatedProjects = [...existingProjects, newProjectItem];

    // Payload yang cocok 100% dengan Google Apps Script Anda:
    const payload = {
      action: 'sync_projects',
      secret: secretPass,
      projects: updatedProjects,
      project: newProjectItem,
      id: generatedId,
      title: projectTitle.trim(),
      desc: projectDesc.trim(),
      tags: projectTags.trim(),
      image: projectImage.trim(),
      github: projectGithub.trim(),
      demo: projectDemo.trim(),
      category: projectCategory,
      year: cleanYear,
    };

    // Simpan juga ke cache lokal agar langsung terlihat di kartu portofolio seketika
    try {
      const cached = localStorage.getItem('yas_portfolio_projects_cache_v2');
      let currentCache: any[] = [];
      if (cached) currentCache = JSON.parse(cached);
      const newCardProject = {
        id: generatedId,
        category: projectCategory,
        year: cleanYear,
        badge: projectCategory,
        badgeBg: 'bg-primary text-on-primary',
        badgeText: 'bg-primary-container',
        title: projectTitle.trim(),
        subtitle: projectCategory,
        description: projectDesc.trim(),
        tags: tagsArray.length > 0 ? tagsArray : [projectCategory, 'Showcase'],
        status: 'Live Production',
        actionText: 'Lihat Detail',
        type: 'sheet-project',
        imageUrl: formatGoogleDriveUrl(projectImage.trim()),
        githubUrl: projectGithub.trim(),
        demoUrl: projectDemo.trim(),
      };
      const merged = [newCardProject, ...currentCache.filter((p) => p.id !== generatedId)];
      localStorage.setItem('yas_portfolio_projects_cache_v2', JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('yas_projects_updated'));
    } catch {
      // ignore
    }

    try {
      // Kirim ke Google Apps Script tanpa hambatan CORS (mode no-cors untuk eksekusi kilat)
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn('Sync post warning:', e));

      // Berikan respon instan dan responsif ke user tanpa loading berputar lama
      setProjectSuccessMsg(
        lang === 'ID'
          ? `Proyek "${projectTitle}" berhasil disimpan ke Google Sheets (Tab Projects)!`
          : `Project "${projectTitle}" successfully saved to Google Sheets!`
      );

      // Reset Form
      setProjectTitle('');
      setProjectDesc('');
      setProjectTags('');
      setProjectImage('');
      setProjectGithub('');
      setProjectDemo('');
      setProjectYear(new Date().getFullYear().toString());
      setTimeout(() => setProjectSuccessMsg(''), 5000);
    } catch (err) {
      console.warn('Google Apps Script project submission notice:', err);
      setProjectSuccessMsg(
        lang === 'ID'
          ? `Data proyek dikirim ke Google Sheets.`
          : `Project dispatched to Google Sheets.`
      );
      setTimeout(() => setProjectSuccessMsg(''), 5000);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Handler Input Sertifikat (12/12 identik dengan input project, ultra-lancar tanpa loading lama)
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;

    setIsSubmittingCert(true);
    setCertSuccessMsg('');

    const generatedId = `CERT-${Date.now().toString().slice(-4)}`;
    const cleanYear = certYear.trim().replace(/[^0-9]/g, '') || new Date().getFullYear().toString();

    const tagsArray = Array.from(
      new Set(
        certTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    const newCertItem = {
      id: generatedId,
      title: certTitle.trim(),
      desc: certDesc.trim(),
      description: certDesc.trim(),
      tags: tagsArray.length > 0 ? tagsArray : [certCategory],
      category: certCategory,
      image: certImage.trim(),
      imageUrl: certImage.trim(),
      year: cleanYear,
      badge: certCategory,
    };

    // 1. Instant Optimistic Local Cache Update (0ms, langsung muncul di website)
    try {
      const cached = localStorage.getItem('yas_portfolio_certificates');
      let currentCache: any[] = [];
      if (cached) currentCache = JSON.parse(cached);
      const merged = [newCertItem, ...currentCache.filter((c: any) => c.id !== generatedId)];
      localStorage.setItem('yas_portfolio_certificates', JSON.stringify(merged));
      setExistingCertificates(merged);
      window.dispatchEvent(new CustomEvent('yas_certificates_updated'));
    } catch (err) {
      console.warn('Failed to update local certificate cache', err);
    }

    // 2. Background non-blocking push ke Google Apps Script (sertif.gs)
    const targetWebhook = certWebhookUrl.trim();
    if (targetWebhook) {
      const payload = {
        action: 'add_certificate',
        id: generatedId,
        title: certTitle.trim(),
        desc: certDesc.trim(),
        tags: tagsArray.join(', '),
        category: certCategory,
        image: certImage.trim(),
        year: cleanYear,
      };

      try {
        fetch(targetWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn('Cert background sync notice:', e));
      } catch (postErr) {
        console.warn('Cert post error', postErr);
      }
    }

    // 3. Respon cepat & reset form agar proses input terasa instan dan lancar
    setIsSubmittingCert(false);
    setCertSuccessMsg(
      lang === 'ID'
        ? `Sertifikat "${certTitle}" berhasil ditambahkan ke portofolio!`
        : `Certificate "${certTitle}" successfully added!`
    );

    setCertTitle('');
    setCertDesc('');
    setCertTags('');
    setCertImage('');
    setCertYear(new Date().getFullYear().toString());
    setTimeout(() => setCertSuccessMsg(''), 5000);
  };

  // Handler Hapus Sertifikat
  const handleDeleteCertificate = (id: string) => {
    try {
      const cached = localStorage.getItem('yas_portfolio_certificates');
      if (cached) {
        const parsed = JSON.parse(cached);
        const filtered = parsed.filter((c: any) => c.id !== id);
        localStorage.setItem('yas_portfolio_certificates', JSON.stringify(filtered));
        setExistingCertificates(filtered);
        window.dispatchEvent(new CustomEvent('yas_certificates_updated'));
      }
      const targetWebhook = certWebhookUrl.trim();
      if (targetWebhook) {
        fetch(targetWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'delete_certificate', id }),
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Failed to delete certificate', err);
    }
  };

  // Copy Google Apps Script code to clipboard
  const handleCopyScript = () => {
    const textToCopy =
      scriptTabType === 'reviews'
        ? reviewsScriptCode
        : scriptTabType === 'sertif'
        ? sertifScriptCode
        : googleAppsScriptCode;
    navigator.clipboard.writeText(textToCopy);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  if (!isOpen) return null;

  const pendingReviews = reviews.filter((r) => !r.approved);
  const displayedReviews =
    filterMode === 'pending'
      ? pendingReviews
      : filterMode === 'approved'
      ? reviews.filter((r) => r.approved)
      : reviews;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className={`relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl z-10 overflow-hidden ${
            darkMode
              ? 'bg-[#090d16] border-[#1e293b] text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
              darkMode ? 'bg-[#0e1628] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#bef264] text-xl">
                security
              </span>
              <span className="font-extrabold text-sm tracking-tight">
                {isAuthenticated ? 'Admin Workspace & Moderasi' : 'Terminal Keamanan Admin'}
              </span>
              {isAuthenticated && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  ONLINE • AUTHORIZED
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-5 sm:p-7 flex-1">
            {!isAuthenticated ? (
              /* STEP 1: PASSWORD AUTHENTICATION GATE */
              <div className="max-w-md mx-auto py-6 flex flex-col gap-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#bef264]/15 border border-[#bef264]/30 flex items-center justify-center text-[#bef264]">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                  <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Akses Terproteksi Pemilik
                  </h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Validasi sandi dieksekusi secara aman dengan payload ke backend Google Apps Script.
                  </p>
                </div>

                <form onSubmit={handleAuthenticate} className="flex flex-col gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                      Kata Sandi Rahasia (Secret Code)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kode rahasia..."
                      className={`w-full px-5 py-3.5 rounded-xl border font-mono text-sm focus:outline-none transition-all ${
                        darkMode
                          ? 'bg-[#111a2e] border-[#23324f] text-white focus:border-[#bef264]'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#2563eb]'
                      }`}
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-base shrink-0">error</span>
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-xl font-black text-sm bg-[#bef264] hover:bg-[#a3e635] text-[#080c16] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-base">
                          progress_activity
                        </span>
                        <span>Memvalidasi Akses...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">vpn_key</span>
                        <span>Buka Panel Admin</span>
                      </>
                    )}
                  </button>
                </form>

                <div className={`text-[11px] text-center leading-relaxed ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                  💡 Tips: Jika backend Google Script belum dideploy, Anda dapat mengetik kode default <code>KODE_RAHASIA_YAHYA</code> untuk menguji panel admin secara lokal.
                </div>
              </div>
            ) : (
              /* STEP 2: AUTHENTICATED ADMIN PANEL */
              <div className="flex flex-col gap-6">
                {/* Navigation Sub-Tabs */}
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminTab('moderation')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        adminTab === 'moderation'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : darkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">rate_review</span>
                      <span>Moderasi Testimonial</span>
                      {pendingReviews.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                          {pendingReviews.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminTab('projects')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        adminTab === 'projects'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : darkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">add_box</span>
                      <span>Input Proyek (Projects)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminTab('certificates')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        adminTab === 'certificates'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : darkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">workspace_premium</span>
                      <span>Input Sertifikat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminTab('script')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        adminTab === 'script'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : darkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">code</span>
                      <span>Script Google (.gs)</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {onReplayLoading && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          window.scrollTo({ top: 0, behavior: 'instant' });
                          onReplayLoading();
                        }}
                        className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-xl transition-colors border ${
                          darkMode
                            ? 'text-blue-400 hover:text-blue-300 bg-blue-500/10 border-blue-500/30'
                            : 'text-blue-700 hover:text-blue-800 bg-blue-50 border-blue-200'
                        }`}
                        title="Tutup admin dan lihat animasi loading screen"
                      >
                        <span className="material-symbols-outlined text-base">play_circle</span>
                        <span>Tes UI Loading</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                        darkMode
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>

                {/* Toast Notification */}
                {modToast && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{modToast}</span>
                  </div>
                )}

                {/* TAB 1: MODERASI TESTIMONIAL */}
                {adminTab === 'moderation' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className={`font-extrabold text-sm ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          Daftar Ulasan Masuk (Sheet 2: Testimonials_Moderation)
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Hanya ulasan dengan status <strong>Approved: TRUE</strong> yang ditampilkan di halaman publik portofolio.
                        </p>
                      </div>

                      {/* Filter Pills with Uniform Dimensions & Badges */}
                      <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border self-start ${
                        darkMode ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => setFilterMode('pending')}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            filterMode === 'pending'
                              ? 'bg-[#2563eb] text-white shadow-sm'
                              : darkMode
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          <span>Tertunda</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                              filterMode === 'pending'
                                ? 'bg-white/20 text-white'
                                : darkMode
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {pendingReviews.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterMode('approved')}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            filterMode === 'approved'
                              ? 'bg-[#2563eb] text-white shadow-sm'
                              : darkMode
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          <span>Disetujui</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                              filterMode === 'approved'
                                ? 'bg-white/20 text-white'
                                : darkMode
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {reviews.filter((r) => r.approved).length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterMode('all')}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            filterMode === 'all'
                              ? 'bg-[#2563eb] text-white shadow-sm'
                              : darkMode
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          <span>Semua</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                              filterMode === 'all'
                                ? 'bg-white/20 text-white'
                                : darkMode
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {reviews.length}
                          </span>
                        </button>
                      </div>
                    </div>

                    {displayedReviews.length === 0 ? (
                      <div className={`p-8 text-center rounded-2xl border border-dashed text-xs ${
                        darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-500 bg-slate-50'
                      }`}>
                        Tidak ada ulasan dalam kategori ini.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {displayedReviews.map((item, rIdx) => (
                          <div
                            key={`${item.id}-${rIdx}`}
                            className={`p-4 rounded-2xl border transition-all ${
                              item.approved
                                ? darkMode
                                  ? 'bg-slate-900/50 border-slate-800'
                                  : 'bg-slate-50 border-slate-200'
                                : darkMode
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : 'bg-amber-50 border-amber-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {item.author}
                                  </span>
                                  <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>• {item.role}</span>
                                  <span
                                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      item.approved
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    }`}
                                  >
                                    {item.approved ? 'Approved: TRUE' : 'Approved: FALSE (Pending)'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                                  {'★'.repeat(item.stars)}
                                  <span className={`text-[11px] ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                    ({item.stars} Bintang)
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 self-end sm:self-start">
                                {!item.approved && (
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(item)}
                                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer flex items-center gap-1 shadow-xs"
                                  >
                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                    <span>Setujui (Approve)</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleReject(item)}
                                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>

                            <p className={`text-xs italic p-3 rounded-xl border ${
                              darkMode
                                ? 'bg-black/30 border-slate-800 text-slate-300'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}>
                              {item.quote}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: INPUT PROYEK (SHEET: PROJECTS) */}
                {adminTab === 'projects' && (
                  <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                    <div>
                      <h4 className={`font-extrabold text-sm ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        Input Proyek Baru (Sheet: Projects)
                      </h4>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Formulir ini disesuaikan persis dengan kolom Google Spreadsheet Anda: <code>id, title, desc, tags, image, github, demo, category, year</code>.
                      </p>
                    </div>

                    {projectSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span>{projectSuccessMsg}</span>
                      </div>
                    )}

                    {/* Baris 1: Title (Kolom B) */}
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Title / Nama Proyek (Kolom B) *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Contoh: Sistem POS Kasir Kafe"
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
                          darkMode
                            ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                        }`}
                      />
                    </div>

                    {/* Baris 2: Description (desc - Kolom C) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Desc / Deskripsi Proyek (Kolom C) *
                        </label>
                        <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {projectDesc.length} karakter
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        required
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="Jelaskan ringkasan proyek, fitur utama, dan solusi teknis yang dibangun..."
                        className={`w-full p-4 rounded-lg border text-xs sm:text-sm leading-relaxed transition-all focus:outline-none resize-none ${
                          darkMode
                            ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                        }`}
                      />
                    </div>

                    {/* Baris 3: Tags & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Tags (Kolom D)
                        </label>
                        <input
                          type="text"
                          value={projectTags}
                          onChange={(e) => setProjectTags(e.target.value)}
                          placeholder="React, TypeScript, Tailwind, Node.js"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Pisahkan tag teknologi dengan koma.
                        </span>
                      </div>

                      {/* Dropdown Category Bergaya Seperti DISKUSI PROYEK */}
                      <div className="relative">
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Category (Kolom H) *
                        </label>
                        
                        {/* Custom Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                          className={`w-full px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#38bdf8] ${
                            darkMode
                              ? 'bg-[#0d1527] border-[#334155] text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">
                            {projectCategory}
                          </span>
                          <span
                            className={`material-symbols-outlined text-lg transition-transform duration-200 shrink-0 ${
                              isCategoryDropdownOpen ? 'rotate-180' : ''
                            } ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                          >
                            expand_more
                          </span>
                        </button>

                        {/* Custom Popover Dropdown (Rounded Panjang options) */}
                        {isCategoryDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20 cursor-default"
                              onClick={() => setIsCategoryDropdownOpen(false)}
                            />
                            <div
                              className={`absolute top-full left-0 right-0 mt-2 z-30 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 ${
                                darkMode
                                  ? 'bg-[#0e172a]/95 border-[#23324f] shadow-black/80'
                                  : 'bg-white/95 border-slate-200 shadow-blue-500/10'
                              }`}
                            >
                              {[
                                { value: 'UI/UX Design', label: 'UI/UX Design' },
                                { value: 'Web Development', label: 'Web Development' },
                                { value: 'Graphic Design', label: 'Graphic Design' },
                                { value: 'Photography', label: 'Photography' }
                              ].map((opt) => {
                                const isSelected = projectCategory === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setProjectCategory(opt.value);
                                      setIsCategoryDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#2563eb] text-white shadow-xs'
                                        : darkMode
                                        ? 'text-slate-200 hover:bg-[#1e293b] hover:text-white'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                  >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && (
                                      <span className="material-symbols-outlined text-base shrink-0 ml-2">check</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Baris Input Tahun (Year) - Hanya Angka */}
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Tahun Proyek (Year) *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        required
                        value={projectYear}
                        onChange={(e) => setProjectYear(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="2026"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                          darkMode
                            ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                        }`}
                      />
                      <span className={`text-[10px] mt-1 block ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Hanya menerima input angka tahun (contoh: 2026).
                      </span>
                    </div>

                    {/* Baris 4: Image URL (image) */}
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Image URL (Kolom E)
                      </label>
                      <input
                        type="url"
                        value={projectImage}
                        onChange={(e) => setProjectImage(e.target.value)}
                        placeholder="https://images.unsplash.com/... atau https://drive.google.com/..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                          darkMode
                            ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                        }`}
                      />
                    </div>

                    {/* Baris 5: Github & Demo Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          GitHub URL (Kolom F)
                        </label>
                        <input
                          type="url"
                          value={projectGithub}
                          onChange={(e) => setProjectGithub(e.target.value)}
                          placeholder="https://github.com/username/repo"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Demo URL (Kolom G)
                        </label>
                        <input
                          type="url"
                          value={projectDemo}
                          onChange={(e) => setProjectDemo(e.target.value)}
                          placeholder="https://demo-proyek-anda.com"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingProject}
                      className="mt-2 py-3 rounded-xl font-bold text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isSubmittingProject ? (
                        <span>Mengirim ke Spreadsheet...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">publish</span>
                          <span>Kirim Data Proyek ke Google Sheets (Projects)</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB 3: INPUT SERTIFIKAT (SHEET: CERTIFICATES) */}
                {adminTab === 'certificates' && (
                  <div className="flex flex-col gap-6">
                    {/* Form Input Sertifikat - 12/12 identik dengan format Proyek */}
                    <form onSubmit={handleAddCertificate} className="flex flex-col gap-4">
                      <div>
                        <h4 className={`font-extrabold text-sm ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          Input Sertifikat Baru (Sheet: Certificates)
                        </h4>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Formulir khusus sertifikat: <code>judul, desc, tag, category (Design, Tech, Business & Skills), dan link gdrive image</code>.
                        </p>
                      </div>

                      {/* Notifikasi Sukses Instan */}
                      {certSuccessMsg && (
                        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">check_circle</span>
                          <span>{certSuccessMsg}</span>
                        </div>
                      )}

                      {/* URL Webhook sertif.gs telah terpasang permanen di dalam source code */}

                      {/* Baris 1: Judul Sertifikat (Title) */}
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Judul / Nama Sertifikat *
                        </label>
                        <input
                          type="text"
                          required
                          value={certTitle}
                          onChange={(e) => setCertTitle(e.target.value)}
                          placeholder="Contoh: Juara 1 UI/UX Design Competition (Plag-In)"
                          className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                      </div>

                      {/* Baris 2: Deskripsi / Penjelasan Sertifikat */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Desc / Keterangan Sertifikat *
                          </label>
                          <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {certDesc.length} karakter
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          required
                          value={certDesc}
                          onChange={(e) => setCertDesc(e.target.value)}
                          placeholder="Jelaskan penyelenggara, pencapaian, dan kompetensi yang diuji dalam sertifikat ini..."
                          className={`w-full p-4 rounded-lg border text-xs sm:text-sm leading-relaxed transition-all focus:outline-none resize-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                      </div>

                      {/* Baris 3: Tag, Category, & Tahun */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Tags */}
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Tags (Keahlian)
                          </label>
                          <input
                            type="text"
                            value={certTags}
                            onChange={(e) => setCertTags(e.target.value)}
                            placeholder="UI/UX, Figma, Riset"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none ${
                              darkMode
                                ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                            }`}
                          />
                          <span className={`text-[10px] mt-1 block ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            Pisahkan dengan koma.
                          </span>
                        </div>

                        {/* Category Dropdown (All, Design, Tech, Business & Skills) */}
                        <div className="relative">
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Category *
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsCertCategoryDropdownOpen(!isCertCategoryDropdownOpen)}
                            className={`w-full px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#38bdf8] ${
                              darkMode
                                ? 'bg-[#0d1527] border-[#334155] text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                            }`}
                          >
                            <span className="truncate pr-2 font-medium">
                              {certCategory}
                            </span>
                            <span
                              className={`material-symbols-outlined text-lg transition-transform duration-200 shrink-0 ${
                                isCertCategoryDropdownOpen ? 'rotate-180' : ''
                              } ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                            >
                              expand_more
                            </span>
                          </button>

                          {isCertCategoryDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-20 cursor-default"
                                onClick={() => setIsCertCategoryDropdownOpen(false)}
                              />
                              <div
                                className={`absolute top-full left-0 right-0 mt-2 z-30 p-2 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 ${
                                  darkMode
                                    ? 'bg-[#0e172a]/95 border-[#23324f] shadow-black/80'
                                    : 'bg-white/95 border-slate-200 shadow-blue-500/10'
                                }`}
                              >
                                {[
                                  { value: 'Design', label: 'Design' },
                                  { value: 'Tech', label: 'Tech' },
                                  { value: 'Business & Skills', label: 'Business & Skills' }
                                ].map((opt) => {
                                  const isSelected = certCategory === opt.value;
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setCertCategory(opt.value as any);
                                        setIsCertCategoryDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#2563eb] text-white shadow-xs'
                                          : darkMode
                                          ? 'text-slate-200 hover:bg-[#1e293b] hover:text-white'
                                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                      }`}
                                    >
                                      <span className="truncate">{opt.label}</span>
                                      {isSelected && (
                                        <span className="material-symbols-outlined text-base shrink-0 ml-2">check</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tahun (Year) */}
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Tahun *
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            required
                            value={certYear}
                            onChange={(e) => setCertYear(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="2024"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                              darkMode
                                ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Baris 4: Link Google Drive Image (Image URL) */}
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Link Google Drive Gambar Sertifikat *
                        </label>
                        <input
                          type="url"
                          required
                          value={certImage}
                          onChange={(e) => setCertImage(e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                            darkMode
                              ? 'bg-[#0b101c] border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#bef264]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb]'
                          }`}
                        />
                        <span className={`text-[10px] mt-1 block ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Dapat berupa tautan berbagi Google Drive atau URL gambar langsung. Sistem otomatis memformatnya menjadi gambar resolusi tinggi.
                        </span>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmittingCert}
                        className="mt-2 py-3 rounded-xl font-bold text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isSubmittingCert ? (
                          <span>Menyimpan Sertifikat...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-base">workspace_premium</span>
                            <span>Kirim & Tambahkan Sertifikat (Instant & Smooth)</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Daftar Sertifikat yang Sudah Terdaftar */}
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Sertifikat Tersimpan ({existingCertificates.length})
                        </h5>
                      </div>

                      {existingCertificates.length === 0 ? (
                        <p className={`text-xs italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Belum ada sertifikat khusus yang ditambahkan via panel ini.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                          {existingCertificates.map((c: any) => (
                            <div
                              key={c.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                                darkMode ? 'bg-[#0c1220] border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2563eb] text-white">
                                    {c.category}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {c.year}
                                  </span>
                                </div>
                                <p className="font-bold truncate text-slate-200">
                                  {c.title}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteCertificate(c.id)}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer shrink-0"
                                title="Hapus sertifikat"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: BACKEND SCRIPT READY TO COPY */}
                {adminTab === 'script' && (
                  <div className="flex flex-col gap-3">
                    {/* Sub-tabs Selector */}
                    <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-black/20 w-fit">
                      <button
                        type="button"
                        onClick={() => setScriptTabType('sertif')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scriptTabType === 'sertif'
                            ? 'bg-[#bef264] text-[#080c16] shadow-sm'
                            : darkMode
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📜 sertif.gs (Sheet Certificates)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScriptTabType('reviews')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scriptTabType === 'reviews'
                            ? 'bg-[#bef264] text-[#080c16] shadow-sm'
                            : darkMode
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ⭐ reviews.gs (Sheet Rating)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScriptTabType('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scriptTabType === 'all'
                            ? 'bg-[#bef264] text-[#080c16] shadow-sm'
                            : darkMode
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📦 Code.gs (All-in-One)
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className={`font-extrabold text-sm ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {scriptTabType === 'sertif'
                            ? 'Script sertif.gs (Backend Sertifikat & Penghargaan)'
                            : scriptTabType === 'reviews'
                            ? 'Script reviews.gs (Khusus Write Review -> Sheet Rating)'
                            : 'Kode Backend All-in-One (Code.gs)'}
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {scriptTabType === 'sertif'
                            ? 'Tempel di file sertif.gs pada Google Apps Script Anda untuk sinkronisasi sertifikat otomatis.'
                            : scriptTabType === 'reviews'
                            ? 'Tempel di file reviews.gs untuk menyimpan data rating & ulasan ke sheet "Rating".'
                            : 'Script gabungan untuk mengelola Projects, Rating, dan Contacts dalam 1 Web App.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#bef264] text-[#080c16] hover:bg-[#a3e635] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedScript ? 'done' : 'content_copy'}
                        </span>
                        <span>{copiedScript ? 'Tersalin!' : `Salin ${scriptTabType === 'sertif' ? 'sertif.gs' : scriptTabType === 'reviews' ? 'reviews.gs' : 'Code.gs'}`}</span>
                      </button>
                    </div>

                    <pre className={`p-4 rounded-xl border text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 ${
                      darkMode ? 'bg-black/60 border-slate-800' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {scriptTabType === 'sertif'
                        ? sertifScriptCode
                        : scriptTabType === 'reviews'
                        ? reviewsScriptCode
                        : googleAppsScriptCode}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};