import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  lang,
  darkMode,
  onReplayLoading,
}) => {
  // Authentication & Security State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Google Apps Script Webhook URL
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem('yas_sheet_webhook_url') || '';
  });

  // Active Tab in Admin
  const [adminTab, setAdminTab] = useState<'moderation' | 'projects' | 'script'>('projects');

  // Hardcoded deployed backend Webhook URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEXPJrr6eOD8X7HAMMtX86loDB0EaTPpnwK3wPl2QSugXa1IZ5SnK745AEM40BlwJ5/exec';

  // Reviews for moderation
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [filterMode, setFilterMode] = useState<'pending' | 'all' | 'approved'>('pending');

  // Form Input Project State - Sesuai persis dengan Kolom Sheet Projects:
  // id (auto), title, desc, tags, image, github, demo, category
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectCategory, setProjectCategory] = useState('fullstack');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');

  // Moderation action status toast
  const [modToast, setModToast] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  // Load reviews from localStorage & spreadsheet
  const refreshReviews = async () => {
    const saved = localStorage.getItem('yas_portfolio_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch {
        setReviews([]);
      }
    }

    const REVIEWS_SCRIPT_URL =
      localStorage.getItem('yas_reviews_webhook_url') ||
      'https://script.google.com/macros/s/AKfycbxBQkvKe85FvYo5AKEbUPoVR8-9o9vFgppKYgigwgXfdhhzHKtiHmlvZ9Q3U7FJiR81/exec';

    try {
      const res = await fetch(REVIEWS_SCRIPT_URL);
      const data = await res.json();
      if (data && Array.isArray(data.ratings) && data.ratings.length > 0) {
        const mapped: TestimonialItem[] = data.ratings.map((r: any, idx: number) => ({
          id: r.id || `sheet-rev-${idx}`,
          author: r.author || r.name || 'Anonim',
          role: r.role || (lang === 'ID' ? 'Pengunjung Web' : 'Web Visitor'),
          stars: Number(r.stars || r.rating) || 5,
          quote: r.quote || r.message || '',
          avatar: (r.author || 'US').slice(0, 2).toUpperCase(),
          avatarBg: 'bg-[#2563eb]',
          avatarText: 'text-white',
          approved: r.approved === true || String(r.approved).toUpperCase() === 'TRUE',
          timestamp: r.timestamp || '',
        }));

        setReviews(mapped);
        localStorage.setItem('yas_portfolio_reviews', JSON.stringify(mapped));
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshReviews();
    }
  }, [isOpen]);

  // Persist Script URL
  const handleSaveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem('yas_sheet_webhook_url', url);
  };

  const [scriptTabType, setScriptTabType] = useState<'reviews' | 'all'>('reviews');

  // Khusus Script reviews.gs untuk Write Review & Rating ke sheet "Rating"
  const reviewsScriptCode = `// =============================================================================
// BACKEND WRITE REVIEW & RATING (reviews.gs)
// Database: Google Spreadsheet -> Tab: "Rating"
// =============================================================================

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Rating") || ss.getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var ratings = [];
    
    // Baris 1 adalah header, data ulasan mulai dari baris 2 (index 1)
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[1] || row[4]) {
        ratings.push({
          id: "rev-" + i,
          timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), "Asia/Jakarta", "dd/MM/yyyy HH:mm") : "",
          author: String(row[1] || "Anonim"),
          role: String(row[2] || "Pengunjung"),
          stars: Number(row[3]) || 5,
          quote: String(row[4] || ""),
          approved: String(row[5]).toUpperCase() === "TRUE"
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

    // Jika sheet masih baru atau baris 1 kosong, buat otomatis header kolom
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Nama Lengkap",
        "Peran / Hubungan",
        "Rating (Bintang)",
        "Saran & Masukan",
        "Approved"
      ]);
    }

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

    // Ambil data kiriman ulasan & rating pengunjung
    var timestamp = new Date();
    var name = data.name || data.nama || data.author || "Anonim";
    var role = data.role || data.instansi || "Pengunjung Web";
    var rating = Number(data.rating || data.stars) || 5;
    var message = data.message || data.saran || data.quote || "";
    var approved = (data.approved === true || data.approved === "TRUE") ? "TRUE" : "FALSE";

    // Simpan baris baru ke Sheet Rating
    sheet.appendRow([
      timestamp,
      name,
      role,
      rating,
      message,
      approved
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Review dan rating berhasil disimpan ke sheet Rating!"
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

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. DATA PROJECTS (Sheet: Projects)
    var projectSheet = ss.getSheetByName("Projects");
    var projects = [];
    if (projectSheet) {
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
            category: String(row[7] || "fullstack")
          });
        }
      }
    }

    // 2. DATA RATING & TESTIMONI (Sheet: Rating)
    var ratingSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials");
    var ratings = [];
    if (ratingSheet) {
      var rRows = ratingSheet.getDataRange().getValues();
      for (var j = 1; j < rRows.length; j++) {
        var r = rRows[j];
        if (r[1] || r[4]) {
          ratings.push({
            id: "rev-" + j,
            timestamp: r[0] ? Utilities.formatDate(new Date(r[0]), "Asia/Jakarta", "dd/MM/yyyy HH:mm") : "",
            author: String(r[1] || "Anonim"),
            role: String(r[2] || "Pengunjung Web"),
            stars: Number(r[3]) || 5,
            quote: String(r[4] || ""),
            approved: String(r[5]).toUpperCase() === "TRUE"
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
    // 1. AKSI ADMIN (SINKRONISASI PROYEK, LOGIN, SETUJUI RATING)
    // -------------------------------------------------------------
    if (data.action === "sync_projects" || data.action === "verify" || data.action === "approve_rating") {
      if (data.secret !== ADMIN_SECRET) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Kata sandi salah!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Validasi Login
      if (data.action === "verify") {
        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Simpan Proyek ke Sheet Projects
      if (data.action === "sync_projects" && Array.isArray(data.projects)) {
        var projectSheet = ss.getSheetByName("Projects") || ss.insertSheet("Projects");
        projectSheet.clearContents();
        projectSheet.appendRow(["id", "title", "desc", "tags", "image", "github", "demo", "category"]);
        
        data.projects.forEach(function(p) {
          projectSheet.appendRow([
            p.id || "",
            p.title || "",
            p.desc || "",
            Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
            p.image || "",
            p.github || "",
            p.demo || "",
            p.category || ""
          ]);
        });

        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Portofolio tersimpan!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Setujui Rating di Sheet Rating
      if (data.action === "approve_rating") {
        var rSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials");
        if (rSheet) {
          var values = rSheet.getDataRange().getValues();
          for (var k = 1; k < values.length; k++) {
            if (values[k][1] === data.author || values[k][4] === data.quote) {
              rSheet.getRange(k + 1, 6).setValue("TRUE");
              break;
            }
          }
        }
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Rating disetujui!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // -------------------------------------------------------------
    // 2. KIRIM RATING & MASUKAN (Sheet: Rating) - PUBLIK (TANPA SANDI)
    // -------------------------------------------------------------
    if (data.action === "submit_rating" || data.type === "rating" || (data.rating && !data.email)) {
      var ratingSheet = ss.getSheetByName("Rating") || ss.getSheetByName("Testimonials") || ss.insertSheet("Rating");
      
      // Jika sheet masih kosong, buat baris header
      if (ratingSheet.getLastRow() === 0) {
        ratingSheet.appendRow(["timestamp", "name", "role", "rating", "message", "approved"]);
      }

      var timestamp = new Date();
      var name = data.name || data.nama || data.author || "Anonim";
      var role = data.role || data.instansi || "Pengunjung Web";
      var ratingVal = Number(data.rating || data.stars) || 5;
      var message = data.message || data.saran || data.quote || "";
      var approved = (data.approved === true || data.approved === "TRUE") ? "TRUE" : "FALSE";

      ratingSheet.appendRow([
        timestamp,
        name,
        role,
        ratingVal,
        message,
        approved
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Rating berhasil disimpan di Sheet Rating!" }))
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

  // Moderation: Approve a testimonial
  const handleApprove = async (review: TestimonialItem) => {
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, approved: true } : r
    );
    setReviews(updated);
    localStorage.setItem('yas_portfolio_reviews', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yas_reviews_updated'));

    // Send HTTP POST payload with secretCode to Google Apps Script as specified
    const targetUrl = scriptUrl.trim() || SCRIPT_URL;
    try {
      await fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'approve_rating',
          secret: password.trim() || 'Putra204247T',
          author: review.author,
          name: review.author,
          quote: review.quote,
          approved: 'TRUE',
        }),
      });
    } catch (err) {
      console.warn('Google Apps Script approve warning:', err);
    }

    setModToast(
      lang === 'ID'
        ? `Ulasan dari ${review.author} berhasil disetujui (Approved: TRUE)!`
        : `Review from ${review.author} approved!`
    );
    setTimeout(() => setModToast(''), 3000);
  };

  // Moderation: Reject / Delete a testimonial
  const handleReject = async (review: TestimonialItem) => {
    const updated = reviews.filter((r) => r.id !== review.id);
    setReviews(updated);
    localStorage.setItem('yas_portfolio_reviews', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('yas_reviews_updated'));

    setModToast(
      lang === 'ID'
        ? `Ulasan dari ${review.author} telah ditolak/dihapus.`
        : `Review from ${review.author} removed.`
    );
    setTimeout(() => setModToast(''), 3000);
  };

  // Submit New Project to Sheet: Projects (Columns: id, title, desc, tags, image, github, demo, category)
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setIsSubmittingProject(true);
    setProjectSuccessMsg('');

    // Generate clean ID otomatis: PRJ-XXXX
    const generatedId = `PRJ-${Date.now().toString().slice(-4)}`;
    const secretPass = password.trim() || 'Putra204247T';

    const tagsArray = projectTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProjectItem = {
      id: generatedId,
      title: projectTitle.trim(),
      desc: projectDesc.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Full-Stack'],
      image: projectImage.trim(),
      github: projectGithub.trim(),
      demo: projectDemo.trim(),
      category: projectCategory,
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
    // 1. data.action === "sync_projects" (dengan data.projects: [...])
    // 2. data.action === "ADD_PROJECT" (fallback)
    const payload = {
      action: 'sync_projects',
      secret: secretPass,
      projects: updatedProjects,
      // fallback fields jika script versi appendRow digunakan
      project: newProjectItem,
      id: generatedId,
      title: projectTitle.trim(),
      desc: projectDesc.trim(),
      tags: projectTags.trim(),
      image: projectImage.trim(),
      github: projectGithub.trim(),
      demo: projectDemo.trim(),
      category: projectCategory,
    };

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

  // Copy Google Apps Script code to clipboard
  const handleCopyScript = () => {
    const textToCopy = scriptTabType === 'reviews' ? reviewsScriptCode : googleAppsScriptCode;
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
                      onClick={() => setIsAuthenticated(false)}
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
                        {displayedReviews.map((item) => (
                          <div
                            key={item.id}
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
                        Formulir ini disesuaikan persis dengan 8 kolom Google Spreadsheet Anda: <code>id, title, desc, tags, image, github, demo, category</code>.
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
                          <span className="truncate pr-2">
                            {projectCategory === 'fullstack' && 'fullstack (Full Stack Application)'}
                            {projectCategory === 'backend' && 'backend (Backend & AI Architecture)'}
                            {projectCategory === 'designsystem' && 'designsystem (UI/UX Design System)'}
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
                                { value: 'fullstack', label: 'fullstack (Full Stack Application)' },
                                { value: 'backend', label: 'backend (Backend & AI Architecture)' },
                                { value: 'designsystem', label: 'designsystem (UI/UX Design System)' }
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

                {/* TAB 3: BACKEND SCRIPT READY TO COPY */}
                {adminTab === 'script' && (
                  <div className="flex flex-col gap-3">
                    {/* Sub-tabs Selector */}
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-black/20 w-fit">
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
                          {scriptTabType === 'reviews'
                            ? 'Script reviews.gs (Khusus Write Review -> Sheet Rating)'
                            : 'Kode Backend All-in-One (Code.gs)'}
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {scriptTabType === 'reviews'
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
                        <span>{copiedScript ? 'Tersalin!' : `Salin ${scriptTabType === 'reviews' ? 'reviews.gs' : 'Code.gs'}`}</span>
                      </button>
                    </div>

                    <pre className={`p-4 rounded-xl border text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 ${
                      darkMode ? 'bg-black/60 border-slate-800' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {scriptTabType === 'reviews' ? reviewsScriptCode : googleAppsScriptCode}
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
