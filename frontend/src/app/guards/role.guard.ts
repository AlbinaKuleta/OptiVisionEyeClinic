import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    if (!role || !allowedRoles.includes(role)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};