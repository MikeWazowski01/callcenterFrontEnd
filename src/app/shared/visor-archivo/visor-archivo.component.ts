import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';

@Component({
  selector: 'app-visor-archivo',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatToolbarModule, ToolbarComponent],
  templateUrl: './visor-archivo.component.html',
  styleUrl: './visor-archivo.component.css'
})
export class VisorArchivoComponent {
  safeUrl: SafeResourceUrl;
  audio: HTMLAudioElement;

  titulo: string = 'Visualizador';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    public snackBarRef: MatDialogRef<VisorArchivoComponent>
  ) {

    this.audio = new Audio();

    if (data.Tipo.includes('audio')) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(data.Url);
      /* console.log('audio')
       this.audio = new Audio(data.Url);
       this.audio.play();*/
    } else {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.Url);
    }
    /* this.audio = new Audio(data.Url);
     this.audio.play();*/





  }

  closeDialog() {
    this.snackBarRef.close('close');
  }
}
