import { loginRoutes } from './login-route.module';
import { LoginComponent } from './login.component';
import { NgModule } from "@angular/core";


@NgModule({
    declarations: [LoginComponent],
    imports: [loginRoutes],
    exports: [LoginComponent]
})

export class LoginModule { }