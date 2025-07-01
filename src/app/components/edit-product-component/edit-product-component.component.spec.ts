import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductComponentComponent } from './edit-product-component.component';

describe('EditProductComponentComponent', () => {
  let component: EditProductComponentComponent;
  let fixture: ComponentFixture<EditProductComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
