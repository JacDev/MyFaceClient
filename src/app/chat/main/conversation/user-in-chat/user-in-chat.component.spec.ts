import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInChatComponent } from './user-in-chat.component';

describe('UserInChatComponent', () => {
  let component: UserInChatComponent;
  let fixture: ComponentFixture<UserInChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
