import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppTrackComponent } from './app-track/app-track.component';
import { AppCreateSegmentComponent } from './app-create-segment/app-create-segment.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { PopupComponent } from './popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PushPopupComponent } from './push-popup/push-popup.component';
import { GroupComponent } from './group-component/group-component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DlSystemComponent } from './dl-system/dl-system.component';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectFilterModule } from 'mat-select-filter';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonServiceService } from './services/common-service.service';

import { BroadcastService, MsalGuard, MsalInterceptor, MsalService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR } from '@azure/msal-angular';
import { MSALAngularConfigFactory, msalConfigFactory } from './login/login/msalConfig';







@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppTrackComponent,
    AppCreateSegmentComponent,
    PopupComponent,
    PushPopupComponent,
    GroupComponent,
    DlSystemComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule, FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,

    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatGridListModule,

    MatAutocompleteModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSortModule,
    MatSelectFilterModule,
    HttpClientModule
  ],
  providers: [
    CommonServiceService,
    BroadcastService,
    MsalService,
    MsalGuard,
    {
      provide: MSAL_CONFIG,
      useValue: msalConfigFactory()
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useValue: MSALAngularConfigFactory()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
