import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'combat-tile',
  templateUrl: './combat-tile.component.html',
  styleUrls: ['./combat-tile.component.css']
})
export class CombatTile implements OnInit {
  @Input()showType
  @Input()id
  @Input()engaging;
  @Input()farf;
  @Input()tileSize: string;
  constructor() {
    
  }

  ngOnInit() {
    console.log('combat tile size: ', this.tileSize)
    // console.log('this tiles showType is ', this.showType)
  }
  clickTile(){
    console.log('tile showtype is ', this.showType, this.id)
  }

}
