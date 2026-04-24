import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="card shadow-sm border-0 rounded-4 p-4">
      <h2>Dashboard</h2>
      <p>Welcome to OptiVision Eye Clinic.</p>
    </div>
  `
})
export class DashboardComponent {}