import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({


  selector: 'app-register-component',
   imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule      
  ],
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponentComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(011|012|015|010)\d{8}$/)]],
      buildingNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      street: ['', [Validators.required]],
      state: ['', [Validators.required]],
      password: ['', [Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).+$/), Validators.minLength(6),Validators.maxLength(60)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

onSubmit() {
  if (this.registerForm.valid) {
    const userData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      buildingNumber: Number(this.registerForm.value.buildingNumber),
      street: this.registerForm.value.street,
      state: this.registerForm.value.state,
      isDefault: true, 
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };
    
    this.authService.register(userData).subscribe({
      next: res => {
        console.log('Registration successful:', res);
       
        this.router.navigate(['/login']);
     

      },
      // error: err => {
      //   console.error('Registration error:', err);
        
      //   if (err.status === 400 && err.error?.errors) {
      //     const errorMessages = [];
      //     for (const key in err.error.errors) {
      //       if (err.error.errors[key]) {
      //         errorMessages.push(...err.error.errors[key]);
      //       }
      //     }
      //     alert(errorMessages.join('\n'));
      //   } 
      //   else if (err.error) {
      //     alert(err.error.message || err.error.title || 'Registration failed');
      //   } else {
      //     alert('An unknown error occurred during registration');
      //   }
      // }
      error: err => {
  console.error('Registration error:', err);

  if (err.status === 400) {
    const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message || err.error?.title;

    if (errorMessage?.toLowerCase().includes('email')) {
      this.registerForm.get('email')?.setErrors({ emailExists: true });
    } else if (err.error?.errors) {
      const errorMessages = [];
      for (const key in err.error.errors) {
        if (err.error.errors[key]) {
          errorMessages.push(...err.error.errors[key]);
        }
      }
      alert(errorMessages.join('\n'));
    } else {
      alert(errorMessage || 'Registration failed');
    }
  } else {
    alert('An unknown error occurred during registration');
  }
}

    });
  }
}
}
