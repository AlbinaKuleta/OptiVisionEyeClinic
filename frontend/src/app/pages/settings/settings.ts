import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  clinicName = 'OptiVision Eye Clinic';
  language = 'English';
  theme = 'Light';
  notifications = true;

  saveSettings(): void {
    alert('Settings saved successfully!');
  }
}