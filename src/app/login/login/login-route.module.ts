import { ModuleWithProviders  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginModule } from './login.module';


const routes: Routes = [

    {  path: '', component: LoginComponent }
];

export const loginRoutes: ModuleWithProviders<LoginModule> = RouterModule.forChild(routes);
