import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg mb-4">
            <span class="text-2xl font-bold">U</span>
          </div>
          <h1 class="text-3xl font-bold text-slate-900">UNI-VERX</h1>
          <p class="mt-2 text-slate-500">Sign in to your account</p>
        </div>

        <app-card class="border-0 shadow-lg">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              id="email"
              label="Email address"
              type="email"
              placeholder="name@university.edu"
              icon="pi-envelope"
              formControlName="email"
              [error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched ? 'Valid email required' : ''"
            ></app-input>

            <app-input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon="pi-lock"
              formControlName="password"
              [error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched ? 'Password required' : ''"
            ></app-input>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600">
                <label for="remember-me" class="ml-2 block text-sm text-slate-900">Remember me</label>
              </div>

              <div class="text-sm border-0 border-transparent">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500 border-0">Forgot password?</a>
              </div>
            </div>

            <app-button
              type="submit"
              class="w-full h-11 text-base"
              [loading]="isLoading"
              [disabled]="loginForm.invalid"
            >
              Sign In
            </app-button>
          </form>
        </app-card>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['admin@university.edu', [Validators.required, Validators.email]],
      password: ['password123', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // Mock login for now
      setTimeout(() => {
        this.isLoading = false;
        const email = this.loginForm.value.email;
        if (email.includes('student')) {
          this.router.navigate(['/student']);
        } else if (email.includes('professor')) {
          this.router.navigate(['/professor']);
        } else if (email.includes('rector')) {
          this.router.navigate(['/rectorate']);
        } else if (email.includes('secret')) {
          this.router.navigate(['/secretariat']);
        } else {
          this.router.navigate(['/admin']);
        }
      }, 1000);
    }
  }
}
