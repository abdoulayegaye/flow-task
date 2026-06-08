import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { TokenPayload, TokenResponse } from '../models/auth.model';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly TOKEN_KEY = 'task-flow-access-token';
  private readonly _token$ = new BehaviorSubject<string | null>(
    this.storage.get(this.TOKEN_KEY)
  );

  readonly isAuthenticated$: Observable<boolean> = this._token$.pipe(map(token => !!token));

  private get tokenEndpoint(): string {
    return `${environment.keycloakUrl}/realms/${environment.realm}/protocol/openid-connect/token`;
  }

  private get tokenPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as TokenPayload;
    } catch {
      return null;
    }
  } 
  
  getToken(): string | null {
    return this._token$.getValue();
  }
  
  get username(): string {
    const p = this.tokenPayload;
    return p?.given_name ?? p?.preferred_username ?? p?.name ?? 'Utilisateur';
  }

  login(username: string, password: string): Observable<void> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', environment.clientId)
      .set('username', username)
      .set('password', password);
      
      return this.http
        .post<TokenResponse>(this.tokenEndpoint, body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .pipe(
          tap(({ access_token }) => {
            console.log(access_token);
            this._token$.next(access_token);
            this.storage.set(this.TOKEN_KEY, access_token);
          }),
          map(() => void 0)
        );
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this._token$.next(null);
    this.router.navigate(['/login']);
  }
}

