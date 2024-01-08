import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVehicleComponent } from './add-edit-vehicle.component';

describe('AddEditVehicleComponent', () => {
  let component: AddEditVehicleComponent;
  let fixture: ComponentFixture<AddEditVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
