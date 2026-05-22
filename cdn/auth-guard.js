/**
 * auth-guard.js — Modweeb Design
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * سكريبت الحماية المستقل — يُحمَّل عبر jsDelivr CDN
 * يحتوي على CSS + HTML + منطق الحماية في ملف واحد
 *
 * الاستخدام في بلوجر:
 * ──────────────────
 * <script>
 *   window.MODWEEB_AUTH = {
 *     title   : "مولد المقالات",          // عنوان الصفحة
 *     desc    : "هذه الأداة للأعضاء فقط", // وصف قصير
 *     logo    : "https://...",            // رابط الشعار
 *     siteName: "تصميم مودويب",
 *     loginUrl: "/p/login.html",
 *     homeUrl : "/",
 *     termsUrl: "/p/terms.html",
 *     privacyUrl: "/p/privacy-policy.html"
 *   };
 * </script>
 * <script src="https://cdn.jsdelivr.net/gh/zerootem/modweeb-blogger-pages@main/cdn/auth-guard.js"></script>
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
(function () {
  "use strict";

  /* ── الإعدادات الافتراضية + تخصيص المستخدم ── */
  var C = Object.assign({
    title      : "محتوى مقيّد",
    desc       : "هذه الصفحة متاحة للأعضاء المسجلين فقط.<br>سجّل دخولك للوصول إليها.",
    logo       : "https://blogger.googleusercontent.com/img/a/AVvXsEjlFuMZRXWUpxZK7ZWolRDFXmZuTNvT2uMzetcU_d2gXpLqZ_3B1-vl18e31nhKyo0C_6SOVsxszrL_FxtJ4YCma9QwhNB0BLiTcBNdqYTAuXStazw9Tds6ylCz0IpSEGZ2MnjCSXIfMtYxcnOV8H3sKC5szT2c3FCYDG_DvVIFtTvsgrzRWGO4kFURiO4=s1600",
    siteName   : "تصميم مودويب",
    loginUrl   : "/p/login.html",
    homeUrl    : "/",
    termsUrl   : "/p/terms.html",
    privacyUrl : "/p/privacy-policy.html"
  }, window.MODWEEB_AUTH || {});

  /* ── حقن CSS ── */
  var css = [
    "html,body{margin:0!important;padding:0!important;}",
    "#mw-auth-gate{",
      "position:fixed;inset:0;background:var(--bodyB,#f8fafc);",
      "z-index:999999;display:none;flex-direction:column;",
      "min-height:100vh;height:100vh;overflow-y:auto;font-family:inherit;",
    "}",
    "#mw-auth-gate .ag-hdr{",
      "background:var(--contentB,#fff);border-bottom:1px solid var(--contentL,#e3e7ef);",
      "position:sticky;top:0;z-index:50;backdrop-filter:blur(8px);",
    "}",
    "#mw-auth-gate .ag-hdr-in{",
      "display:flex;align-items:center;justify-content:space-between;",
      "gap:1rem;padding:.5rem 1.25rem;max-width:1024px;margin:0 auto;",
    "}",
    "#mw-auth-gate .ag-logo{",
      "display:flex;align-items:center;gap:.6rem;text-decoration:none;",
      "color:var(--headC,#111);font-size:16px;font-weight:500;",
    "}",
    "#mw-auth-gate .ag-logo img{width:32px;height:32px;border-radius:6px;object-fit:cover;}",
    "#mw-auth-gate .ag-body{",
      "display:flex;justify-content:center;align-items:flex-start;",
      "width:100%;padding:2rem 1rem;flex:1;",
    "}",
    "#mw-auth-gate .ag-card{",
      "background:var(--contentB,#fff);border-radius:20px;",
      "border:1px solid var(--contentL,#e3e7ef);overflow:hidden;",
      "max-width:380px;width:100%;margin:0 auto;",
      "box-shadow:0 1px 3px rgba(0,0,0,.08);",
    "}",
    "#mw-auth-gate .ag-card-body{padding:24px 20px 16px;text-align:center;}",
    "#mw-auth-gate .ag-icon{",
      "width:52px;height:52px;background:rgba(37,99,235,.08);border-radius:50%;",
      "display:flex;align-items:center;justify-content:center;margin:0 auto 14px;",
    "}",
    "#mw-auth-gate .ag-title{font-size:16px;font-weight:600;color:var(--headC,#111);margin-bottom:6px;}",
    "#mw-auth-gate .ag-desc{font-size:13px;color:var(--bodyC,#555);line-height:1.6;}",
    "#mw-auth-gate .ag-card-foot{",
      "border-top:1px solid var(--contentL,#e3e7ef);padding:14px 18px;",
      "display:flex;flex-direction:column;gap:8px;",
    "}",
    "#mw-auth-gate .ag-btn{",
      "display:inline-flex;align-items:center;justify-content:center;gap:6px;",
      "width:100%;padding:9px 16px;border-radius:12px;font-size:13px;",
      "font-weight:500;cursor:pointer;text-decoration:none;",
      "border:none;transition:all .2s;",
    "}",
    "#mw-auth-gate .ag-btn-p{background:var(--linkC,#2563eb);color:#fff;}",
    "#mw-auth-gate .ag-btn-p:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,.3);}",
    "#mw-auth-gate .ag-btn-o{background:0 0;border:1px solid var(--contentL,#e3e7ef);color:var(--bodyC,#555);}",
    "#mw-auth-gate .ag-btn-o:hover{background:var(--bodyB,#f8fafc);}",
    "#mw-auth-gate .ag-foot{border-top:1px solid var(--contentL,#e3e7ef);padding:1rem 1.25rem;margin-top:auto;}",
    "#mw-auth-gate .ag-foot-in{display:flex;align-items:center;gap:10px;max-width:1024px;margin:0 auto;flex-wrap:wrap;}",
    "#mw-auth-gate .ag-foot a{font-size:12px;color:var(--bodyC,#888);text-decoration:none;}",
    "#mw-auth-gate .ag-foot a:hover{color:var(--headC,#111);}",
    "#mw-auth-gate .ag-progress-wrap{height:4px;background:var(--contentL,#e3e7ef);border-radius:99px;overflow:hidden;margin-top:18px;}",
    "#mw-auth-gate .ag-progress-bar{height:100%;width:0%;background:var(--linkC,#2563eb);border-radius:99px;transition:width 1.8s ease;}",
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── حقن HTML ── */
  var LOCK_ICON = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--linkC,#2563eb)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
  var LOGIN_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>';
  var HOME_ICON  = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';

  var gate = document.createElement("div");
  gate.id = "mw-auth-gate";
  gate.innerHTML = [
    '<header class="ag-hdr">',
      '<div class="ag-hdr-in">',
        '<a href="' + C.homeUrl + '" class="ag-logo">',
          '<img src="' + C.logo + '" alt="' + C.siteName + '">',
          '<span>' + C.siteName + '</span>',
        '</a>',
      '</div>',
    '</header>',
    '<div class="ag-body">',
      '<div class="ag-card" id="mw-ag-card">',
        '<div class="ag-card-body">',
          '<div class="ag-icon">' + LOCK_ICON + '</div>',
          '<div class="ag-title">' + C.title + '</div>',
          '<div class="ag-desc">' + C.desc + '</div>',
        '</div>',
        '<div class="ag-card-foot">',
          '<button class="ag-btn ag-btn-p" id="mw-login-btn">' + LOGIN_ICON + ' تسجيل الدخول للمتابعة</button>',
          '<a href="' + C.homeUrl + '" class="ag-btn ag-btn-o">' + HOME_ICON + ' العودة للرئيسية</a>',
        '</div>',
      '</div>',
    '</div>',
    '<footer class="ag-foot">',
      '<div class="ag-foot-in">',
        '<a href="' + C.homeUrl + '" style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--headC,#111);">',
          '<img src="' + C.logo + '" width="22" height="22" style="border-radius:4px;" alt="">',
          C.siteName,
        '</a>',
        '<a href="' + C.privacyUrl + '">خصوصية</a>',
        '<a href="' + C.termsUrl + '">شروط</a>',
      '</div>',
    '</footer>',
  ].join("");
  document.body.appendChild(gate);

  /* ── منطق الحماية وإعادة التوجيه ── */
  var TARGET = window.location.href;

  function showWelcome(name) {
    var dest = sessionStorage.getItem("mw_redirect") || TARGET;
    sessionStorage.removeItem("mw_redirect");
    var card = document.getElementById("mw-ag-card");
    if (card) {
      var CHECK = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--linkC,#2563eb)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      card.innerHTML = [
        '<div class="ag-card-body" style="padding:32px 20px;">',
          '<div class="ag-icon">' + CHECK + '</div>',
          '<div class="ag-title">أهلاً بك' + (name ? "، " + name : "") + '!</div>',
          '<div class="ag-desc">جارٍ تحميل الصفحة...</div>',
          '<div class="ag-progress-wrap"><div class="ag-progress-bar" id="mw-pbar"></div></div>',
        '</div>'
      ].join("");
      setTimeout(function () {
        var b = document.getElementById("mw-pbar");
        if (b) b.style.width = "100%";
      }, 50);
    }
    setTimeout(function () { window.location.href = dest; }, 2000);
  }

  /* تعريف showLoginPopup محلياً إن لم تكن موجودة في القالب */
  if (typeof window.showLoginPopup !== "function") {
    window.showLoginPopup = function () {
      sessionStorage.setItem("mw_redirect", TARGET);
      window.open(
        C.loginUrl + "?cbu=" + encodeURIComponent(TARGET),
        "mwLoginPopup",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );
    };
  } else {
    var _orig = window.showLoginPopup;
    window.showLoginPopup = function () {
      sessionStorage.setItem("mw_redirect", TARGET);
      _orig();
    };
  }

  document.getElementById("mw-login-btn").addEventListener("click", function () {
    window.showLoginPopup();
  });

  /* ── التحقق من تسجيل الدخول ── */
  if (localStorage.getItem("userLoggedIn") !== "true") {
    gate.style.display = "flex";
    /* إخفاء باقي محتوى الصفحة */
    Array.prototype.forEach.call(
      document.querySelectorAll("body > *:not(#mw-auth-gate):not(script):not(style):not(link)"),
      function (el) { el.style.setProperty("display", "none", "important"); }
    );
    /* استقبال loginSuccess من النافذة المنبثقة */
    window.addEventListener("message", function (e) {
      if (e.data && e.data.type === "loginSuccess" && e.data.user) {
        var u = e.data.user;
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userName",    u.name  || "");
        localStorage.setItem("userEmail",   u.email || "");
        localStorage.setItem("userPicture", u.image || "");
        if (!localStorage.getItem("userJoinDate")) {
          localStorage.setItem("userJoinDate", new Date().toISOString());
        }
        showWelcome(u.name);
      }
    });
    /* تسجيل دخول من تبويب آخر */
    window.addEventListener("storage", function (e) {
      if (e.key === "userLoggedIn" && e.newValue === "true") {
        showWelcome(localStorage.getItem("userName"));
      }
    });
  } else {
    gate.style.display = "none";
    sessionStorage.removeItem("mw_redirect");
  }

})();
