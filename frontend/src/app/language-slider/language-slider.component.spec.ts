import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSliderComponent } from './language-slider.component';

describe('LanguageSliderComponent', () => {
  let component: LanguageSliderComponent;
  let fixture: ComponentFixture<LanguageSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
