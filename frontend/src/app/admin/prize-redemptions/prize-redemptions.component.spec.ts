import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeRedemptionsComponent } from './prize-redemptions.component';

describe('PrizeRedemptionsComponent', () => {
  let component: PrizeRedemptionsComponent;
  let fixture: ComponentFixture<PrizeRedemptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeRedemptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeRedemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
