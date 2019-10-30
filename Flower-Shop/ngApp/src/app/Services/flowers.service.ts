import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Flower } from "../Models/Flower.model";
import { BoughtFlower } from "../Models/BoughtFlower.model";

@Injectable({
  providedIn: 'root'
})
export class FlowersService {
  private flowers: Flower[] = [];
  private flowersUpdated = new Subject<Flower[]>();
  private BoughtFlowers: BoughtFlower[] = [];
  private BF: BoughtFlower[] = [];
  private boughtFlowersUpdated = new Subject<BoughtFlower[]>();
  private FlowerURL = "http://localhost:8080/api/";
  private BoughtFlowerURL = "http://localhost:8080/api/";

  constructor(private http: HttpClient, private router: Router) {}

  getFlowers() {
    this.http
      .get<{ message: string; flowers: any }>(`${this.FlowerURL}flowers`)
      .pipe(
        map(flowerData => {
          return flowerData.flowers.map(flower => {
            return {
              id: flower._id,
              name: flower.name,
              imagePath: flower.imagePath,
              arrivalDate: flower.arrivalDate,
              bloomPrice: flower.bloomPrice
            };
          });
        })
      )
      .subscribe(transformedFlowerss => {
        this.flowers = transformedFlowerss;
        this.flowersUpdated.next([...this.flowers]);
      });
  }

  getFlowersUpdateListener() {
    return this.flowersUpdated.asObservable();
  }

  getFlower(id: string) {
    return this.http.get<{ _id: string, name: string, imagePath: string, arrivalDate: string, bloomPrice: string }>(
      `${this.FlowerURL}flower/${id}`
    );
  }

  searchFlowerName(name){
    console.log("hii from name search");
    this.flowers=[];
    this.http
      .get<{ message: string; flowers: any }>(`${this.FlowerURL}searchN/${name}`)
      .pipe(map((flowerData) => {
        return flowerData.flowers.map(flower => {
          return {
            id: flower._id,
            name: flower.name,
            imagePath: flower.imagePath,
            arrivalDate: flower.arrivalDate,
            bloomPrice: flower.bloomPrice
          };
        });
      }))
      .subscribe(returnedFlowers => {
        this.flowers = returnedFlowers;
        this.flowersUpdated.next([...this.flowers]);
      });
  }

  searchFlowerPrice(bloomPrice){
    this.flowers=[];
    this.http
      .get<{ message: string; flowers: any }>(`${this.FlowerURL}searchP/${bloomPrice}`)
      .pipe(map((flowerData) => {
        return flowerData.flowers.map(flower => {
          return {
            id: flower._id,
            name: flower.name,
            imagePath: flower.imagePath,
            arrivalDate: flower.arrivalDate,
            bloomPrice: flower.bloomPrice
          };
        });
      }))
      .subscribe(returnedFlowers => {
        this.flowers = returnedFlowers;
        this.flowersUpdated.next([...this.flowers]);
      });
  }

  addFlower(name: string, image: File, arrivalDate: string, bloomPrice:string) {
    const flowerData  = new FormData();
    flowerData.append("name", name);
    flowerData.append("image", image, name);
    flowerData.append("arrivalDate", arrivalDate );
    flowerData.append("bloomPrice", bloomPrice);
    this.http
      .post<{ message: string; flower: Flower }>(
        this.FlowerURL+"flower",
        flowerData
      )
      .subscribe(responseData => {
        const flower: Flower = {
          id: responseData.flower.id,
          name: name,
          imagePath: responseData.flower.imagePath,
          arrivalDate: arrivalDate,
          bloomPrice: bloomPrice
        };
        console.log(flower);
        this.flowers.push(flower);
        this.flowersUpdated.next([...this.flowers]);
        this.router.navigate(["/ListFlowers"]);
      });
  }

  updateFlower(id: string, name:string, image: File | string , arrivalDate: string, bloomPrice:string) {
    let flowerData: Flower | FormData;
    if (typeof image === "object") {
      flowerData = new FormData();
      flowerData.append("id", id);
      flowerData.append("name", name);
      flowerData.append("image", image, name);
      flowerData.append("arrivalDate", arrivalDate );
      flowerData.append("bloomPrice", bloomPrice);
    } else {
      flowerData = {
        id: id,
        name: name,
        imagePath: image,
        arrivalDate: arrivalDate,
        bloomPrice: bloomPrice
      };
    }
    this.http
      .put(`${this.FlowerURL}flower/${id}`, flowerData)
      .subscribe(response => {
        const updatedFlowers = [...this.flowers];
        const oldFlowerIndex = updatedFlowers.findIndex(f => f.id === id);
        const flower: Flower = {
          id: id,
          name: name,
          imagePath: "",
          arrivalDate: arrivalDate,
          bloomPrice: bloomPrice
        };
        updatedFlowers[oldFlowerIndex] = flower;
        this.flowers = updatedFlowers;
        this.flowersUpdated.next([...this.flowers]);
        this.router.navigate(["/ListFlowers"]);
      });
  }

