import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VehicleDto } from '../shared/vehicle-dto';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { VehicleRentalManagementStore } from '../vehicle-rental-management-store';

interface Availability {
  name: string;
  value: number;
}

@Component({
  selector: 'app-add-edit-vehicle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditVehicleComponent {
  addEditVehicleForm = this.createVehicleForm();
  availabilityOptions: Availability[] = [
    { name: 'Not available', value: 0 },
    { name: 'Available', value: 1 },
  ];
  formTitle = this.data?.vehicle?.id
    ? 'Edit Vehicle'
    : 'Add new vehicle';

  constructor(
    private _fb: NonNullableFormBuilder,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: {
      vehicle?: VehicleDto;
    },
    private readonly _componentStore: VehicleRentalManagementStore
  ) {}

  ngOnInit(): void {
    this.populateAddEditVehicleForm();
  }

  onSaveClick() {
    if (this.addEditVehicleForm.invalid) {
      return;
    }

    const vehicle: VehicleDto = {
      ...(this.addEditVehicleForm.getRawValue() as VehicleDto),
    };

    if (vehicle.id) {
      this._componentStore.updateVehicles(vehicle);
    } else {
      this._componentStore.insertVehicles(vehicle);
    }
  }

  private createVehicleForm() {
    return this._fb.group({
      id: this._fb.control<number | null>(null),
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: this._fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(1900)],
      }),
      availability: this._fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(0), Validators.max(1)],
      }),
      price: this._fb.control<number | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  private populateAddEditVehicleForm() {
    if (this.data?.vehicle) {
      this.addEditVehicleForm.setValue({
        id: this.data.vehicle.id!,
        make: this.data.vehicle.make,
        model: this.data.vehicle.model,
        year: this.data.vehicle.year,
        availability: this.data.vehicle.availability,
        price: this.data.vehicle.price,
      });
    }
  }
}
