// import { Component } from '@angular/core';
// import { AuthService } from '../auth.service';
// import { Observer } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.sass'] // Update the path if needed
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   loginError: string = '';

//   constructor(private authService: AuthService) {}

//   onSubmit(): void {
//     const observer: Observer<any> = {
//       next: (response: any) => {
//         // Handle the response from the backend
//         console.log('Login response:', response);
//         // Perform actions based on the response
//       },
//       error: (error: any) => {
//         // Handle login error
//         console.error('Login error:', error);
//         // Display an error message to the user
//         this.loginError = 'Error occurred during login. Please try again.';
//       },
//       complete: () => {
//         // Optional: Handle completion (if needed)
//       }
//     };

//     this.authService.login(this.username, this.password)
//       .subscribe(observer);
//   }
// }


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Update the path if needed
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router // Inject the Router service
  ) {}

  onSubmit(): void {
    const observer: Observer<any> = {
      next: (response: any) => {
        // Handle the response from the backend
        console.log('Login response:', response);
        if (response.response.success) {
          // Redirect to the dashboard page on successful login
          this.router.navigate(['/dashboard']); // Replace '/dashboard' with your desired route
        } else {
          // Handle unsuccessful login
          this.loginError = 'Invalid credentials';
        }
      },
      error: (error: any) => {
        // Handle login error
        console.error('Login error:', error);
        this.loginError = 'Error occurred during login. Please try again.';
      },
      complete: () => {
        // Optional: Handle completion (if needed)
      }
    };

    this.authService.login(this.username, this.password)
      .subscribe(observer);
  }
}
