import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GenericService } from '../../../core/services/generic.service';
import { DatosGraficaIncidencia } from '../../../shared/models/Incidencia';

Chart.register(ChartDataLabels); // registrar el plugin

interface PieChartRecord {
  estado: string;
  cantidad: number | null;
}


@Component({
  selector: 'app-home',
  imports: [MatCardModule, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: 'home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())]
})
export class HomeComponent implements OnInit {
  isBrowser = false;
  isLoading: boolean = false;
  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Evolución de Incidencias del Mes' },
      legend: { position: 'top' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Día del mes' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Cantidad' }
      }
    }
  };

  nombreMesActual: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private methodsService: GenericService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    /*
        setTimeout(() => {
          for (let d = 1; d <= 31; d++) {//diasEnMes
          datos.push({
            dia: d,
            resueltas: this.numeroAleatorio(5, 50),
            pendientes: this.numeroAleatorio(3, 12),
            finalizadas: this.numeroAleatorio(2, 10)
          });
        }
    
        // Filtrar solo hasta hoy
        const datosHastaHoy = datos.filter(d => d.dia <= 31);//hoy.getDate()
    
        // Preparar datos para Chart.js
        this.lineChartData = {
          labels: datosHastaHoy.map(d => `Día ${d.dia}`),
          datasets: [
            {
              data: datosHastaHoy.map(d => d.resueltas),
              label: 'Resueltas',
              borderColor: '#4caf50',
              fill: false,
              tension: 0.4
            },
            {
              data: datosHastaHoy.map(d => d.pendientes),
              label: 'Pendientes',
              borderColor: '#ff9800',
              fill: false,
              tension: 0.4
            },
            {
              data: datosHastaHoy.map(d => d.finalizadas),
              label: 'Finalizadas',
              borderColor: '#2196f3',
              fill: false,
              tension: 0.4
            }
          ]
        };
        this.isLoading=false;
        }, 1000);*/

    this.cargarDatos();


  }

  private numeroAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  cargarDatos() {
    this.isLoading = true;

    setTimeout(() => {


      //const diasEnMes = new Date(anio, mes + 1, 0).getDate(); // días del mes actual

      // this.nombreMesActual = hoy.toLocaleString('default', { month: 'long', year: 'numeric' });

      // Simular datos para todo el mes
      const datos: {
        dia: number,
        resueltas: number,
        pendientes: number,
        finalizadas: number
      }[] = [];


      this.methodsService.HttpPost('Incidencia/get-grafica-incidencia', {}, {}).subscribe({
        next: (response: any) => {

          const datosHastaHoy: DatosGraficaIncidencia[] = response;

          this.nombreMesActual = datosHastaHoy[0].Mes;

          const dias = [...new Set(datosHastaHoy.map(d => d.Dia))];
          const estatus = [...new Set(datosHastaHoy.map(d => d.Estatus))];

          const datasets = estatus.map(estatus => ({
            label: estatus,
            data: dias.map(dia => {
              const registro = datosHastaHoy.find(x => x.Dia === dia && x.Estatus === estatus);
              return registro ? registro.Total : 0;
            }),
            borderColor:
              estatus === 'FINALIZADO' ? '#4caf50' :
                estatus === 'PENDIENTE' ? '#ff9800' :
                  estatus === 'PROCESANDO' ? '#2196f3' :
                    '#9e9e9e',
            fill: false,
            tension: 0.4
          }));


          this.lineChartData = {
            labels: dias.map(d => `Día ${d}`),
            datasets
          };
        },
        error: (error) => {
          this.isLoading = false;
        }
      });

      this.isLoading = false;
    }, 1000);
  }


}
