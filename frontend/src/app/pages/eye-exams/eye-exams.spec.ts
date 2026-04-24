import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeExams } from './eye-exams';

describe('EyeExams', () => {
  let component: EyeExams;
  let fixture: ComponentFixture<EyeExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeExams],
    }).compileComponents();

    fixture = TestBed.createComponent(EyeExams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
