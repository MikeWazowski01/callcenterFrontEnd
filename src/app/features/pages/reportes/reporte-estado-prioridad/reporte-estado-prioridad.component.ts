import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ExcelService } from '../../../../core/services/excel.service';
import { GenericService } from '../../../../core/services/generic.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEstatusResponse, IPrioridadResponse } from '../../../../shared/models/Catalogos';
import { ResponseData } from '../../../../shared/models/response-data.model';
import { IReportePrioridad } from '../../../../shared/models/Reportes';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-reporte-estado-prioridad',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }, DatePipe, CurrencyPipe],
  imports: [ToolbarComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatInputModule, MatIconModule],
  templateUrl: './reporte-estado-prioridad.component.html',
  styleUrl: './reporte-estado-prioridad.component.css'
})
export class ReporteEstadoPrioridadComponent implements OnInit {
  titulo: string = 'Reportes por Estado y Prioridad';
  Estatus: IEstatusResponse[] = [];
  Prioridades: IPrioridadResponse[] = [];
  Reporte: IReportePrioridad[] = [];


  reporteForms!: FormGroup;

  constructor(private dialogRef: MatDialogRef<ReporteEstadoPrioridadComponent>, private datePipe: DatePipe, private fb: FormBuilder, private excelService: ExcelService, private methodsService: GenericService) {
    this.reporteForms = this.fb.group({
      FechaInicio: [null, Validators.required],
      FechaFin: [null, Validators.required],
      Estatus: [0, Validators.required],
      Prioridad: [0, Validators.required],
    });
  }
  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.methodsService.HttpGet('Prioridad/get-prioridad', {}).subscribe({
      next: (response: ResponseData<IPrioridadResponse[]>) => {
        const prioridadTodos: IPrioridadResponse = {
          Codigo: 'TODOS',
          IdPrioridad: 0
        };
        this.Prioridades = [prioridadTodos, ...response.data];


      }, error: () => {

      }
    });

    this.methodsService.HttpGet('Estatus/get-estatus', {}).subscribe({
      next: (response: ResponseData<IEstatusResponse[]>) => {
        const estatusTodos: IEstatusResponse = {
          Codigo: 'TODOS',
          IdEstatus: 0
        };
        this.Estatus = [estatusTodos, ...response.data];

      }, error: () => {
      }
    });

  }
  closeDialog() {
    this.dialogRef.close('close');
  }
  generarReporte() {

    // 3. Extraemos los valores actuales del formulario
    const formValues = this.reporteForms.value;

    // 4. Creamos el objeto final formateando las fechas a YYYY-MM-DD
    const formsEnviar = {
      ...formValues, // Copia el resto de los campos (Estatus, Prioridad, etc.)
      FechaInicio: this.datePipe.transform(formValues.FechaInicio, 'yyyy-MM-dd'),
      FechaFin: this.datePipe.transform(formValues.FechaFin, 'yyyy-MM-dd')
    };

    this.methodsService.HttpPost('Reportes/get-reporteEstatusPrioridad', {}, formsEnviar).subscribe({
      next: (response: IReportePrioridad[]) => {

        this.Reporte = response;

        const datosParaExcel = this.Reporte.map(cliente => {
          return {
            'Folio': cliente.Folio,
            'No Cliente': cliente.NoCliente,
            'Persona': cliente.Persona,
            'Es Cliente': cliente.EsCliente,
            'Analisis Origen': cliente.AnalisisOrigen,
            'Solucion Acuerdo': cliente.SolucionAcuerdo,
            'Compromiso Mejora': cliente.CompromisoMejora,
            'Fecha Registro': cliente.FechaRegistro,
            'Fecha Limite': cliente.FechaLimite,
            'Dias Atraso': cliente.Da,
            'Dias Totales': cliente.DiasTotalesAtencion,
            'Nombre Responsable': cliente.NombreResponsable,
            'Prioridad': cliente.Prioridad,
            'Categoria': cliente.Categoria,
            'Estatus': cliente.Estatus,
            'Fecha Finalización': cliente.FechaFinalizacion,
          };
        });


        this.exportAsExcelFile(datosParaExcel, 'ReportexEstadoPrioridad_' + formsEnviar.FechaInicio + '-' + formsEnviar.FechaFin)


      }, error: () => {

      }
    });


  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    // 1. Convertir el JSON mapeado a una hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    // 2. AUTO-AJUSTE DE COLUMNAS PARA TEXTOS LARGOS
    if (json && json.length > 0) {
      const columnWidths: number[] = [];

      // Recorremos el JSON fila por fila
      json.forEach(row => {
        // Recorremos cada propiedad (columna) de la fila
        Object.keys(row).forEach((key, index) => {
          const cellValue = row[key] ? row[key].toString() : '';

          const headerLength = key.toString().length; // Largo del título (ej: "No Cliente")
          const valueLength = cellValue.length;        // Largo del texto de la celda

          // Buscamos cuál es el texto más largo de todos
          const maxLength = Math.max(headerLength, valueLength);

          // Guardamos el máximo tamaño para esa columna
          columnWidths[index] = Math.max(columnWidths[index] || 0, maxLength);
        });
      });

      // Aplicamos los anchos a la propiedad !cols de la hoja de SheetJS
      // El "+ 5" es un margen de espacio para que no quede el texto rozando la línea divisoria
      worksheet['!cols'] = columnWidths.map(w => ({ width: w + 5 }));
    }

    // 3. Crear el libro y descargar el archivo
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Datos': worksheet },
      SheetNames: ['Datos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.descargarArchivo(excelBuffer, excelFileName);
  }

  private descargarArchivo(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
