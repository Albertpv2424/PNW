import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetVerificationComponent } from './bet-verification.component';

describe('BetVerificationComponent', () => {
  let component: BetVerificationComponent;
  let fixture: ComponentFixture<BetVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
