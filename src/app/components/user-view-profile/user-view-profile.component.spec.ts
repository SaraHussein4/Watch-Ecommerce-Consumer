import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewProfileComponent } from './user-view-profile.component';

describe('UserViewProfileComponent', () => {
  let component: UserViewProfileComponent;
  let fixture: ComponentFixture<UserViewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
