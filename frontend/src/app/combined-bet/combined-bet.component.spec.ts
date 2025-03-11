import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedBetComponent } from './combined-bet.component';

describe('CombinedBetComponent', () => {
  let component: CombinedBetComponent;
  let fixture: ComponentFixture<CombinedBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombinedBetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
