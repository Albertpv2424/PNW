import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingTimerComponent } from './betting-timer.component';

describe('BettingTimerComponent', () => {
  let component: BettingTimerComponent;
  let fixture: ComponentFixture<BettingTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettingTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BettingTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
