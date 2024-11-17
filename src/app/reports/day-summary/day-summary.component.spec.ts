import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaySummaryComponent } from './day-summary.component';

describe('DaySummaryComponent', () => {
  let component: DaySummaryComponent;
  let fixture: ComponentFixture<DaySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaySummaryComponent]
    });
    fixture = TestBed.createComponent(DaySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
