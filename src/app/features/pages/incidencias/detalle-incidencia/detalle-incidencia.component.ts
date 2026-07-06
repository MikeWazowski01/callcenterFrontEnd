import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-detalle-incidencia',
  standalone: true,
  imports: [
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    ToolbarComponent
  ],
  templateUrl: './detalle-incidencia.component.html',
  styleUrl: './detalle-incidencia.component.css'
})
export class DetalleIncidenciaComponent implements OnInit {
  titulo: string = 'Detalle de la Incidencia';
  Incidencia: string = '';
  Folio: string = '';

  constructor(
    private dialog: MatDialogRef<DetalleIncidenciaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }
  ngOnInit(): void {

    this.Incidencia = this.data.Incidencia.IncidenciaDetalle;
    this.Folio = this.data.Folio
  }

  closeDialog() {
    this.dialog.close('close');
  }


}
