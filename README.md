# Modweeb Auth — نظام المصادقة المتكامل

> **Angular 17 + Tailwind CSS + Angular Material**
> يُستضاف على GitHub Pages ويتكامل مع بلوجر عبر postMessage

---

## ⚡ كيف يعمل النظام

```
المستخدم يزور مدونة بلوجر
        ↓
auth-guard.js يتحقق من localStorage
        ↓ (غير مسجل)
يفتح تطبيق Angular كنافذة منبثقة
   zerootem.github.io/modweeb-blogger-pages/#/login
        ↓
المستخدم يسجل بـ Google OAuth
        ↓
Angular يرسل postMessage → بلوجر
        ↓
بلوجر يخزن البيانات ويعرض المحتوى ✅
```

---

## 📁 هيكل المشروع

```
modweeb-blogger-pages/
│
├── .github/workflows/
│   └── deploy.yml              ← Auto-deploy إلى GitHub Pages
│
├── angular-app/                ← مشروع Angular الكامل
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── auth.service.ts     ← خدمة المصادقة
│   │   │   ├── pages/
│   │   │   │   ├── login/              ← صفحة تسجيل الدخول
│   │   │   │   └── account/           ← صفحة إدارة الحساب
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── styles.scss               ← Tailwind + Angular Material
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── cdn/                        ← ملفات الحماية (CDN للبلوجر)
│   ├── auth-guard.js           ← يحمي صفحات البلوجر
│   ├── login-page.js           ← بديل بسيط بدون Angular
│   └── account-page.js        ← بديل بسيط بدون Angular
│
└── blogger-snippets/           ← أكواد صغيرة تُضاف في بلوجر
    ├── login-snippet.html      ← يوجّه إلى Angular login
    ├── account-snippet.html    ← يوجّه إلى Angular account
    └── article-generator-snippet.html ← يستخدم auth-guard CDN
```

---

## 🚀 خطوات النشر

### 1. تفعيل GitHub Pages

في مستودعك:
**Settings ← Pages ← Source: GitHub Actions**

### 2. رفع الملفات على GitHub

بعد الرفع، GitHub Actions سيبني التطبيق تلقائياً وينشره على:
```
https://zerootem.github.io/modweeb-blogger-pages/
```

### 3. إنشاء صفحات بلوجر

| الصفحة | الرابط | الكود المستخدم |
|--------|--------|---------------|
| تسجيل الدخول | `/p/login.html` | `blogger-snippets/login-snippet.html` |
| إدارة الحساب | `/p/account.html` | `blogger-snippets/account-snippet.html` |
| مولد المقالات | `/p/article-generator.html` | `blogger-snippets/article-generator-snippet.html` |

في كل صفحة:
1. **بلوجر ← الصفحات ← صفحة جديدة**
2. اضغط **HTML** (وليس Compose)
3. الصق محتوى الملف المناسب
4. انشر

---

## 📋 ما تضيفه في بلوجر (فقط)

### صفحة `/p/login.html`
```html
<script>
(function(){
  var returnUrl = new URLSearchParams(window.location.search).get('cbu') || window.location.href;
  var origin = encodeURIComponent(window.location.origin);
  window.location.replace(
    'https://zerootem.github.io/modweeb-blogger-pages/#/login'
    + '?return=' + encodeURIComponent(returnUrl)
    + '&origin=' + origin
  );
})();
</script>
```

### صفحة `/p/account.html`
```html
<script>
  window.location.replace('https://zerootem.github.io/modweeb-blogger-pages/#/account');
</script>
```

### صفحة مولد المقالات
```html
<script>
window.MODWEEB_AUTH = {
  title: "مولد مقالات بلوجر",
  desc: "هذه الأداة للأعضاء المسجلين فقط.",
  loginUrl: "/p/login.html",
  homeUrl: "/"
};
</script>
<script src="https://cdn.jsdelivr.net/gh/zerootem/modweeb-blogger-pages@main/cdn/auth-guard.js"></script>
[كود الأداة هنا]
```

---

## 🔄 تطوير محلي

```bash
cd angular-app
npm install
npm start
# الموقع على http://localhost:4200
```

---

## 🔗 روابط بعد النشر

| الصفحة | الرابط |
|--------|--------|
| تسجيل الدخول | `https://zerootem.github.io/modweeb-blogger-pages/#/login` |
| إدارة الحساب | `https://zerootem.github.io/modweeb-blogger-pages/#/account` |

---

## ⚙️ Stack التقني

| التقنية | الاستخدام |
|---------|-----------|
| Angular 17 | إطار العمل (Standalone Components) |
| Angular Material | مكونات UI (أزرار، قوائم، إشعارات) |
| Tailwind CSS 3 | التخطيط والأنماط |
| Angular Signals | إدارة الحالة التفاعلية |
| Google GSI | تسجيل الدخول بـ Google OAuth |
| GitHub Pages | الاستضافة المجانية |
| jsDelivr CDN | توزيع ملفات الحماية |

---

*تصميم مودويب — modweeb.com*
