import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveriesComponent } from './admin-deliveries.component';

describe('AdminDeliveriesComponent', () => {
  let component: AdminDeliveriesComponent;
  let fixture: ComponentFixture<AdminDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeliveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
