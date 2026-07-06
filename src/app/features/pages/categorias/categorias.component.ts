import { Component } from '@angular/core';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  titulo = 'Agregar Categoria';

  closeDialog() {
    throw new Error('Method not implemented.');
  }

}
