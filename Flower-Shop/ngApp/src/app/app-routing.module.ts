import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminPanalComponent } from './admin/admin-panal/admin-panal.component';
import { AdminHomeComponent } from './admin/admin-panal/admin-home/admin-home.component';
import { ListFlowersComponent } from './admin/admin-panal/list-flowers/list-flowers.component';
import { AddFlowerComponent } from './admin/admin-panal/add-flower/add-flower.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { GalleryComponent } from './main/gallery/gallery.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { ContactUsComponent } from './main/contact-us/contact-us.component';
import { AuthGuard } from './Services/auth.guard';
import { AdminAuthGuard } from './Services/admin-auth.guard';

const routes: Routes = [
  { path: '', component: MainComponent , children :[
    { path: '' , redirectTo: '/Home', pathMatch: 'full'},
    { path: 'Home' , component: HomeComponent},
    { path: 'Gallery' , component: GalleryComponent},
    { path: 'AboutUs' , component: AboutUsComponent},
    { path: 'ContactUs' , component: ContactUsComponent}
  ]},
  { path: '', component: AdminPanalComponent , children :[
    { path: '' , redirectTo: '/AdminHome', pathMatch: 'full'},
    { path: 'AdminHome' , component: AdminHomeComponent, canActivate: [AdminAuthGuard] },
    { path: 'ListFlowers' , component: ListFlowersComponent, canActivate: [AdminAuthGuard] },
    { path: 'AddFlower' , component: AddFlowerComponent, canActivate: [AdminAuthGuard] },
    { path: 'EditFlower/:flowerId', component: AddFlowerComponent, canActivate: [AdminAuthGuard] },
  ]},
  { path: 'AdminLogin' , component: AdminLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminAuthGuard]
})
export class AppRoutingModule { }
