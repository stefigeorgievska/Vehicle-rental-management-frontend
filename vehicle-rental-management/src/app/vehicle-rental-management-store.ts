import { VehicleRentalManagementService } from './services/vehicle-rental-management.service';
import { Observable, switchMap } from 'rxjs';
import { VehicleDto } from './shared/vehicle-dto';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface VehicleRentalManagementState {
  vehicles: VehicleDto[];
}

const initialState: VehicleRentalManagementState = {
  vehicles: [],
};

@Injectable()
export class VehicleRentalManagementStore extends ComponentStore<VehicleRentalManagementState> {
  readonly vehicles$ = this.select((state) => state.vehicles);

  getVehicles = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this._vehicleService.getVehicles().pipe(
          tapResponse(
            (vehicles: VehicleDto[]) => {
              this.setState({
                vehicles,
              });
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  insertVehicles = this.effect((vehicleDto$: Observable<VehicleDto>) =>
    vehicleDto$.pipe(
      switchMap((vehicleDto) =>
        this._vehicleService.insertVehicle(vehicleDto).pipe(
          tapResponse(
            (vehicle) => {
              this.insertVehicle(vehicle);
              this._toastrService.success('Vehicle added successfully!');
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  updateVehicles = this.effect((vehicleDto$: Observable<VehicleDto>) =>
    vehicleDto$.pipe(
      switchMap((vehicleDto) =>
        this._vehicleService.updateVehicle(vehicleDto).pipe(
          tapResponse(
            (vehicle) => {
              this.updateVehicle(vehicle);
              this._toastrService.success('Update successful!');
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  deleteVehicle = this.effect((vehicleId$: Observable<number>) =>
    vehicleId$.pipe(
      switchMap((vehicleId) =>
        this._vehicleService.deleteVehicle(vehicleId).pipe(
          tapResponse(
            (deletedVehicleId) => {
              this.removeVehicle(deletedVehicleId);
              this._toastrService.success('Vehicle successfully deleted!');
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  private readonly insertVehicle = this.updater(
    (state: VehicleRentalManagementState, vehicle: VehicleDto) => ({
      ...state,
      vehicles: [...state.vehicles, vehicle],
    })
  );

  private readonly updateVehicle = this.updater(
    (state: VehicleRentalManagementState, vehicle: VehicleDto) => {
      const newState = {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === vehicle.id ? vehicle : v
        ),
      };

      return newState;
    }
  );

  private readonly removeVehicle = this.updater(
    (state: VehicleRentalManagementState, vehicleId: number) => {
      const newState = {
        ...state,
        vehicles: state.vehicles.filter((v) => v.id !== vehicleId),
      };
      return newState;
    }
  );

  constructor(
    private _vehicleService: VehicleRentalManagementService,
    private _toastrService: ToastrService
  ) {
    super(initialState);
  }
}
