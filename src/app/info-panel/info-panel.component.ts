import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import {PlayerManagerService} from '../services/player-manager.service'

@Component({
  selector: 'info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  private message : string;
  private adjacency = true;
  public item = '';
  public showItemOption = false;
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
    this.playerManager.getItem().subscribe(res => {
      console.log('in get item');
      if(!res.clear){
        this.showItemOption = true;
        
        this.item = res.item
        this.tile = {}
        this.tile[res.item] = true;
      } else  {
        this.showItemOption = false;
      }
    })
   }

  ngOnInit() {
    this.message = 'Ahoy!'
  }
  displayMessage(msg, type = 'general'){
    this.message = msg
  }
  displayItem(item){
    this.item = item
  }
  // getButtonPresses(): Observable<any>{
  //   return this.buttonSubject.asObservable()
  // }
  startButton(){
    this.playerManager.startTurn()
    // this.buttonSubject.next('start')
  }
}
