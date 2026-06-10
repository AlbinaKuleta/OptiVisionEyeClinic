import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  success = '';

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.settingsForm = this.fb.group({
      clinicName: ['OptiVision Eye Clinic'],
      theme: ['Light'],
      notifications: [true]
    });
  }

  ngOnInit(): void {
    const savedSettings = localStorage.getItem('clinicSettings');

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.settingsForm.patchValue(settings);
      this.applyTheme(settings.theme);
    }
  }

  saveSettings(): void {
    const settings = this.settingsForm.value;

    localStorage.setItem('clinicSettings', JSON.stringify(settings));
    this.applyTheme(settings.theme);

    this.success = 'Settings saved successfully.';

    setTimeout(() => {
      this.success = '';
    }, 3000);
  }

  applyTheme(theme: string): void {
    const body = document.body;

    this.renderer.removeClass(body, 'theme-light');
    this.renderer.removeClass(body, 'theme-classic');
    this.renderer.removeClass(body, 'theme-dark');

    if (theme === 'Dark') {
      this.renderer.addClass(body, 'theme-dark');
    } else if (theme === 'Classic') {
      this.renderer.addClass(body, 'theme-classic');
    } else {
      this.renderer.addClass(body, 'theme-light');
    }
  }
}