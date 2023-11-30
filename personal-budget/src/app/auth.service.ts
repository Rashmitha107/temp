// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http'
// import { BehaviorSubject, Observable, map } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private isAuthenticatedSubject: BehaviorSubject<boolean>;
//   private apiUrl = 'http://localhost:3000';

//   constructor(private http: HttpClient) {
//     // Initialize the isAuthenticatedSubject with an initial value (e.g., false)
//     this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthenticated());
//   }

//   // Method to check if the user is authenticated using JWT token
//   private checkAuthenticated(): boolean {
//     const token = this.getToken(); // Get the token from local storage or wherever it's stored
//     return !!token; // Return true if token exists, false otherwise
//   }

//   // Get the JWT token from local storage
//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   // Observable to subscribe to the authentication status changes
//   isAuthenticated(): Observable<boolean> {
//     return this.isAuthenticatedSubject.asObservable();
//   }

//   // Update the authentication status (for demonstration purposes)
//   setAuthenticatedStatus(isAuthenticated: boolean): void {
//     this.isAuthenticatedSubject.next(isAuthenticated);
//   }


//  login(username: string, password: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
//       map((response: any)=>{
//         const token = response.token;
//         localStorage.setItem('token', token);
//         this.setAuthenticatedStatus(true);
//         return new Observable(observer => {
//           // Simulate API response with a delay
//           setTimeout(() => {
//             observer.next({ token: token }); // Emit the token or user data received from the server
//             observer.complete();
//           }, 1000);
//         });
//       })
//     );
//   }

//   // Logout method to clear the token and update authentication status
//   logout(): void {
//     localStorage.removeItem('token'); // Remove the token from local storage upon logout
//     this.setAuthenticatedStatus(false); // Update authentication status
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthenticated());
  }

  private checkAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticatedStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response: any) => {
        const token = response.token;
        this.storeToken(token);
        this.setAuthenticatedStatus(true);
        return { response }; // Return the token directly in the response
      })
    );
  }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  // }


  storeToken(token: string): void {
    const currentTime = new Date().getTime();
    const tokenExpiry = currentTime + 60000;
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiry', tokenExpiry.toString());
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setAuthenticatedStatus(false);
  }
}
