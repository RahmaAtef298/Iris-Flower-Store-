import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminPanalComponent } from './admin/admin-panal/admin-panal.component';
import { AdminHomeComponent } from './admin/admin-panal/admin-home/admin-home.component';
import { ListFlowersComponent } from './admin/admin-panal/list-flowers/list-flowers.component';
import { AddFlowerComponent } from './admin/admin-panal/add-flower/add-flower.component';
import { HomeComponent } from './main/home/home.component';
import { GalleryComponent } from './main/gallery/gallery.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { ContactUsComponent } from './main/contact-us/contact-us.component';
import { MainComponent } from './main/main.component';
import { AuthInterceptor } from './Services/token-intercepter.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    ListFlowersComponent,
    AddFlowerComponent,
    HomeComponent,
    GalleryComponent,
    AboutUsComponent,
    ContactUsComponent,
    AdminPanalComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgbModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
