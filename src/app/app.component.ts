import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DoorsAndKeys';

  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) { 
  //   console.log('k',event.key);
    
  // }
}
