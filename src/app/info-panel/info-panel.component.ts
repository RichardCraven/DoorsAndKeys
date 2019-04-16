import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import {PlayerManagerService} from '../services/player-manager.service'

@Component({
  selector: 'info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit, AfterViewInit {
  private message : string;
  private adjacency = true;
  public item = '';
  public showItemOption: boolean = false;;
  private buttonSubject = new Subject<any>();
  tile = {};
  messageSubscription: Subscription;
  itemSubscription: Subscription;
  constructor(public playerManager: PlayerManagerService) {
    this.playerManager.getPlayerMessages().subscribe(res => {
      
      this.message = res.msg

      if(res.monster){
      }
    })
    
   }

  ngOnInit() {
    this.message = 'Ahoy!'
  }
  ngAfterViewInit(){
    this.playerManager.getItem().subscribe(res => {
      if(!res.clear){
        this.showItem(res.item)
        // this.showItemOption = true;
        
        // this.item = res.item
        // this.tile = {}
        // this.tile[res.item] = true;
      } else  {
        // this.showItemOption = false;
        this.hideItem();
      }
    })
  }
  displayMessage(msg, type = 'general'){
    this.message = msg
  }
  displayItem(item){
    this.item = item
  }
  startButton(){
    this.playerManager.startTurn()
  }
  showItem(item){
    setTimeout(() => {
      this.showItemOption = true;
    });
        
    this.item = item
    this.tile = {}
    this.tile[item] = true;
  }
  hideItem(){
    setTimeout(() => {
      this.showItemOption = false;
    });
  }
}
