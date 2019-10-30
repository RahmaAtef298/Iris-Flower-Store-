import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FlowersService } from "../../Services/flowers.service";
import { Flower } from "../../Models/Flower.model";
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit,OnDestroy {

  flowers: Flower[] = [];
  isLoading = false;
  form: FormGroup;
  searchText;
  ModalRef:BsModalRef;
  private flowersSub: Subscription;
  boughtFlower : Flower;
  //Authentication Properities
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(public flowersService: FlowersService, private ModalService: BsModalService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.flowersService.getFlowers();
    this.flowersSub = this.flowersService.getFlowersUpdateListener()
      .subscribe((flowers: Flower[]) => {
        this.isLoading = false;
        this.flowers = flowers;
      });
      //Search Form
    this.form = new FormGroup({
        name: new FormControl(null, {
          validators: [Validators.required]
        }),
        bloomPrice: new FormControl(null, { validators: [Validators.required ]}),
      });
      //Authentication Data
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  }

  searchFlowerName($event){
    let n = $event.target.value
    console.log("hii ");
    this.flowersService.searchFlowerName(n);
    this.form.reset();
  }

  searchFlowerPrice(){
    this.flowersService.searchFlowerPrice(this.form.value.bloomPrice);
    this.form.reset();
    console.log(this.form.value.bloomPrice)
  }

  openModal(template : TemplateRef<any>,flower : Flower){
    this.boughtFlower = flower ;
    this.ModalRef = this.ModalService.show(template);
  }

  sendflower(flowerAmount){
    if(flowerAmount.value){
      console.log(flowerAmount.value);
      let floweramoumt = parseInt(flowerAmount.value);
      let bloomprice = parseInt(this.boughtFlower.bloomPrice) ; 
      let FlowersPrice = floweramoumt * bloomprice;
      console.log(FlowersPrice);
      this.flowersService.addBoughtFlower(FlowersPrice,floweramoumt,this.boughtFlower.name,this.boughtFlower.imagePath,this.boughtFlower.arrivalDate,this.boughtFlower.bloomPrice);
      this.ModalRef.hide();
      console.log(FlowersPrice,floweramoumt,this.boughtFlower.name,this.boughtFlower.imagePath,this.boughtFlower.arrivalDate,this.boughtFlower.bloomPrice);
      location.reload();
    }
    
  }

  ngOnDestroy() {
    this.flowersSub.unsubscribe();
  }

}
