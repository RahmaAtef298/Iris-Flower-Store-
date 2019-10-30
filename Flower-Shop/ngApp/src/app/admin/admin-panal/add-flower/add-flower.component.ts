import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable, Observer, of } from "rxjs";

import { FlowersService } from "../../../Services/flowers.service";
import { Flower } from "../../../Models/Flower.model";

@Component({
  selector: 'app-add-flower',
  templateUrl: './add-flower.component.html',
  styleUrls: ['./add-flower.component.scss']
})
export class AddFlowerComponent implements OnInit {

  flower: Flower;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private flowerId: string;

  constructor(public flowersService: FlowersService,public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [this.mimeType]
      }),
      arrivalDate: new FormControl(null, { validators: [Validators.required] }),
      bloomPrice: new FormControl(null, { validators: [Validators.required, Validators.min(1)] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("flowerId")) {
        this.mode = "edit";
        this.flowerId = paramMap.get("flowerId");
        this.isLoading = true;
        this.flowersService.getFlower(this.flowerId).subscribe(flowerData => {
          this.isLoading = false;
          this.flower = {
            id: flowerData._id,
            name: flowerData.name,
            imagePath: flowerData.imagePath,
            arrivalDate: flowerData.arrivalDate,
            bloomPrice: flowerData.bloomPrice
          };
          this.form.setValue({
            name: this.flower.name,
            image: this.flower.imagePath,
            arrivalDate: this.flower.arrivalDate,
            bloomPrice: this.flower.bloomPrice
          });
        });
      } else {
        this.mode = "create";
        this.flowerId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      console.log(typeof(reader.result));
      this.imagePreview = reader.result as string ;
    };
    reader.readAsDataURL(file);
  }

  onSaveFlower() {
    console.log(this.form.value.image);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.flowersService.addFlower(
        this.form.value.name,
        this.form.value.image,
        this.form.value.arrivalDate,
        this.form.value.bloomPrice
      );
    } else {
      this.flowersService.updateFlower(
        this.flowerId,
        this.form.value.name,
        this.form.value.image,
        this.form.value.arrivalDate,
        this.form.value.bloomPrice
      );
    }
    this.form.reset();
  }

  mimeType = (
    control: AbstractControl
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof(control.value) === 'string') {
      return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create(
      (observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
          const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
          let header = "";
          let isValid = false;
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false; // Or you can use the blob.type as fallback
              break;
          }
          if (isValid) {
            observer.next(null);
          } else {
            observer.next({ invalidMimeType: true });
          }
          observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
      }
    );
    return frObs;
  };

}
