import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';

@Component({
  selector: 'app-confirmar',
  imports: [MatIconModule, MatToolbarModule, MatDialogModule, ToolbarComponent],
  templateUrl: './confirmar.component.html',
  styleUrl: './confirmar.component.css'
})
export class ConfirmarComponent implements OnInit {
  titulo: string = 'Confirmar';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBarRef: MatDialogRef<ConfirmarComponent>
  ) { }
  ngOnInit(): void {

  }
  closeDialog() {
    this.snackBarRef.close('close');
  }

}
