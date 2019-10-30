import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanalComponent } from './admin-panal.component';

describe('AdminPanalComponent', () => {
  let component: AdminPanalComponent;
  let fixture: ComponentFixture<AdminPanalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