  deleteFlower(flowerId: string) {
    this.http
      .delete(`${this.FlowerURL}flower/${flowerId}`)
      .subscribe(() => {
        const updatedFlowers = this.flowers.filter(flower => flower.id !== flowerId);
        this.flowers = updatedFlowers;
        this.flowersUpdated.next([...this.flowers]);
      });
  }

  //Bought Flower Data

  addBoughtFlower(flowersPrice:number, flowerAmoumt:number, name: string, imagePath: string, arrivalDate: string, bloomPrice:string) {
    // let flowersprice = flowersPrice.toString();
    // let floweramoumt = flowerAmoumt.toString();
    // const BoughtFlower  = new FormData();
    // BoughtFlower.append("flowerAmoumt", flowersprice);
    // BoughtFlower.append("flowersPrice", floweramoumt);
    // BoughtFlower.append("name", name);
    // BoughtFlower.append("imagePath", imagePath);
    // BoughtFlower.append("arrivalDate", arrivalDate );
    // BoughtFlower.append("bloomPrice", bloomPrice);
    // console.log(BoughtFlower.get("flowerAmoumt"));
    // console.log(BoughtFlower.get("flowersPrice"));
    // console.log(BoughtFlower.get("name"));
    // console.log(BoughtFlower.get("imagePath"));
    // console.log(BoughtFlower.get("arrivalDate"));
    // console.log(BoughtFlower.get("bloomPrice"));
    let BoughtFlower: BoughtFlower = {
      id: null,
      flowerAmoumt: flowerAmoumt,
      flowersPrice: flowersPrice,
      name: name,
      imagePath: imagePath,
      arrivalDate: arrivalDate,
      bloomPrice: bloomPrice,
      buyer: null
    };
    this.http
      .post<{ message: string; boughtflower: BoughtFlower; id: string }>(
        this.BoughtFlowerURL+"boughtFlower",
        BoughtFlower
      )
      .subscribe(responseData => {
        const boughtFlower: BoughtFlower = {
          id: responseData.id,
          flowerAmoumt: responseData.boughtflower.flowerAmoumt,
          flowersPrice: responseData.boughtflower.flowersPrice,
          name: responseData.boughtflower.name,
          imagePath: responseData.boughtflower.imagePath,
          arrivalDate: responseData.boughtflower.arrivalDate,
          bloomPrice: responseData.boughtflower.bloomPrice,
          buyer: responseData.boughtflower.buyer
        };
        console.log(boughtFlower);
        this.BoughtFlowers.push(boughtFlower);
        this.boughtFlowersUpdated.next([...this.BoughtFlowers]);
      });
  }

  getBoughtFlowers() {
    this.http
      .get<{ message: string; boughtflowers: any }>(`${this.BoughtFlowerURL}boughtFlowers`)
      .pipe(
        map(boughtflowerData => {
          return boughtflowerData.boughtflowers.map(boughtflower => {
            return {
              id: boughtflower._id,
              flowerAmoumt:boughtflower.flowerAmoumt,
              flowersPrice :boughtflower.flowersPrice,
              name: boughtflower.name,
              imagePath: boughtflower.imagePath,
              arrivalDate: boughtflower.arrivalDate,
              bloomPrice: boughtflower.bloomPrice,
              buyer: boughtflower.buyer
            };
          });
        })
      )
      .subscribe(transformedBoughtFlowers => {
        this.BoughtFlowers = transformedBoughtFlowers;
        this.boughtFlowersUpdated.next([...this.BoughtFlowers]);
      });
  }

  getBoughtFlowersUpdateListener() {
    return this.boughtFlowersUpdated.asObservable();
  }

  deleteBoughtFlower(id: string){
    this.http
      .delete(`${this.BoughtFlowerURL}boughtFlower/${id}`)
      .subscribe(() => {
        const updatedBoughtFlowers = this.BoughtFlowers.filter(boughtflower => boughtflower.id !== id);
        this.BoughtFlowers = updatedBoughtFlowers;
        this.boughtFlowersUpdated.next([...this.BoughtFlowers]);
      });
  }
}



