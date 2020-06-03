import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tile',
  template: `
    <div *ngIf='_overlay' class="tile-overlay" 
    [ngClass]='{
      duration3: _duration3,
      duration5: _duration5,
      duration6: _duration6,
      duration8: _duration8
    }'>
     ></div>
  `,
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  private _name = '';
  private _contains = '';
  private _overlay=false;
  private _begin=false;
  private _empty = true;
  private _duration3;
  private _duration5;
  private _duration6;
  private _duration8;

  public tileSize = 100;
  @Input()
  set name(name: string) {
    this._name = (name)
  }
 
  get name(): string { return this._name; }
  constructor() { 
  }
  
  @Input()
  set contains(contents: string) {
    this._contains = (contents)
  }
 
  get contains(): string { return this._contains; }
  
  @Input()
  set empty(empty: boolean) {
    this._empty = (empty)  
  }
 
  get empty(): boolean { return this._empty; }

  @Input()
  set overlay(overlay: boolean) {
    this._overlay = (overlay)  
  }
 
  get overlay(): boolean { return this._overlay; }

  @Input()
  set begin(begin: boolean) {
    this._begin = (begin)  
  }
 
  get begin(): boolean { return this._begin; }

  @Input()
  set duration3(duration3: boolean) {
    this._duration3 = (duration3)  
  }
  get duration3(): boolean { return this._duration3; }

  @Input()
  set duration5(duration5: boolean) {
    this._duration5 = (duration5)  
  }
  get duration5(): boolean { return this._duration5; }

  @Input()
  set duration6(duration6: boolean) {
    this._duration6 = (duration6)  
  }
  get duration6(): boolean { return this._duration6; }

  @Input()
  set duration8(duration8: boolean) {
    this._duration8 = (duration8)  
  }
  get duration8(): boolean { return this._duration8; }

  ngOnInit() {
    console.log(this.tileSize)
  }

}
