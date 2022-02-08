import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "./shared/services/auth.guard";
import { CreatePageComponent } from "./create-page/create-page.component";
import { EditPageComponent } from "./edit-page/edit-page.component";
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    CreatePageComponent,
    DashboardPageComponent,
    EditPageComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'dashboard' },
      {
        path: 'createuser', component: CreatePageComponent, canActivate: [AuthGuard]
      },
      {
        path: 'user/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]
      },
      {
        path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]
      }]),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard,
  ]
})

export class AdminModule { }

