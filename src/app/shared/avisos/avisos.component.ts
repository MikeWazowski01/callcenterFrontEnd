import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.css'
})
export class AvisosComponent {
  aviso:string= '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }
}
