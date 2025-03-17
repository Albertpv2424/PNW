import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWheelComponent } from './daily-wheel.component';

describe('DailyWheelComponent', () => {
  let component: DailyWheelComponent;
  let fixture: ComponentFixture<DailyWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyWheelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
