import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFlowersComponent } from './list-flowers.component';

describe('ListFlowersComponent', () => {
  let component: ListFlowersComponent;
  let fixture: ComponentFixture<ListFlowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFlowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFlowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
