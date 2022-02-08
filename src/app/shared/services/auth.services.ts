import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { FBAuthToken, User } from "src/app/shared/interfaces/interfaces";
import { catchError, Observable, Subject, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})

export class AuthService {
  
  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) { }

  //check token method
  public get token(): string | number | null {
    const expDate = new Date(localStorage.getItem('fb-token-exp') as string)
    if (new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token');
  }

  public login(user: User): Observable<any> {
    user.returnSecureToken = true;
    console.log(user)
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken) as any,
        catchError(this.handleError.bind(this))

      );
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('incorrect mail')
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('incorrect password')
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Mail does not exist')
        break;
    }
    // console.log(message)
    return throwError(error)
  }

  public logout(): void {
    this.setToken(null)
  }

  //check token method
  public isAuthenticated(): boolean {
    return !!this.token
  }

  //change token method
  public setToken(response: FBAuthToken | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response!.expiresIn * 1000);
      localStorage.setItem('fb-token', <string>response?.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      return localStorage.clear()
    }

  }

}
