import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { FlowersService } from "../../../Services/flowers.service";
import { Flower } from "../../../Models/Flower.model";

@Component({
  selector: 'app-list-flowers',
  templateUrl: './list-flowers.component.html',
  styleUrls: ['./list-flowers.component.scss']
})
export class ListFlowersComponent implements OnInit, OnDestroy {
  flowers: Flower[] = [];
  isLoading = false;
  private flowersSub: Subscription;

  constructor(public flowersService: FlowersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.flowersService.getFlowers();
    this.flowersSub = this.flowersService.getFlowersUpdateListener()
      .subscribe((flowers: Flower[]) => {
        this.isLoading = false;
        this.flowers = flowers;
      });
  }

  onDelete(flowerId: string) {
    this.flowersService.deleteFlower(flowerId);
  }

  ngOnDestroy() {
    this.flowersSub.unsubscribe();
  }
}