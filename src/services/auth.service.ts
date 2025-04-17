import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// Interface for type safety
export interface AuthResponse {
  user?: {
    id: string;
    phoneNumber: string;
    [key: string]: any;
  };
  token?: string;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUser: any = null;

  constructor(private http: HttpClient) {
    // Try to get user from local storage on init
    this.loadUserFromStorage();
  }

  // Load user from storage
  private loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Save user to storage
  private saveUserToStorage(user: any) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
    }
  }

  // Get current user
  getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      if (this.currentUser) {
        resolve(this.currentUser);
      } else {
        resolve(null);
      }
    });
  }

  // Get user by ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/user/${userId}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Send OTP to phone number
  sendOTP(phoneNumber: string): Observable<any> {
    console.log('Sending OTP to:', phoneNumber);
    return this.http.post(`${this.apiUrl}/auth/send-otp`, { phoneNumber })
      .pipe(
        tap(response => console.log('Send OTP response:', response)),
        catchError(this.handleError.bind(this))
      );
  }

  // Verify OTP
  verifyOTP(phoneNumber: string, otp: string): Observable<AuthResponse> {
    console.log('Verifying OTP:', { phoneNumber, otp: String(otp) });
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/verify-otp`, {
      phoneNumber,
      otp: String(otp) // Ensure OTP is sent as a string
    }).pipe(
      tap(response => {
        console.log('Verify OTP response:', response);
        // If verification successful, save user data
        if (response && response.user) {
          this.saveUserToStorage(response.user);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Register user
  registerUser(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          // If registration successful, save user data
          if (response && response.user) {
            this.saveUserToStorage(response.user);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Logout user
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );

      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      }
    }

    return throwError(error);
  }
}
