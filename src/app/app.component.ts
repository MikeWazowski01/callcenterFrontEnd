import { Component, OnInit } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private auth: AuthService,private router: Router){}
  title = 'call_center';

  ngOnInit(): void {
    if (this.auth.isTokenExpired()) {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }
   //  this.verificarYLimpiarDatosCorruptos();
  }

  /*async verificarYLimpiarDatosCorruptos() {
    try {
      // Intenta leer algún dato importante
      const raw = localStorage.getItem('tokenCallCenter');
      if (raw) {
        JSON.parse(raw); // Si está corrupto, lanzará error
      }
    } catch (error) {
      console.warn('Datos corruptos detectados. Limpiando todo el almacenamiento...', error);

      localStorage.clear();
      sessionStorage.clear();

      // Borrar IndexedDB
      const dbs = await indexedDB.databases?.();
      dbs?.forEach(db => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });

      // Borrar Cache
      const cachesKeys = await caches.keys();
      for (const key of cachesKeys) {
        await caches.delete(key);
      }

      // Recargar la app limpia
      location.reload();
    }
  }*/

}
