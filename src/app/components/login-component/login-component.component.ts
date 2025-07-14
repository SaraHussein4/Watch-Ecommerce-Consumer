import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login-component',
  imports: [   CommonModule,
    ReactiveFormsModule,
    FormsModule 
],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  loginForm: FormGroup;
   loginError: string | null = null;
   showPassword: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

onSubmit() {
    this.loginError = null;
  if (this.loginForm.valid) {
    const userData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(userData).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.authService.decodeUserData();
        console.log('Login successful:', res);
        if(res.role.toLowerCase() == "user"){
          
          this.router.navigateByUrl('/home');
        }
        else {
          this.router.navigate(['/admin/dashboard']);
        }


      },
      
       error: err => {
          console.error('Login error:', err);

          if (err.status === 400 && err.error?.errors) {
            const errorMessages = [];
            for (const key in err.error.errors) {
              if (err.error.errors[key]) {
                errorMessages.push(...err.error.errors[key]);
              }
            }
            this.loginError = errorMessages.join('\n');
          }
          else if (err.status === 401) {
            this.loginError = err.error?.message || 'Invalid email or password';
          }
          else if (err.error) {
            this.loginError = err.error.message || err.error.title || 'Login failed';
          } else {
            this.loginError = 'An unknown error occurred during Login';
          }
        }

    });
  }
}
}
