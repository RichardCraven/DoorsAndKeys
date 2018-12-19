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
  private buttonSubject = new Subject<any>();
  messageSubscription: Subscription;
  constructor(public playerManager: PlayerManagerService) {
    this.playerManager.getPlayerMessages().subscribe(res => {
      
      // console.log('resss is ', res);
      this.message = res.msg

      if(res.monster){
        // console.log('IT WORKED!', res.monster)
      }
    })
   }

  ngOnInit() {
    this.message = 'Ahoy!'
  }
  displayMessage(msg, type = 'general'){
    this.message = msg
  }
  // getButtonPresses(): Observable<any>{
  //   return this.buttonSubject.asObservable()
  // }
  startButton(){
    this.playerManager.startTurn()
    // this.buttonSubject.next('start')
  }
}
