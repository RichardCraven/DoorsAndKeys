import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'death-screen',
  templateUrl: './death-screen.component.html',
  styleUrls: ['./death-screen.component.css']
})
export class DeathScreenComponent implements OnInit {
  showLine1 = false;
  showLine2 = false;
  showLine3 = false;
  showLine4 = false;
  constructor() { }

  ngOnInit() {
    let that = this;
    setTimeout(() => {
      document.getElementById('hikaron').style.opacity = '1'
      setTimeout(()=>{
        that.beginSequence()
      },750)
    },200)
  }
  beginSequence(){
    const that = this;
    setTimeout(()=>{
      that.showLine1 = true;

      setTimeout(()=>{
        that.showLine2 = true;

        setTimeout(()=>{
          that.showLine3 = true;

            setTimeout(()=>{
              that.showLine4 = true;

              setTimeout(()=>{
                document.getElementsByClassName('replay-button')[0].classList.add('show')
              }, 950)

            }, 1750)

        }, 2000)

      }, 1000)

    }, 750)
  }
  replay(){
    location.reload()
  }
}
