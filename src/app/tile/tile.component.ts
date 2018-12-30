import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tile',
  template: `
    <div *ngIf='_overlay'  class="tile-overlay"></div>
  `,
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  private _name = '';
  private _contains = '';
  private _overlay=false;
  private _empty = true;
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

  ngOnInit() {
  }

}
