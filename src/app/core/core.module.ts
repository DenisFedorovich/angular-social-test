import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./../shared/shared.module";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from "./footer/footer.component";
import { MyLoaderComponent } from "../shared/components/my-loader/my-loader.component";
import { AuthInterceprtor } from "../shared/interceptors/auth.interceptor";
import { LoaderService } from "../shared/services/loader.service";
import { LoaderInterceptor } from "../shared/interceptors/loader-interceptor.service";

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceprtor,
}

@NgModule({
  declarations: [
    HeaderComponent,
    MyLoaderComponent,
    FooterComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [RouterModule,
    HeaderComponent,
    MyLoaderComponent,
    FooterComponent,
  ],
  providers: [
    INTERCEPTOR_PROVIDER,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ]
})

export class CoreModule {}
