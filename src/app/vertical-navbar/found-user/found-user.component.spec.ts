import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundUserComponent } from './found-user.component';

describe('FoundUserComponent', () => {
  let component: FoundUserComponent;
  let fixture: ComponentFixture<FoundUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoundUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
