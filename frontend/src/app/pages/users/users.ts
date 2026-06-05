import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user';
import { AppUser } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: AppUser[] = [];
  roles = ['Admin', 'Doctor', 'Receptionist'];

  userForm: FormGroup;
  editRoleForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  userToEdit: AppUser | null = null;
  userToDelete: AppUser | null = null;

  weekDays = [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' }
  ];

  selectedDays: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Receptionist', Validators.required],

      specialization: [''],
      phoneNumber: [''],
      startTime: [''],
      endTime: [''],
      notes: ['']
    });

    this.editRoleForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  isDoctorRoleSelected(): boolean {
    return this.userForm.get('role')?.value === 'Doctor';
  }

  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(selectedDay => selectedDay !== day);
    } else {
      this.selectedDays.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  buildAvailability(startTime: string, endTime: string): string {
    if (this.selectedDays.length === 0 || !startTime || !endTime) {
      return '';
    }

    return `${this.selectedDays.join(', ')} | ${startTime} - ${endTime}`;
  }

  loadUsers(): void {
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users.';
      }
    });
  }

  createUser(): void {
    this.success = '';
    this.error = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isDoctorRoleSelected() && !this.userForm.value.specialization?.trim()) {
      this.error = 'Specialization is required for doctor users.';
      return;
    }

    if (this.isDoctorRoleSelected() && this.selectedDays.length === 0) {
      this.error = 'Please select at least one available day.';
      return;
    }

    if (this.isDoctorRoleSelected() && (!this.userForm.value.startTime || !this.userForm.value.endTime)) {
      this.error = 'Please select start time and end time.';
      return;
    }

    this.loading = true;

    const formValue = this.userForm.value;

    const payload = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      specialization: this.isDoctorRoleSelected() ? formValue.specialization : '',
      phoneNumber: this.isDoctorRoleSelected() ? formValue.phoneNumber : '',
      availability: this.isDoctorRoleSelected()
        ? this.buildAvailability(formValue.startTime, formValue.endTime)
        : '',
      notes: this.isDoctorRoleSelected() ? formValue.notes : ''
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.success = 'User created successfully.';
        this.error = '';
        this.loading = false;
        this.selectedDays = [];

        this.userForm.reset({
          role: 'Receptionist',
          specialization: '',
          phoneNumber: '',
          startTime: '',
          endTime: '',
          notes: ''
        });

        this.loadUsers();
      },
      error: (err) => {
        this.error =
          err.error?.message ||
          err.error?.errors?.[0] ||
          'Failed to create user.';

        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditRoleModal(user: AppUser): void {
    this.userToEdit = user;

    this.editRoleForm.patchValue({
      role: user.roles?.[0] || 'Receptionist'
    });
  }

  closeEditRoleModal(): void {
    this.userToEdit = null;
    this.editRoleForm.reset();
  }

  updateRole(): void {
    this.success = '';
    this.error = '';

    if (!this.userToEdit || this.editRoleForm.invalid) {
      return;
    }

    this.userService.updateUserRole(this.userToEdit.id, this.editRoleForm.value).subscribe({
      next: () => {
        this.success = 'User role updated successfully.';
        this.error = '';
        this.closeEditRoleModal();
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update user role.';
      }
    });
  }

  openDeleteModal(user: AppUser): void {
    this.userToDelete = user;
  }

  closeDeleteModal(): void {
    this.userToDelete = null;
  }

  confirmDelete(): void {
    this.success = '';
    this.error = '';

    if (!this.userToDelete) {
      return;
    }

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.success = 'User deleted successfully.';
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete user.';
      }
    });
  }
}