import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-admin-panal',
  templateUrl: './admin-panal.component.html',
  styleUrls: ['./admin-panal.component.scss']
})
export class AdminPanalComponent implements OnInit {

  accordionExpended=false;
  constructor(private authservice : AuthService) { }

  ngOnInit() {
    
  }

  adminLogin(){
    this.authservice.adminLogout();
  }

}
