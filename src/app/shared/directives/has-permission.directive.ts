import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  private elBotonYaSeMostro = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appHasPermission(permiso: string) {
  
    // 1. Le preguntamos al AuthService si el array tiene este permiso
    const tieneAcceso = this.authService.tienePermiso(permiso);

    // 2. Si tiene permiso y el botón no está en pantalla, lo creamos
    if (tieneAcceso && !this.elBotonYaSeMostro) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.elBotonYaSeMostro = true;
    }
    // 3. Si no tiene permiso, destruimos el elemento del DOM completamente
    else if (!tieneAcceso) {
      this.viewContainer.clear();
      this.elBotonYaSeMostro = false;
    }
  }

}
