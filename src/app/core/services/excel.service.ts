import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  /**
   * Exporta un arreglo de objetos JSON a un archivo de Excel (.xlsx)
   * @param json Datos que se van a exportar
   * @param excelFileName Nombre que tendrá el archivo descargado
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    // 1. Crear la hoja de trabajo (aquí TypeScript deduce el tipo automáticamente sin errores)
    const worksheet = XLSX.utils.json_to_sheet(json);

    // 2. Crear el libro de trabajo con la estructura que requiere la librería
    const workbook = {
      Sheets: { 'Datos': worksheet },
      SheetNames: ['Datos']
    };

    // 3. Generar el archivo y detonar la descarga en el navegador
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
  }

}
