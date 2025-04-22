import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingLimitsComponent } from './betting-limits.component';

describe('BettingLimitsComponent', () => {
  let component: BettingLimitsComponent;
  let fixture: ComponentFixture<BettingLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettingLimitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BettingLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
