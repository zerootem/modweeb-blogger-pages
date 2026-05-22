/**
 * account-page.js — Modweeb Design
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * صفحة إدارة الحساب المستقلة — CSS + HTML + منطق
 *
 * الاستخدام في بلوجر (صفحة /p/account.html):
 * ────────────────────────────────────────────
 * <script src="https://cdn.jsdelivr.net/gh/zerootem/modweeb-blogger-pages@main/cdn/account-page.js"></script>
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
(function () {
  "use strict";

  var LOGO_URL    = "https://blogger.googleusercontent.com/img/a/AVvXsEjlFuMZRXWUpxZK7ZWolRDFXmZuTNvT2uMzetcU_d2gXpLqZ_3B1-vl18e31nhKyo0C_6SOVsxszrL_FxtJ4YCma9QwhNB0BLiTcBNdqYTAuXStazw9Tds6ylCz0IpSEGZ2MnjCSXIfMtYxcnOV8H3sKC5szT2c3FCYDG_DvVIFtTvsgrzRWGO4kFURiO4=s1600";
  var SITE_NAME   = "تصميم مودويب";
  var HOME_URL    = "/";
  var PRIVACY_URL = "/p/privacy-policy.html";
  var TERMS_URL   = "/p/terms.html";

  /* ── CSS ── */
  var css = [
    "html,body{margin:0;padding:0;overflow:hidden;}",
    "body{color:var(--bodyC,#333);background:var(--bodyB,#f8fafc);}",
    ".mw-acc-page{position:fixed;inset:0;background:var(--bodyB,#f8fafc);z-index:9999;",
      "display:flex;flex-direction:column;min-height:100vh;height:100vh;overflow-y:auto;}",
    /* header */
    ".mw-acc-hdr{background:var(--contentB,#fff);border-bottom:1px solid var(--contentL,#e3e7ef);",
      "position:sticky;top:0;z-index:50;backdrop-filter:blur(8px);}",
    ".mw-acc-hdr-in{display:flex;align-items:center;justify-content:space-between;",
      "gap:1rem;padding:.5rem 1.25rem;max-width:1024px;margin:0 auto;position:relative;}",
    ".mw-acc-logo{display:flex;align-items:center;gap:8px;text-decoration:none;",
      "color:var(--headC,#111);font-size:16px;font-weight:500;}",
    ".mw-acc-logo img{width:32px;height:32px;border-radius:6px;object-fit:cover;}",
    ".mw-settings-btn{background:0 0;border:1px solid var(--contentL,#e3e7ef);color:var(--bodyC,#555);",
      "font-size:12px;cursor:pointer;padding:4px 10px;border-radius:8px;transition:.15s;",
      "display:flex;align-items:center;gap:5px;}",
    ".mw-settings-btn:hover{background:var(--bodyB,#f8fafc);}",
    /* settings panel */
    ".mw-settings-panel{display:none;position:absolute;top:100%;left:12px;right:auto;margin-top:8px;",
      "background:var(--bodyB,#f8fafc);border-radius:12px;padding:12px;",
      "border:1px solid var(--contentL,#e3e7ef);box-shadow:0 4px 12px rgba(0,0,0,.1);",
      "width:260px;z-index:10000;text-align:right;}",
    ".mw-settings-panel.open{display:block;animation:mwFadeIn .2s ease;}",
    "@keyframes mwFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}",
    ".mw-inp{border:1px solid var(--contentL,#e3e7ef);border-radius:6px;padding:5px 8px;",
      "font-size:12px;width:100%;box-sizing:border-box;margin:4px 0 10px;",
      "background:var(--contentB,#fff);color:var(--bodyC,#333);}",
    ".mw-lbl{font-size:11px;color:var(--bodyC,#888);}",
    ".mw-save-btn{width:100%;padding:7px;border-radius:8px;background:var(--linkC,#2563eb);",
      "color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:500;margin-top:4px;}",
    ".mw-divider{border:none;border-top:1px solid var(--contentL,#e3e7ef);margin:10px 0;}",
    /* content */
    ".mw-acc-body{display:flex;justify-content:center;width:100%;padding:.9rem 1rem;flex:1;}",
    ".mw-acc-inner{width:100%;max-width:380px;}",
    /* card */
    ".mw-card{background:var(--contentB,#fff);border-radius:20px;border:1px solid var(--contentL,#e3e7ef);",
      "box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden;}",
    ".mw-card-content{padding:14px;}",
    ".mw-avatar-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}",
    ".mw-avatar{width:42px;height:42px;border-radius:50%;overflow:hidden;",
      "background:var(--contentBa,#f4f8ff);border:1px solid var(--contentL,#e3e7ef);",
      "display:flex;align-items:center;justify-content:center;flex-shrink:0;}",
    ".mw-avatar img{width:100%;height:100%;object-fit:cover;}",
    ".mw-avatar-init{font-size:18px;font-weight:700;color:var(--linkC,#2563eb);}",
    ".mw-user-name{font-size:16px;font-weight:600;color:var(--headC,#111);",
      "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    ".mw-user-email{font-size:12px;color:var(--bodyC,#888);",
      "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    ".mw-section-title{font-size:12px;font-weight:600;color:var(--headC,#111);margin:10px 0 6px;}",
    ".mw-info-row{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--bodyC,#888);margin-bottom:4px;}",
    ".mw-info-row svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.6;flex-shrink:0;}",
    /* sessions */
    ".mw-session{display:flex;align-items:center;justify-content:space-between;gap:8px;",
      "padding:10px;border:1px solid var(--contentL,#e3e7ef);border-radius:8px;",
      "background:var(--contentB,#fff);margin-bottom:6px;flex-wrap:wrap;}",
    ".mw-session-info{flex:1;min-width:0;}",
    ".mw-session-tag{font-size:10px;padding:2px 8px;border-radius:20px;",
      "background:rgba(37,99,235,.08);color:var(--linkC,#2563eb);white-space:nowrap;}",
    ".mw-remove-btn{font-size:11px;padding:3px 8px;border-radius:6px;background:0 0;",
      "border:1px solid #ef4444;color:#ef4444;cursor:pointer;white-space:nowrap;}",
    /* card footer */
    ".mw-card-foot{border-top:1px solid var(--contentL,#e3e7ef);padding:10px 14px;",
      "display:flex;justify-content:flex-end;}",
    ".mw-logout-btn{font-size:12px;padding:5px 12px;border-radius:8px;background:0 0;",
      "border:1px solid #ef4444;color:#ef4444;cursor:pointer;display:flex;align-items:center;gap:4px;}",
    /* alert card (not logged in) */
    ".mw-alert-card{background:var(--contentB,#fff);border-radius:20px;",
      "border:1px solid var(--contentL,#e3e7ef);overflow:hidden;}",
    ".mw-alert-body{padding:20px;text-align:right;}",
    ".mw-alert-title{font-size:15px;font-weight:500;color:var(--headC,#111);margin-bottom:5px;}",
    ".mw-alert-desc{font-size:13px;color:var(--bodyC,#888);}",
    ".mw-alert-foot{border-top:1px solid var(--contentL,#e3e7ef);padding:12px 16px;",
      "display:flex;gap:8px;}",
    ".mw-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;",
      "padding:7px 14px;border-radius:10px;font-size:12px;font-weight:500;",
      "cursor:pointer;text-decoration:none;border:none;transition:.2s;flex:1;}",
    ".mw-btn-p{background:var(--linkC,#2563eb);color:#fff;}",
    ".mw-btn-o{background:0 0;border:1px solid var(--contentL,#e3e7ef);color:var(--bodyC,#555);}",
    /* footer */
    ".mw-acc-foot{border-top:1px solid var(--contentL,#e3e7ef);padding:.75rem 1.25rem;margin-top:auto;}",
    ".mw-acc-foot-in{display:flex;align-items:center;gap:10px;max-width:1024px;margin:0 auto;}",
    ".mw-acc-foot a{font-size:12px;color:var(--bodyC,#888);text-decoration:none;}",
    ".mw-acc-foot a:hover{color:var(--headC,#111);}",
    /* toast */
    ".mw-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);",
      "background:var(--notifB,#f1f5f9);color:var(--notifC,#555);padding:8px 16px;",
      "border-radius:14px;font-size:13px;opacity:0;transition:opacity .3s;z-index:9999999;white-space:nowrap;}",
    ".mw-toast.show{opacity:1;}",
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── بناء الهيكل الرئيسي ── */
  var page = document.createElement("div");
  page.className = "mw-acc-page";
  page.innerHTML = [
    '<header class="mw-acc-hdr">',
      '<div class="mw-acc-hdr-in">',
        '<a href="' + HOME_URL + '" class="mw-acc-logo">',
          '<img src="' + LOGO_URL + '" alt="' + SITE_NAME + '">',
          '<span>' + SITE_NAME + '</span>',
        '</a>',
        '<button class="mw-settings-btn" id="mw-settings-btn">',
          'الإعدادات',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        '</button>',
        '<div class="mw-settings-panel" id="mw-settings-panel">',
          '<form id="mw-edit-form">',
            '<label class="mw-lbl">الاسم:<input type="text" id="mw-edit-name" class="mw-inp" maxlength="32" required></label>',
            '<hr class="mw-divider">',
            '<label class="mw-lbl">(رفع صورة)<input type="file" id="mw-edit-pic" accept="image/*" class="mw-inp" style="padding:0;"></label>',
            '<hr class="mw-divider">',
            '<label class="mw-lbl">(رابط الصورة)<input type="url" id="mw-edit-url" class="mw-inp" placeholder="https://example.com/photo.jpg"></label>',
            '<button type="submit" class="mw-save-btn">حفظ</button>',
          '</form>',
        '</div>',
      '</div>',
    '</header>',
    '<div class="mw-acc-body"><div class="mw-acc-inner" id="mw-acc-container"></div></div>',
    '<footer class="mw-acc-foot">',
      '<div class="mw-acc-foot-in">',
        '<a href="' + HOME_URL + '" style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--headC,#111);">',
          '<img src="' + LOGO_URL + '" width="22" height="22" style="border-radius:4px;" alt=""> ' + SITE_NAME,
        '</a>',
        '<a href="' + PRIVACY_URL + '">خصوصية</a>',
        '<a href="' + TERMS_URL + '">شروط</a>',
      '</div>',
    '</footer>',
    '<div class="mw-toast" id="mw-toast"></div>',
  ].join("");
  document.body.appendChild(page);

  /* ── دوال مساعدة ── */
  function notify(msg) {
    var t = document.getElementById("mw-toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 3000);
  }

  function getUserData() {
    return {
      isLoggedIn : localStorage.getItem("userLoggedIn") === "true",
      name       : localStorage.getItem("userName")    || "",
      email      : localStorage.getItem("userEmail")   || "",
      picture    : localStorage.getItem("userPicture") || "",
      joinDate   : localStorage.getItem("userJoinDate")|| ""
    };
  }

  function formatDate(d) {
    if (!d || d === "null" || d === "undefined") return "غير محدد";
    try {
      var dt = new Date(d);
      if (isNaN(dt)) return "غير محدد";
      return dt.toLocaleDateString("en-US", { day:"2-digit", month:"short", year:"numeric" });
    } catch(e) { return "غير محدد"; }
  }

  function getOS() {
    var ua = navigator.userAgent;
    if (ua.includes("Windows")) return "ويندوز";
    if (ua.includes("Android")) return "أندرويد";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "آيفون/آيباد";
    if (ua.includes("Mac")) return "ماك";
    if (ua.includes("Linux")) return "لينكس";
    return "غير معروف";
  }

  function getSessions() {
    try { var s = localStorage.getItem("userSessions"); return s ? JSON.parse(s) : []; }
    catch(e) { return []; }
  }

  function saveSessions(ss) { localStorage.setItem("userSessions", JSON.stringify(ss)); }

  window.mwRemoveSession = function(id) {
    var ss = getSessions().filter(function(s){ return s.id !== id; });
    saveSessions(ss);
    renderAccount();
    notify("تم إزالة الجلسة");
  };

  function addCurrentSession() {
    var cs = { id: Date.now(), time: new Date().toLocaleString("en-US"), os: getOS(), ip: "...", isCurrent: true };
    fetch("https://api.ipify.org?format=json")
      .then(function(r){ return r.json(); })
      .then(function(d){ cs.ip = d.ip; })
      .catch(function(){ cs.ip = "غير معروف"; })
      .finally(function(){
        var ss = getSessions().filter(function(s){ return !s.isCurrent; });
        ss.push(cs);
        saveSessions(ss);
        renderAccount();
      });
  }

  /* ── رندر بطاقة الحساب ── */
  function renderAccount() {
    var container = document.getElementById("mw-acc-container");
    if (!container) return;
    var u = getUserData();

    if (!u.isLoggedIn) {
      /* غير مسجل */
      container.innerHTML = [
        '<div class="mw-alert-card">',
          '<div class="mw-alert-body">',
            '<div class="mw-alert-title">إدارة الحساب</div>',
            '<div class="mw-alert-desc">يجب تسجيل الدخول لعرض بيانات حسابك.</div>',
          '</div>',
          '<div class="mw-alert-foot">',
            '<button class="mw-btn mw-btn-p" onclick="window.showLoginPopup&&showLoginPopup()">تسجيل الدخول</button>',
            '<a href="' + HOME_URL + '" class="mw-btn mw-btn-o">الرئيسية</a>',
          '</div>',
        '</div>',
      ].join("");
      return;
    }

    /* مسجل */
    var sessions = getSessions();
    if (!sessions.find(function(s){ return s.isCurrent; })) { addCurrentSession(); sessions = getSessions(); }

    var avatarHtml = (u.picture && u.picture !== "null")
      ? '<img id="mwAvatarImg" src="' + u.picture + '" alt="' + u.name + '">'
      : '<span class="mw-avatar-init">' + (u.name ? u.name[0].toUpperCase() : "?") + '</span>';

    var sessHtml = sessions.slice().sort(function(a,b){ return b.id - a.id; }).map(function(s) {
      return [
        '<div class="mw-session">',
          '<div class="mw-session-info">',
            '<div class="mw-info-row">',
              '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
              s.time,
            '</div>',
            '<div class="mw-info-row">',
              '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
              s.os + ' — ' + s.ip,
            '</div>',
          '</div>',
          s.isCurrent
            ? '<span class="mw-session-tag">الجلسة الحالية</span>'
            : '<button class="mw-remove-btn" onclick="mwRemoveSession(' + s.id + ')">إزالة</button>',
        '</div>',
      ].join("");
    }).join("");

    container.innerHTML = [
      '<div class="mw-card">',
        '<div class="mw-card-content">',
          '<div class="mw-avatar-row">',
            '<div class="mw-avatar">' + avatarHtml + '</div>',
            '<div style="overflow:hidden;">',
              '<div class="mw-user-name">' + u.name + '</div>',
              '<div class="mw-user-email">' + u.email + '</div>',
            '</div>',
          '</div>',
          '<hr class="mw-divider">',
          '<div class="mw-section-title">معلومات الحساب</div>',
          '<div class="mw-info-row">',
            '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
            'تاريخ الانضمام: ' + formatDate(u.joinDate),
          '</div>',
          '<hr class="mw-divider">',
          '<div class="mw-section-title">الجلسات النشطة</div>',
          sessHtml,
        '</div>',
        '<div class="mw-card-foot">',
          '<button class="mw-logout-btn" onclick="mwLogout()">',
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
            'تسجيل الخروج',
          '</button>',
        '</div>',
      '</div>',
    ].join("");

    /* تهيئة محرر الإعدادات */
    var nameInput = document.getElementById("mw-edit-name");
    if (nameInput) nameInput.value = u.name;
  }

  /* ── تسجيل الخروج ── */
  window.mwLogout = function() {
    ["userLoggedIn","userName","userEmail","userPicture","userJoinDate","userSessions"]
      .forEach(function(k){ localStorage.removeItem(k); });
    notify("تم تسجيل الخروج");
    setTimeout(function(){ renderAccount(); }, 400);
  };

  /* ── تهيئة لوحة الإعدادات ── */
  function initSettings() {
    var btn   = document.getElementById("mw-settings-btn");
    var panel = document.getElementById("mw-settings-panel");
    var form  = document.getElementById("mw-edit-form");
    var filePick = document.getElementById("mw-edit-pic");
    var urlPick  = document.getElementById("mw-edit-url");

    if (btn && panel) {
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        panel.classList.toggle("open");
      });
      document.addEventListener("click", function(e){
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
          panel.classList.remove("open");
        }
      });
    }

    if (filePick) {
      filePick.addEventListener("change", function(e){
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev){
          var img = document.getElementById("mwAvatarImg");
          if (img) img.src = ev.target.result;
          if (urlPick) urlPick.value = "";
        };
        reader.readAsDataURL(file);
      });
    }

    if (urlPick) {
      urlPick.addEventListener("input", function(e){
        var img = document.getElementById("mwAvatarImg");
        if (img) img.src = e.target.value;
        if (filePick) filePick.value = "";
      });
    }

    if (form) {
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var newName = document.getElementById("mw-edit-name").value.trim();
        var file    = filePick ? filePick.files[0] : null;
        var url     = urlPick  ? urlPick.value.trim() : "";

        function save(pic) {
          if (pic) localStorage.setItem("userPicture", pic);
          localStorage.setItem("userName", newName);
          renderAccount();
          notify("تم الحفظ بنجاح!");
          if (panel) panel.classList.remove("open");
        }

        if (file) {
          var reader = new FileReader();
          reader.onload = function(ev){ save(ev.target.result); };
          reader.readAsDataURL(file);
        } else {
          save(url || null);
        }
      });
    }
  }

  /* ── مستمعو الأحداث ── */
  window.addEventListener("message", function(e){
    if (e.data && e.data.type === "loginSuccess" && e.data.user) {
      var u = e.data.user;
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userName",    u.name  || "");
      localStorage.setItem("userEmail",   u.email || "");
      localStorage.setItem("userPicture", u.image || "");
      if (!localStorage.getItem("userJoinDate")) {
        localStorage.setItem("userJoinDate", new Date().toISOString());
      }
      addCurrentSession();
      renderAccount();
      notify("أهلاً بك، " + u.name + "!");
    }
  });
  window.addEventListener("storage", function(){ renderAccount(); });
  window.addEventListener("pageshow", function(e){ if (e.persisted) renderAccount(); });

  /* تسجيل خروج عبر URL */
  if (new URLSearchParams(window.location.search).has("logout")) {
    ["userLoggedIn","userName","userEmail","userPicture","userJoinDate","userSessions"]
      .forEach(function(k){ localStorage.removeItem(k); });
    history.replaceState(null, "", window.location.pathname);
  }

  /* ── تشغيل ── */
  document.addEventListener("DOMContentLoaded", function(){
    renderAccount();
    initSettings();
    setTimeout(function(){ addCurrentSession(); }, 500);
  });

})();
