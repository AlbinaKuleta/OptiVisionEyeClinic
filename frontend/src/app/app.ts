import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedSettings = localStorage.getItem('clinicSettings');

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.applyTheme(settings.theme);
    }
  }

  applyTheme(theme: string): void {
    const body = document.body;

    body.classList.remove(
      'theme-light',
      'theme-dark',
      'theme-classic'
    );

    body.classList.add(
      theme === 'Dark'
        ? 'theme-dark'
        : theme === 'Classic'
        ? 'theme-classic'
        : 'theme-light'
    );
  }
}