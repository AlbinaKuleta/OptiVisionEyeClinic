import { Component } from '@angular/core';

@Component({
  selector: 'app-patients',
  standalone: true,
  template: `
    <div class="card shadow-sm border-0 rounded-4 p-4">
      <h2>Patients</h2>
      <p>This is the patients page.</p>
    </div>
  `
})
export class PatientsComponent {}