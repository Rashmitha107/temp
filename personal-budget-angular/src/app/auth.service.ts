// // auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000'; // Replace with your server URL

//   constructor(private http: HttpClient) {}

//   login(username: string, password: string): Observable<any> {
//     console.log("login function rendered");
//     return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
//   }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // Initialize the isAuthenticatedSubject with an initial value (e.g., false)
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthenticated());
  }

  // Method to check if the user is authenticated using JWT token
  private checkAuthenticated(): boolean {
    const token = this.getToken(); // Get the token from local storage or wherever it's stored
    return !!token; // Return true if token exists, false otherwise
  }

  // Get the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Observable to subscribe to the authentication status changes
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Update the authentication status (for demonstration purposes)
  setAuthenticatedStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Other authentication-related methods (login, logout, etc.) should be implemented based on your app's authentication flow
  // Example login method:
  login(username: string, password: string): Observable<any> {
    // Perform API call to your backend to authenticate the user
    // Here, you'd typically send the credentials to the server and receive a JWT token in response upon successful login
    // For demonstration purposes, we'll assume you have a mock response with a token
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });

    // Simulate a successful login and receive a token
    const mockToken = 'mockJWTToken'; // Replace this with the actual token from your backend

    // Store the token in local storage
    localStorage.setItem('token', mockToken);

    // Update the authentication status
    this.setAuthenticatedStatus(true);

    return new Observable(observer => {
      // Simulate API response with a delay
      setTimeout(() => {
        observer.next({ token: mockToken }); // Emit the token or user data received from the server
        observer.complete();
      }, 1000);
    });
  }

  // Logout method to clear the token and update authentication status
  logout(): void {
    localStorage.removeItem('token'); // Remove the token from local storage upon logout
    this.setAuthenticatedStatus(false); // Update authentication status
  }
}
