import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  adminLoginForm: FormGroup;

  constructor( private authservice : AuthService) { }

  ngOnInit() {
    this.adminLoginForm = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, { validators: [Validators.required ]}),
    });
  }

  adminLogin(){
    console.log(this.adminLoginForm.value);
    if (this.adminLoginForm.valid) {
      if (this.adminLoginForm.value.email == "rahmaroma158@gmail.com" && this.adminLoginForm.value.password == "0123456789") {
        this.authservice.adminLogin(this.adminLoginForm.value.email,this.adminLoginForm.value.password);
      }
      else{
        alert("Password or Email incorrect");
      }
    }
  }

}
