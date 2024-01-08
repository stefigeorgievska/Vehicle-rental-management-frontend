import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, take } from 'rxjs';
import { VehicleDto } from './shared/vehicle-dto';
import { VehicleRentalManagementStore } from './vehicle-rental-management-store';
import { VehicleRentalManagementService } from './services/vehicle-rental-management.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddEditVehicleComponent } from './add-edit-vehicle/add-edit-vehicle.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'vehicle-rental-management';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  vehicles$!: Observable<VehicleDto[]>;
  destroyRef = inject(DestroyRef);
  dataSource = new MatTableDataSource<VehicleDto>();

  constructor(
    private _componentStore: VehicleRentalManagementStore,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.vehicles$ = this._componentStore.vehicles$;
    this._componentStore.getVehicles();
  }

  ngAfterViewInit() {
    this.vehicles$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((vehicles) => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = JSON.parse(JSON.stringify(vehicles));
        this.dataSource.sort = this.sort;
      });
  }

  columns = [
    {
      columnDef: 'make',
      header: 'Make',
      cell: (element: VehicleDto) => `${element.make}`,
    },
    {
      columnDef: 'model',
      header: 'Model',
      cell: (element: VehicleDto) => `${element.model}`,
    },
    {
      columnDef: 'year',
      header: 'Year',
      cell: (element: VehicleDto) => `${element.year}`,
    },
    {
      columnDef: 'availability',
      header: 'Availability',
      cell: (element: VehicleDto) => `${element.availability}`,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      cell: (element: string) => '',
    },
  ];

  displayedColumns = this.columns.map((c) => c.columnDef);

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditClick(vehicle: VehicleDto) {
    this.dialog.open(AddEditVehicleComponent, {
      data: {
        vehicle: vehicle,
      },
    });
  }

  onDeleteClick(vehicleId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        isDelete: true,
        message: 'Are you sure you want to delete this vehicle?',
        buttonText: {
          ok: 'Delete',
          cancel: 'No',
        },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._componentStore.deleteVehicle(vehicleId);
        }
      });
  }

  onAddVehicle() {
    this.dialog.open(AddEditVehicleComponent);
  }
}
