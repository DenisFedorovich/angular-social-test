import { NgModule } from '@angular/core'
import { PreloadAllModules, PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./user/user.module').then(x => x.UserModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login-page/login.module').then(x => x.LoginModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { preloadingStrategy: PreloadAllModules }
  )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
