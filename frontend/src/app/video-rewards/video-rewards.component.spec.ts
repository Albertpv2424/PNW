import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRewardsComponent } from './video-rewards.component';

describe('VideoRewardsComponent', () => {
  let component: VideoRewardsComponent;
  let fixture: ComponentFixture<VideoRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRewardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
