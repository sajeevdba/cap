import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlSystemComponent } from './dl-system.component';

describe('DlSystemComponent', () => {
  let component: DlSystemComponent;
  let fixture: ComponentFixture<DlSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
