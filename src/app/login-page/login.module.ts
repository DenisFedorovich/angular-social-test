import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginPageComponent } from "../login-page/login-page.component";
import { SharedModule } from "./../shared/shared.module";
import { AuthInterceprtor } from "../shared/interceptors/auth.interceptor";
import { LoaderService } from "../shared/services/loader.service";
import { LoaderInterceptor } from "../shared/interceptors/loader-interceptor.service";
import { AuthGuard } from "../admin/shared/services/auth.guard";

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceprtor,
}

@NgModule({
  declarations: [
    LoginPageComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '', component: LoginPageComponent,
    },
  ]),
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    INTERCEPTOR_PROVIDER,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ]
})

export class LoginModule {

}
