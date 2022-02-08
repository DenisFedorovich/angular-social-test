import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./../shared/shared.module";
import { HomePageComponent } from "./users-page/home-page/home-page.component";
import { UsersPageComponent } from "./users-page/users-page/users-page.component";
import { UserComponent } from "./user/user.component";

@NgModule({
  declarations: [
    HomePageComponent,
    UsersPageComponent,
    UserComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: HomePageComponent
      },
      {
        path: 'user/:id', component: UsersPageComponent
      },
    ]),
  ],
  exports: [
    RouterModule,
    HomePageComponent,
    UsersPageComponent,
    UserComponent,
  ],
  providers: []
})

export class UserModule { }
