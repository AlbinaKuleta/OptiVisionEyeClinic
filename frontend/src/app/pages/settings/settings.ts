import { Component, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      clinicName: ['OptiVision Eye Clinic'],
      language: ['English'],
      theme: ['Light'],
      notifications: [true]
    });
  }

  ngOnInit(): void {
    const savedSettings = localStorage.getItem('clinicSettings');

    if (savedSettings) {
      this.settingsForm.patchValue(JSON.parse(savedSettings));
    }
  }

  saveSettings(): void {
    localStorage.setItem(
      'clinicSettings',
      JSON.stringify(this.settingsForm.value)
    );

    this.success = 'Settings saved successfully.';

    setTimeout(() => {
      this.success = '';
    }, 3000);
  }
}