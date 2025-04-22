import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLimitationsComponent } from './user-limitations.component';

describe('UserLimitationsComponent', () => {
  let component: UserLimitationsComponent;
  let fixture: ComponentFixture<UserLimitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLimitationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLimitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
