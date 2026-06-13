import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: any;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.profileForm.patchValue({
          fullName: data.fullName
        });
      },
      error: () => {
        this.error = 'Failed to load profile.';
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.success = 'Profile updated successfully.';
        this.error = '';

        localStorage.setItem('fullName', this.profileForm.value.fullName);
        window.dispatchEvent(new Event('profileUpdated'));
        this.loadProfile();
      },
      error: () => {
        this.error = 'Failed to update profile.';
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.success = 'Password changed successfully.';
        this.error = '';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to change password.';
      }
    });
  }

  get initials(): string {
    if (!this.profile?.fullName) return 'U';

    return this.profile.fullName
      .split(' ')
      .map((x: string) => x[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}