import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ReporteEstadoPrioridadComponent } from './reporte-estado-prioridad/reporte-estado-prioridad.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-reportes',
  imports: [MatCardModule, MatButtonModule, MatGridListModule, MatIconModule, HasPermissionDirective],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesComponent {

  constructor(private dialog: MatDialog) { }
  reportes(tipoReporte: number) {
    switch (tipoReporte) {
      case 1:
        const dialogRef = this.dialog.open(ReporteEstadoPrioridadComponent, {
          autoFocus: false,
          //minWidth: '60%',
          width: '70%',
          height: 'auto',
          disableClose: true,
          panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'success' || result === 'data null') {


          }
        });
        break;

    }
  }


}
