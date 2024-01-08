import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleDto } from '../shared/vehicle-dto';
import { Observable } from 'rxjs';

@Injectable()
export class VehicleRentalManagementService {
  private _baseUrl = 'http://localhost:8080';
  constructor(private _http: HttpClient) {}

  getVehicles(): Observable<VehicleDto[]> {
    const vehicles: Observable<VehicleDto[]> = this._http.get<VehicleDto[]>(
      `${this._baseUrl}/vehicles`
    );
    return vehicles;
  }

  insertVehicle(vehicleDto: VehicleDto): Observable<VehicleDto> {
    return this._http.post<VehicleDto>(
      `${this._baseUrl}/vehicles/vehicles/post`,
      vehicleDto
    );
  }

  updateVehicle(vehicleDto: VehicleDto): Observable<VehicleDto> {
    return this._http.put<VehicleDto>(
      `${this._baseUrl}/vehicles/${vehicleDto.id}`,
      vehicleDto
    );
  }

  deleteVehicle(vehicleId: number): Observable<number> {
    return this._http.delete<number>(`${this._baseUrl}/vehicles/${vehicleId}`);
  }
}
