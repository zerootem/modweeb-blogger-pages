import {
  Component, OnInit, signal, inject, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, Session } from '../../core/auth.service';

@Component({
  selector: 'mw-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf, NgFor, DatePipe, FormsModule, RouterLink,
    MatRippleModule, MatMenuModule, MatButtonModule,
    MatDialogModule, MatTooltipModule,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">

      <!-- ─── Header ─── -->
      <header class="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div class="max-w-screen-sm mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <a href="https://modweeb.com" class="flex items-center gap-2 no-underline">
            <img [src]="LOGO" alt="مودويب" class="w-8 h-8 rounded-xl object-cover">
            <span class="font-bold text-slate-800 text-base">تصميم مودويب</span>
          </a>
          <a href="https://modweeb.com"
             class="mw-btn-ghost no-underline text-xs"
             matTooltip="العودة للمدونة">
            <span class="material-icons-round text-base">arrow_back</span>
            المدونة
          </a>
        </div>
      </header>

      <!-- ─── Body ─── -->
      <main class="flex-1 max-w-screen-sm mx-auto w-full px-4 py-5 flex flex-col gap-4 animate-fade-in">

        <!-- ══ غير مسجل ══ -->
        <ng-container *ngIf="!auth.isLoggedIn()">
          <div class="mw-card p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span class="material-icons-round text-slate-400 text-3xl">person_off</span>
            </div>
            <h2 class="font-bold text-slate-800 mb-1">لست مسجلاً</h2>
            <p class="text-slate-500 text-sm mb-5">سجّل دخولك لعرض بيانات حسابك</p>
            <a routerLink="/login" class="mw-btn-primary no-underline">
              <span class="material-icons-round text-base">login</span>
              تسجيل الدخول
            </a>
          </div>
        </ng-container>

        <!-- ══ مسجل ══ -->
        <ng-container *ngIf="auth.isLoggedIn()">

          <!-- بطاقة الملف الشخصي -->
          <div class="mw-card">
            <div class="p-5 flex items-center gap-4">
              <!-- الصورة -->
              <div class="relative flex-shrink-0">
                <div class="w-16 h-16 rounded-2xl overflow-hidden bg-primary-50 flex items-center justify-center ring-2 ring-primary-100">
                  <img *ngIf="auth.avatarUrl()" [src]="auth.avatarUrl()"
                       [alt]="auth.displayName()"
                       class="w-full h-full object-cover"
                       (error)="onAvatarError($event)">
                  <span *ngIf="!auth.avatarUrl()"
                        class="text-2xl font-bold text-primary-600">
                    {{ auth.displayName()?.[0]?.toUpperCase() || '?' }}
                  </span>
                </div>
                <!-- زر تغيير الصورة -->
                <label class="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer"
                       matTooltip="تغيير الصورة" matRipple>
                  <span class="material-icons-round text-slate-500" style="font-size:14px">edit</span>
                  <input type="file" accept="image/*" class="hidden" (change)="onAvatarFile($event)">
                </label>
              </div>

              <!-- البيانات -->
              <div class="flex-1 min-w-0">
                <!-- اسم قابل للتعديل -->
                <div class="flex items-center gap-2 mb-0.5" *ngIf="!editingName()">
                  <h2 class="font-bold text-slate-800 text-base truncate">{{ auth.displayName() }}</h2>
                  <button class="text-slate-400 hover:text-primary-600 transition-colors"
                          (click)="startEditName()" matTooltip="تعديل الاسم">
                    <span class="material-icons-round" style="font-size:16px">edit</span>
                  </button>
                </div>
                <div class="flex items-center gap-2 mb-0.5" *ngIf="editingName()">
                  <input [(ngModel)]="nameInput"
                         class="mw-input text-sm py-1 flex-1"
                         placeholder="الاسم"
                         (keyup.enter)="saveName()"
                         (keyup.escape)="editingName.set(false)">
                  <button class="mw-btn-primary !w-auto !py-1 !px-3 text-xs" (click)="saveName()">حفظ</button>
                </div>
                <p class="text-slate-500 text-xs truncate">{{ auth.user()?.email }}</p>
              </div>
            </div>

            <!-- معلومات إضافية -->
            <div class="border-t border-slate-100 px-5 py-3 grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-icons-round text-slate-300 text-base">calendar_month</span>
                <div>
                  <div class="text-slate-400 text-[10px]">تاريخ الانضمام</div>
                  <div class="font-medium text-slate-700">{{ formatDate(auth.user()?.joinDate) }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-icons-round text-slate-300 text-base">devices</span>
                <div>
                  <div class="text-slate-400 text-[10px]">عدد الجلسات</div>
                  <div class="font-medium text-slate-700">{{ sessions().length }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- تحديث رابط الصورة -->
          <div class="mw-card p-4">
            <p class="mw-section-title">تحديث صورة الملف الشخصي</p>
            <div class="flex gap-2">
              <input [(ngModel)]="avatarUrlInput"
                     class="mw-input text-sm flex-1"
                     placeholder="https://example.com/photo.jpg"
                     type="url">
              <button class="mw-btn-primary !w-auto !py-2 !px-4" (click)="saveAvatarUrl()">
                <span class="material-icons-round text-base">check</span>
              </button>
            </div>
          </div>

          <!-- الجلسات النشطة -->
          <div class="mw-card">
            <div class="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <p class="mw-section-title mb-0">الجلسات النشطة</p>
              <button class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                      (click)="removeAllSessions()">
                <span class="material-icons-round" style="font-size:14px">delete_sweep</span>
                مسح الكل
              </button>
            </div>

            <div class="divide-y divide-slate-100">
              <div *ngFor="let s of sessions()" class="px-5 py-3 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <span class="material-icons-round text-slate-400 text-base">
                    {{ s.os.includes('أندرويد') || s.os.includes('آيفون') ? 'smartphone' : 'computer' }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="text-sm font-medium text-slate-700">{{ s.os }}</span>
                    <span *ngIf="s.isCurrent" class="mw-badge-primary">الحالية</span>
                  </div>
                  <div class="text-xs text-slate-400 flex items-center gap-2">
                    <span>{{ s.time }}</span>
                    <span class="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{{ s.ip }}</span>
                  </div>
                </div>
                <button *ngIf="!s.isCurrent"
                        class="mw-btn-ghost text-red-500 border-red-200 hover:bg-red-50"
                        (click)="removeSession(s.id)">
                  <span class="material-icons-round" style="font-size:14px">close</span>
                </button>
              </div>

              <div *ngIf="sessions().length === 0" class="px-5 py-6 text-center">
                <p class="text-slate-400 text-sm">لا توجد جلسات مسجلة</p>
              </div>
            </div>
          </div>

          <!-- تسجيل الخروج -->
          <div class="mw-card p-4">
            <button class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                           text-red-600 text-sm font-semibold border border-red-200
                           hover:bg-red-50 transition-all duration-200"
                    matRipple (click)="logout()">
              <span class="material-icons-round text-base">logout</span>
              تسجيل الخروج من جميع الأجهزة
            </button>
          </div>

        </ng-container>
      </main>

      <!-- ─── Footer ─── -->
      <footer class="border-t border-slate-100 py-4 px-4">
        <div class="max-w-screen-sm mx-auto flex items-center justify-between flex-wrap gap-3">
          <a href="https://modweeb.com" class="flex items-center gap-2 no-underline">
            <img [src]="LOGO" class="w-5 h-5 rounded object-cover" alt="">
            <span class="text-xs font-semibold text-slate-700">تصميم مودويب</span>
          </a>
          <div class="flex items-center gap-4">
            <a href="https://modweeb.com/p/privacy-policy.html" class="text-xs text-slate-400 hover:text-slate-600 no-underline">الخصوصية</a>
            <a href="https://modweeb.com/p/terms.html" class="text-xs text-slate-400 hover:text-slate-600 no-underline">الشروط</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  auth    = inject(AuthService);
  private snack  = inject(MatSnackBar);

  readonly LOGO = 'https://blogger.googleusercontent.com/img/a/AVvXsEjlFuMZRXWUpxZK7ZWolRDFXmZuTNvT2uMzetcU_d2gXpLqZ_3B1-vl18e31nhKyo0C_6SOVsxszrL_FxtJ4YCma9QwhNB0BLiTcBNdqYTAuXStazw9Tds6ylCz0IpSEGZ2MnjCSXIfMtYxcnOV8H3sKC5szT2c3FCYDG_DvVIFtTvsgrzRWGO4kFURiO4=s1600';

  editingName  = signal(false);
  nameInput    = '';
  avatarUrlInput = '';
  sessions     = signal<Session[]>([]);

  ngOnInit(): void {
    this.sessions.set(this.auth.getSessions());
    this.avatarUrlInput = this.auth.avatarUrl();
  }

  startEditName(): void {
    this.nameInput = this.auth.displayName();
    this.editingName.set(true);
  }

  saveName(): void {
    const n = this.nameInput.trim();
    if (!n) return;
    this.auth.updateProfile(n, this.auth.avatarUrl());
    this.editingName.set(false);
    this.notify('تم تحديث الاسم');
  }

  saveAvatarUrl(): void {
    const url = this.avatarUrlInput.trim();
    this.auth.updateProfile(this.auth.displayName(), url);
    this.notify('تم تحديث الصورة');
  }

  onAvatarFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      this.auth.updateProfile(this.auth.displayName(), dataUrl);
      this.avatarUrlInput = dataUrl;
      this.notify('تم تحديث الصورة');
    };
    reader.readAsDataURL(file);
  }

  onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).src = '';
  }

  removeSession(id: number): void {
    this.auth.removeSession(id);
    this.sessions.set(this.auth.getSessions());
    this.notify('تمت إزالة الجلسة');
  }

  removeAllSessions(): void {
    const other = this.auth.getSessions().filter(s => s.isCurrent);
    localStorage.setItem('userSessions', JSON.stringify(other));
    this.sessions.set(other);
    this.notify('تم مسح الجلسات الأخرى');
  }

  logout(): void {
    this.auth.logout();
    this.sessions.set([]);
    this.notify('تم تسجيل الخروج');
  }

  formatDate(d?: string): string {
    if (!d || d === 'null') return 'غير محدد';
    try {
      return new Date(d).toLocaleDateString('ar-SA', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
    } catch { return 'غير محدد'; }
  }

  private notify(msg: string): void {
    this.snack.open(msg, '', { duration: 2500, horizontalPosition: 'center' });
  }
}
