import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlowerComponent } from './add-flower.component';

describe('AddFlowerComponent', () => {
  let component: AddFlowerComponent;
  let fixture: ComponentFixture<AddFlowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFlowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
