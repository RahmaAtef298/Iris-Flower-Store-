import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FlowersService } from "../Services/flowers.service";
import { BoughtFlower } from "../Models/BoughtFlower.model";
import { AuthService } from '../Services/auth.service';
import { User } from '../Models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  isLoading = false;
  boughtFlowers: BoughtFlower[] = [];
  private boughtFlowersSub: Subscription;
  loginForm: FormGroup;
  signupForm: FormGroup;
  ModalRef: BsModalRef;
  user: User;
  username: string ;
  userId: string ;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(public flowersService: FlowersService, private ModalService: BsModalService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
       //Get Name of User
    this.username = localStorage.getItem("nameOfUser");
       //Get Bought Flowers data
    this.flowersService.getBoughtFlowers();
    this.userId = this.authService.getUserId();
    console.log(this.boughtFlowers);
    this.boughtFlowersSub = this.flowersService.getBoughtFlowersUpdateListener()
      .subscribe((boughtflowers: BoughtFlower[]) => {
        this.isLoading = false;
        this.boughtFlowers = boughtflowers;
      });
      //login Form
    this.loginForm = new FormGroup({
        email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
        password: new FormControl(null, { validators: [Validators.required ]}),
      });
      //Signup Form
    this.signupForm = new FormGroup({
        username: new FormControl(null, {validators: [Validators.required]}),
        email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
        password: new FormControl(null, { validators: [Validators.required ]}),
      });
    
      //Authentication Data
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  openModal(template : TemplateRef<any>){
    this.ModalRef = this.ModalService.show(template);
  }

  onDelete(id:string){
    this.flowersService.deleteBoughtFlower(id);
  }

  login(){
    this.authService.getUser(this.loginForm.value.email).subscribe(userData => {
      this.user = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };
      localStorage.setItem("nameOfUser", this.user.username);
      console.log(this.user);
      if (this.loginForm.invalid) {
        return;
      }
      this.isLoading = true;
      this.authService.login(this.user.username,this.loginForm.value.email, this.loginForm.value.password);
      console.log(this.loginForm.value);
    });
    location.reload();
    this.ModalRef.hide()
  }

  signup(){
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.signupForm.value.username,this.signupForm.value.email, this.signupForm.value.password);
    }
    this.ModalRef.hide()
  }

  Logout(){
    localStorage.removeItem("nameOfUser");
    this.authService.logout();
  }

  ngOnDestroy() {
    this.boughtFlowersSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
