import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushPopupComponent } from './push-popup.component';

describe('PushPopupComponent', () => {
  let component: PushPopupComponent;
  let fixture: ComponentFixture<PushPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
