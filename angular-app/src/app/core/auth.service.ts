import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
  picture: string;
  joinDate: string;
}

export interface Session {
  id: number;
  time: string;
  os: string;
  ip: string;
  isCurrent: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  /* ── Reactive State ── */
  private _user = signal<AuthUser | null>(this.loadUser());

  readonly user   = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly displayName = computed(() => this._user()?.name ?? '');
  readonly avatarUrl   = computed(() => this._user()?.picture ?? '');

  /* ── Public API ── */

  login(user: Omit<AuthUser, 'joinDate'>): void {
    const joinDate = localStorage.getItem('userJoinDate')
      ?? new Date().toISOString();

    const full: AuthUser = { ...user, joinDate };
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName',    user.name);
    localStorage.setItem('userEmail',   user.email);
    localStorage.setItem('userPicture', user.picture);
    localStorage.setItem('userJoinDate', joinDate);
    this._user.set(full);
    this.registerSession();
  }

  logout(): void {
    ['userLoggedIn','userName','userEmail','userPicture','userJoinDate','userSessions']
      .forEach(k => localStorage.removeItem(k));
    this._user.set(null);
  }

  updateProfile(name: string, picture: string): void {
    localStorage.setItem('userName',    name);
    localStorage.setItem('userPicture', picture);
    const u = this._user();
    if (u) this._user.set({ ...u, name, picture });
  }

  getSessions(): Session[] {
    try {
      const raw = localStorage.getItem('userSessions');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  removeSession(id: number): void {
    const updated = this.getSessions().filter(s => s.id !== id);
    localStorage.setItem('userSessions', JSON.stringify(updated));
  }

  /** إرسال loginSuccess إلى نافذة بلوجر المفتوحة */
  notifyOpener(user: AuthUser, targetOrigin: string): void {
    window.opener?.postMessage(
      { type: 'loginSuccess', user: { name: user.name, email: user.email, image: user.picture } },
      targetOrigin
    );
  }

  /* ── Private Helpers ── */

  private loadUser(): AuthUser | null {
    if (localStorage.getItem('userLoggedIn') !== 'true') return null;
    return {
      name:     localStorage.getItem('userName')    ?? '',
      email:    localStorage.getItem('userEmail')   ?? '',
      picture:  localStorage.getItem('userPicture') ?? '',
      joinDate: localStorage.getItem('userJoinDate') ?? '',
    };
  }

  private registerSession(): void {
    const existing = this.getSessions().filter(s => !s.isCurrent);
    const current: Session = {
      id: Date.now(),
      time: new Date().toLocaleString('ar-SA'),
      os: this.getOS(),
      ip: '...',
      isCurrent: true,
    };
    const sessions = [...existing, current];
    localStorage.setItem('userSessions', JSON.stringify(sessions));
    // جلب IP بشكل غير متزامن
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then((d: { ip: string }) => {
        current.ip = d.ip;
        localStorage.setItem('userSessions', JSON.stringify(sessions));
      })
      .catch(() => { current.ip = 'غير معروف'; });
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'ويندوز';
    if (ua.includes('Android')) return 'أندرويد';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'آيفون';
    if (ua.includes('Mac')) return 'ماك';
    if (ua.includes('Linux')) return 'لينكس';
    return 'غير معروف';
  }
}
