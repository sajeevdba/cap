import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreateSegmentComponent } from './app-create-segment.component';

describe('AppCreateSegmentComponent', () => {
  let component: AppCreateSegmentComponent;
  let fixture: ComponentFixture<AppCreateSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCreateSegmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCreateSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
