import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPopupComponent } from './bet-popup.component';

describe('BetPopupComponent', () => {
  let component: BetPopupComponent;
  let fixture: ComponentFixture<BetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
