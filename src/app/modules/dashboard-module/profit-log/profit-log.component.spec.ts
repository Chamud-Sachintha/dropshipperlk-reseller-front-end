import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLogComponent } from './profit-log.component';

describe('ProfitLogComponent', () => {
  let component: ProfitLogComponent;
  let fixture: ComponentFixture<ProfitLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitLogComponent]
    });
    fixture = TestBed.createComponent(ProfitLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
