/**
 * login-page.js — Modweeb Design
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * صفحة تسجيل الدخول المستقلة — CSS + HTML + منطق
 *
 * الاستخدام في بلوجر (صفحة /p/login.html):
 * ──────────────────────────────────────────
 * <script src="https://cdn.jsdelivr.net/gh/zerootem/modweeb-blogger-pages@main/cdn/login-page.js"></script>
 * <script src="https://accounts.google.com/gsi/client" async defer onload="mwInitGSI()"></script>
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
(function () {
  "use strict";

  /* ── إعدادات ── */
  var GOOGLE_CLIENT_ID = "36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com";
  var LOGO_URL  = "https://blogger.googleusercontent.com/img/a/AVvXsEjlFuMZRXWUpxZK7ZWolRDFXmZuTNvT2uMzetcU_d2gXpLqZ_3B1-vl18e31nhKyo0C_6SOVsxszrL_FxtJ4YCma9QwhNB0BLiTcBNdqYTAuXStazw9Tds6ylCz0IpSEGZ2MnjCSXIfMtYxcnOV8H3sKC5szT2c3FCYDG_DvVIFtTvsgrzRWGO4kFURiO4=s1600";
  var SITE_NAME = "Modweeb Design";
  var TERMS_URL   = "/p/terms.html";
  var PRIVACY_URL = "/p/privacy-policy.html";

  /* ── CSS ── */
  var css = [
    "html,body{overflow:hidden!important;margin:0;padding:0;}",
    ".mw-login-page{position:fixed;inset:0;background:var(--bodyB,#f8fafc);z-index:9999;",
      "display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:hidden;}",
    ".mw-login-wrap{display:flex;flex-direction:column;align-items:center;gap:20px;",
      "width:100%;max-width:330px;padding:0 16px;transform:translateY(-40px);}",
    ".mw-login-logo{display:flex;align-items:center;gap:10px;color:var(--headC,#111);",
      "font-size:17px;font-weight:500;text-decoration:none;}",
    ".mw-login-logo img{width:32px;height:32px;border-radius:6px;object-fit:cover;}",
    ".mw-login-card{background:var(--contentB,#fff);border-radius:20px;width:100%;",
      "box-shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);",
      "border:1px solid var(--contentL,#e3e7ef);}",
    ".mw-login-card-head{padding:16px 16px 0;text-align:center;}",
    ".mw-login-card-head b{display:block;font-size:17px;font-weight:700;color:var(--headC,#111);margin-bottom:4px;}",
    ".mw-login-card-head p{font-size:12px;color:var(--bodyC,#888);margin:0;}",
    ".mw-login-card-body{padding:14px 14px 14px;}",
    ".mw-google-btn{display:flex;align-items:center;justify-content:center;gap:8px;",
      "width:100%;padding:10px 16px;border-radius:15px;font-size:13px;font-weight:500;",
      "cursor:pointer;background:0 0;border:1px solid var(--contentL,#e3e7ef);",
      "color:var(--bodyC,#333);transition:.2s;}",
    ".mw-google-btn:hover{background:var(--bodyB,#f8fafc);}",
    ".mw-login-footer{font-size:11px;text-align:center;color:var(--bodyC,#888);}",
    ".mw-login-footer a{color:var(--linkC,#2563eb);text-decoration:underline;text-underline-offset:3px;}",
    ".mw-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);",
      "background:var(--notifB,#f1f5f9);color:var(--notifC,#555);padding:8px 16px;",
      "border-radius:14px;font-size:13px;opacity:0;transition:opacity .3s;z-index:9999999;",
      "pointer-events:none;white-space:nowrap;}",
    ".mw-toast.show{opacity:1;}",
    ".mw-welcome-card{padding:28px 20px;text-align:center;}",
    ".mw-welcome-icon{width:52px;height:52px;background:rgba(37,99,235,.08);border-radius:50%;",
      "display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}",
    ".mw-welcome-name{font-size:16px;font-weight:600;color:var(--headC,#111);margin-bottom:4px;}",
    ".mw-welcome-sub{font-size:12px;color:var(--bodyC,#888);margin-bottom:16px;}",
    ".mw-pbar-wrap{height:4px;background:var(--contentL,#e3e7ef);border-radius:99px;overflow:hidden;}",
    ".mw-pbar{height:100%;width:0%;background:var(--linkC,#2563eb);border-radius:99px;transition:width 2.8s ease;}",
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ── */
  var GOOGLE_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';

  var page = document.createElement("div");
  page.className = "mw-login-page";
  page.innerHTML = [
    '<div class="mw-login-wrap">',
      '<a href="/" class="mw-login-logo">',
        '<img src="' + LOGO_URL + '" alt="' + SITE_NAME + '">',
        '<span>' + SITE_NAME + '</span>',
      '</a>',
      '<div class="mw-login-card" id="mw-login-card">',
        '<div class="mw-login-card-head">',
          '<b>مرحباً بعودتك</b>',
          '<p>تسجيل الدخول باستخدام حسابك الاجتماعي</p>',
        '</div>',
        '<div class="mw-login-card-body">',
          '<button class="mw-google-btn" id="mw-google-btn">',
            GOOGLE_SVG,
            '<span>تسجيل الدخول باستخدام Google</span>',
          '</button>',
        '</div>',
      '</div>',
      '<div class="mw-login-footer">',
        'بالنقر على متابعة، فإنك توافق على<br>',
        '<a href="' + TERMS_URL + '">شروط الخدمة</a> و',
        '<a href="' + PRIVACY_URL + '">سياسة الخصوصية</a>',
      '</div>',
    '</div>',
    '<div class="mw-toast" id="mw-toast"></div>',
  ].join("");
  document.body.appendChild(page);

  /* ── دوال مساعدة ── */
  function notify(msg) {
    /* إرسال إشعار للنافذة الأم إن وُجدت */
    if (window.opener && window.opener.PU && typeof window.opener.PU.tNtf === "function") {
      window.opener.PU.tNtf(msg);
      return;
    }
    var t = document.getElementById("mw-toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 3000);
  }

  function showWelcome(name, redirectTo) {
    var card = document.getElementById("mw-login-card");
    if (!card) return;
    var CHECK = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--linkC,#2563eb)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    card.innerHTML = [
      '<div class="mw-welcome-card">',
        '<div class="mw-welcome-icon">' + CHECK + '</div>',
        '<div class="mw-welcome-name">أهلاً بك، ' + name + '!</div>',
        '<div class="mw-welcome-sub">جارٍ إعادة التوجيه<span id="mw-count"> (3)</span></div>',
        '<div class="mw-pbar-wrap"><div class="mw-pbar" id="mw-pbar"></div></div>',
      '</div>',
    ].join("");
    /* شريط التقدم */
    setTimeout(function () {
      var b = document.getElementById("mw-pbar");
      if (b) b.style.width = "100%";
    }, 50);
    /* عداد تنازلي */
    var cnt = 3;
    var timer = setInterval(function () {
      cnt--;
      var el = document.getElementById("mw-count");
      if (el) el.textContent = " (" + cnt + ")";
      if (cnt <= 0) clearInterval(timer);
    }, 1000);
    setTimeout(function () { window.location.href = redirectTo; }, 3000);
  }

  /* ── جلب بيانات المستخدم بعد OAuth ── */
  async function fetchUser(token) {
    try {
      notify("جارٍ تسجيل الدخول...");
      var res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      var u = await res.json();

      var payload = { type: "loginSuccess", user: { name: u.name, email: u.email, image: u.picture } };

      if (window.opener) {
        /* نافذة منبثقة */
        var origin = window.location.origin.includes("blogspot")
          ? "https://modweeb.com"
          : window.location.origin;
        window.opener.postMessage(payload, origin);
        notify("تم تسجيل الدخول! جارٍ الإغلاق...");
        setTimeout(function () { window.close(); }, 1200);
      } else {
        /* فتح مباشر */
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userName",    u.name);
        localStorage.setItem("userEmail",   u.email);
        localStorage.setItem("userPicture", u.picture);
        if (!localStorage.getItem("userJoinDate")) {
          localStorage.setItem("userJoinDate", new Date().toISOString());
        }
        var dest = new URLSearchParams(window.location.search).get("cbu") || "/";
        showWelcome(u.name, dest);
      }
    } catch (e) {
      notify("فشل تسجيل الدخول. حاول مرة أخرى.");
    }
  }

  /* ── تهيئة Google OAuth ── */
  var gsiClient;
  window.mwInitGSI = function () {
    if (typeof google === "undefined" || !google.accounts) {
      notify("فشل تحميل مكتبة Google.");
      return;
    }
    gsiClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid profile email",
      callback: function (resp) {
        if (resp && resp.access_token) {
          fetchUser(resp.access_token);
        } else {
          notify("لم يُعثر على رمز الوصول. حاول مرة أخرى.");
        }
      }
    });
    document.getElementById("mw-google-btn").addEventListener("click", function () {
      gsiClient.requestAccessToken();
    });
  };

})();
