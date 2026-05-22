import {
  Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../core/auth.service';

declare const google: {
  accounts: {
    oauth2: {
      initTokenClient(cfg: {
        client_id: string;
        scope: string;
        callback: (resp: { access_token?: string }) => void;
      }): { requestAccessToken(): void };
    };
    id: {
      initialize(cfg: object): void;
      prompt(cb?: (n: { isDisplayMoment(): boolean }) => void): void;
      cancel(): void;
    };
  };
};

@Component({
  selector: 'mw-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressBarModule, MatRippleModule, NgIf, NgClass],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div class="w-full max-w-sm animate-slide-up">

        <!-- شعار الموقع -->
        <a href="https://modweeb.com" class="flex items-center justify-center gap-2.5 mb-6 no-underline">
          <img [src]="LOGO" alt="تصميم مودويب"
               class="w-9 h-9 rounded-xl object-cover shadow-sm">
          <span class="text-slate-800 font-bold text-lg">تصميم مودويب</span>
        </a>

        <!-- بطاقة تسجيل الدخول / الترحيب -->
        <div class="mw-card">

          <!-- حالة: جاري التسجيل / ترحيب -->
          <div *ngIf="state() !== 'idle'" class="p-7 text-center">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                 [ngClass]="state() === 'success'
                   ? 'bg-primary-50 text-primary-600'
                   : 'bg-slate-100 text-slate-500'">
              <span class="material-icons-round text-3xl">
                {{ state() === 'success' ? 'check_circle' : 'sync' }}
              </span>
            </div>
            <p class="font-bold text-slate-800 text-base mb-1">
              {{ state() === 'success' ? ('أهلاً بك، ' + userName() + '!') : 'جارٍ تسجيل الدخول...' }}
            </p>
            <p class="text-slate-500 text-xs mb-5" *ngIf="state() === 'success'">
              {{ isPopup ? 'سيتم إغلاق هذه النافذة تلقائياً...' : 'جارٍ التحويل...' }}
            </p>
            <div class="mw-progress-track" *ngIf="state() === 'success'">
              <div class="mw-progress-bar" [style.width.%]="progressWidth()"></div>
            </div>
          </div>

          <!-- حالة: idle -->
          <ng-container *ngIf="state() === 'idle'">
            <div class="px-5 pt-5 pb-4 text-center border-b border-slate-100">
              <div class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                <span class="material-icons-round text-primary-600 text-2xl">lock_person</span>
              </div>
              <h1 class="font-bold text-slate-800 text-base mb-1">مرحباً بعودتك</h1>
              <p class="text-slate-500 text-xs leading-relaxed">
                سجّل دخولك باستخدام حسابك الاجتماعي<br>للوصول إلى محتوى الأعضاء
              </p>
            </div>

            <div class="p-4 flex flex-col gap-2.5">
              <!-- زر Google -->
              <button class="mw-btn-outline" matRipple (click)="loginWithGoogle()" [disabled]="loading()">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{{ loading() ? 'جارٍ الاتصال...' : 'المتابعة بحساب Google' }}</span>
              </button>

              <div class="flex items-center gap-2 my-1">
                <div class="flex-1 h-px bg-slate-100"></div>
                <span class="text-xs text-slate-400">أو</span>
                <div class="flex-1 h-px bg-slate-100"></div>
              </div>

              <a href="https://modweeb.com" class="mw-btn-outline no-underline text-sm">
                <span class="material-icons-round text-base text-slate-400">home</span>
                العودة للرئيسية
              </a>
            </div>

            <div class="px-5 pb-4 text-center">
              <p class="text-xs text-slate-400 leading-relaxed">
                بالمتابعة توافق على
                <a href="https://modweeb.com/p/terms.html" class="text-primary-600 underline-offset-2">شروط الخدمة</a>
                و
                <a href="https://modweeb.com/p/privacy-policy.html" class="text-primary-600 underline-offset-2">سياسة الخصوصية</a>
              </p>
            </div>
          </ng-container>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-slate-400 mt-5">
          © {{ year }} تصميم مودويب — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  readonly LOGO = 'https://blogger.googleusercontent.com/img/a/AVvXsEjlFuMZRXWUpxZK7ZWolRDFXmZuTNvT2uMzetcU_d2gXpLqZ_3B1-vl18e31nhKyo0C_6SOVsxszrL_FxtJ4YCma9QwhNB0BLiTcBNdqYTAuXStazw9Tds6ylCz0IpSEGZ2MnjCSXIfMtYxcnOV8H3sKC5szT2c3FCYDG_DvVIFtTvsgrzRWGO4kFURiO4=s1600';
  readonly GOOGLE_CLIENT_ID = '36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com';
  readonly year = new Date().getFullYear();

  state        = signal<'idle' | 'loading' | 'success'>('idle');
  loading      = signal(false);
  progressWidth = signal(0);
  userName     = signal('');

  isPopup  = !!window.opener;
  returnUrl = 'https://modweeb.com';
  bloggerOrigin = 'https://modweeb.com';

  private gsiClient?: ReturnType<typeof google.accounts.oauth2.initTokenClient>;
  private redirectTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.returnUrl     = params.get('return') ?? params.get('cbu') ?? 'https://modweeb.com';
    this.bloggerOrigin = params.get('origin') ?? this.extractOrigin(this.returnUrl);

    // إذا كان مسجلاً بالفعل → انتقل مباشرة
    if (this.auth.isLoggedIn()) {
      this.handleSuccess(this.auth.user()!.name, this.auth.user()!);
      return;
    }

    this.waitForGSI();
  }

  ngOnDestroy(): void {
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
  }

  loginWithGoogle(): void {
    if (!this.gsiClient) {
      this.notify('مكتبة Google لم تُحمَّل بعد. أعد المحاولة.');
      return;
    }
    this.loading.set(true);
    this.gsiClient.requestAccessToken();
  }

  /* ── Private ── */

  private waitForGSI(tries = 0): void {
    if (typeof google !== 'undefined' && google.accounts?.oauth2) {
      this.initGSI();
    } else if (tries < 20) {
      setTimeout(() => this.waitForGSI(tries + 1), 300);
    } else {
      this.notify('تعذّر تحميل مكتبة Google. تحقق من الاتصال.');
    }
  }

  private initGSI(): void {
    this.gsiClient = google.accounts.oauth2.initTokenClient({
      client_id: this.GOOGLE_CLIENT_ID,
      scope: 'openid profile email',
      callback: (resp) => {
        if (resp.access_token) {
          this.fetchUserInfo(resp.access_token);
        } else {
          this.loading.set(false);
          this.notify('تم إلغاء تسجيل الدخول.');
        }
      },
    });
  }

  private async fetchUserInfo(token: string): Promise<void> {
    try {
      const res  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const u = await res.json() as { name: string; email: string; picture: string };

      this.auth.login({ name: u.name, email: u.email, picture: u.picture });
      this.handleSuccess(u.name, this.auth.user()!);
    } catch {
      this.loading.set(false);
      this.notify('فشل الاتصال بـ Google. حاول مرة أخرى.');
    }
  }

  private handleSuccess(name: string, user: import('../../core/auth.service').AuthUser): void {
    this.userName.set(name);
    this.state.set('success');
    this.loading.set(false);

    // إرسال للنافذة الأم (بلوجر)
    if (window.opener) {
      this.auth.notifyOpener(user, this.bloggerOrigin);
    }

    // شريط التقدم
    setTimeout(() => this.progressWidth.set(100), 50);

    // إعادة التوجيه
    this.redirectTimer = setTimeout(() => {
      if (window.opener) {
        window.close();
      } else {
        window.location.href = this.returnUrl;
      }
    }, 2800);
  }

  private extractOrigin(url: string): string {
    try { return new URL(url).origin; }
    catch { return 'https://modweeb.com'; }
  }

  private notify(msg: string): void {
    this.snack.open(msg, '', { duration: 3500, horizontalPosition: 'center' });
  }
}
