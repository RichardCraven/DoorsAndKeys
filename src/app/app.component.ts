import { Component, OnInit, HostListener } from '@angular/core';
import {PlayerManagerService} from '../app/services/player-manager.service';
import { Subscription, Observable, Subject, interval, timer } from 'rxjs';
import {
  delay,
  mapTo,
  takeWhile,
  switchMapTo,
  concatAll,
  count,
  scan,
  withLatestFrom,
  share
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'DoorsAndKeys';
  showInfo = true;
  showMainBoard = true;
  showDeathScreen = false;
  constructor(public playerManager : PlayerManagerService){

  }
  ngOnInit(){
    this.playerManager.getGlobalMessages().subscribe(res => {
      // this.showInfo = false;
      if(res.item){
        this.showInfo = true;
      } else {
        // this.showInfo = false;
      }
      if(res.showDeathScreen){
        this.showMainBoard = false;
        this.showDeathScreen = true;
      }
      // this.handlePlayerServiceSubscription(res)
    })

  }
  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) { 
  //   console.log('k',event.key);
    
  // }

}
