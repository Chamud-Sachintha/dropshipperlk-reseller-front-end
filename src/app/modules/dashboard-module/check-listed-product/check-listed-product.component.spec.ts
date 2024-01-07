import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListedProductComponent } from './check-listed-product.component';

describe('CheckListedProductComponent', () => {
  let component: CheckListedProductComponent;
  let fixture: ComponentFixture<CheckListedProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckListedProductComponent]
    });
    fixture = TestBed.createComponent(CheckListedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
