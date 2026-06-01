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

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Receptionist', Validators.required]
    });

    this.editRoleForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: () => this.error = 'Failed to load users.'
    });
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.success = 'User created successfully.';
        this.error = '';
        this.loading = false;
        this.userForm.reset({ role: 'Receptionist' });
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create user.';
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
    if (!this.userToEdit || this.editRoleForm.invalid) return;

    this.userService.updateUserRole(this.userToEdit.id, this.editRoleForm.value).subscribe({
      next: () => {
        this.success = 'User role updated successfully.';
        this.error = '';
        this.closeEditRoleModal();
        this.loadUsers();
      },
      error: () => this.error = 'Failed to update user role.'
    });
  }

  openDeleteModal(user: AppUser): void {
    this.userToDelete = user;
  }

  closeDeleteModal(): void {
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.success = 'User deleted successfully.';
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: () => this.error = 'Failed to delete user.'
    });
  }
}