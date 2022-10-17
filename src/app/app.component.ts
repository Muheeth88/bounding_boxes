import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { coordinates } from 'src/assets/coordinates';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{

  @ViewChild('myCanvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  @ViewChild('baseImg', {static: false}) baseImg: ElementRef<HTMLImageElement>;
  @ViewChild('zoomIn', {static: false}) zoomIn: ElementRef<HTMLImageElement>;
  @ViewChild('zoomOut', {static: false}) zoomOut: ElementRef<HTMLImageElement>;

  defaultWidth: number = null;
  zoomingLevel: number = 1;
  sizeFactor: number = 1;

  x1: number;
  y1: number;
  width: number;
  height: number;
  
ngOnInit(): void {
  this.gettingCoordinates()
}

gettingCoordinates() {
  for(let i = 0; i < coordinates.length; i++) {
    this.x1 = coordinates[i].coordinates[0]
    this.y1 = coordinates[i].coordinates[1]
    this.width = coordinates[i].coordinates[2]
    this.height = coordinates[i].coordinates[3]
    console.log("coordinates are",this.x1, this.y1, this.width, this.height);
  }
}
  
 ngAfterViewInit(): void {
  this.ctx = this.canvas.nativeElement.getContext('2d');
  this.ctx.lineWidth = 2;
  this.ctx.strokeStyle = "blue"
  this.ctx.globalAlpha = 0.3;
  this.ctx.setLineDash([6]);

  // -------------------- To  view all bounding Boxes (static)
    for (let i = 0; i < coordinates.length; i++) {
      let obj = coordinates[i];
      this.ctx.fillRect(
        obj.coordinates[0] * this.sizeFactor,
        obj.coordinates[1] * this.sizeFactor,
        obj.coordinates[2] * this.sizeFactor,
        obj.coordinates[3] * this.sizeFactor);
    }
 }

 



drag: boolean = false;

rect = {
  startX: null,
  startY: null,
  width: null,
  height: null,
};

onMouseDown(event: any) {
  console.log("mouseDown>>>>>>>>", event);
  this.drag = true;
  this.rect.startX = (event.layerX); 
  this.rect.startY = (event.layerY); 
}

onMouseUp() {
  this.drag = false;
} 

onDblClick(){
  this.clearCanvas();
  this.drag = false;
}

selectedContent = []
selection: boolean = false;

onMouseMove(event:any) {
  if(this.drag) {
    this.rect.width = (event.layerX ) - this.rect.startX ;
    this.rect.height = (event.layerY) - this.rect.startY ;
    this.clearCanvas();
    this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height);
  }
    // if(this.drag) {
    //   this.rect.width = (event.layerX ) - this.rect.startX ;
    //   this.rect.height = (event.layerY) - this.rect.startY ;
    //   this.clearCanvas();
    //   this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height);
    //   this.selection = true;
    //   let count = 0 
    //   let result = []
    //   for( let i = 0; i < coordinates.length; i++ ) {
    //     let x1 = coordinates[i].coordinates[0]
    //     let y1 = coordinates[i].coordinates[1]
    //     let width = coordinates[i].coordinates[2]
    //     let height = coordinates[i].coordinates[3]
    //     if(
    //       x1 >= this.rect.startX && (x1 + width) <= (this.rect.startX + this.rect.width) &&
    //       y1 >= this.rect.startY && (y1 + height) <= (this.rect.startY + this.rect.height) 
    //     ) {
    //       this.ctx.fillRect(x1 * this.sizeFactor, y1 * this.sizeFactor, width * this.sizeFactor, height * this.sizeFactor);
    //       result[count]=coordinates[i].value;
    //       count++;
    //       this.selectedContent = result;
    //     }
    //   }
    //   console.log(">>>>>>>>>>>", this.selectedContent)
    // }  else if (!this.selection) {
    //   const rect = this.canvas.nativeElement.getBoundingClientRect();
    //   let mouseXcoordinates = ((event.clientX - rect.left) / (rect.right - rect.left)) * this.canvas.nativeElement.width;
    //   let mouseYcoordinates = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this.canvas.nativeElement.height;
    //   for (let i = 0; i < coordinates.length; i++) {
    //     let x1 = coordinates[i].coordinates[0]
    //     let y1 = coordinates[i].coordinates[1]
    //     let width = coordinates[i].coordinates[2]
    //     let height = coordinates[i].coordinates[3]
    //     if( 
    //       mouseXcoordinates >= x1 && mouseXcoordinates <= (x1 + width) &&
    //       mouseYcoordinates >= y1 && mouseYcoordinates <= (y1 + height) ) {
    //       this.ctx.clearRect( x1 * this.sizeFactor, y1 * this.sizeFactor, width * this.sizeFactor, height * this.sizeFactor)
    //       this.ctx.fillRect(x1 * this.sizeFactor, y1 * this.sizeFactor, width * this.sizeFactor, height * this.sizeFactor);
    //      } else {
    //       this.ctx.clearRect( x1 * this.sizeFactor, y1 * this.sizeFactor, width * this.sizeFactor, height * this.sizeFactor)
    //      }
    //   } 
    // }
}


handleZoomIn() {
  if( this.defaultWidth == null) {
    this.defaultWidth = this.baseImg.nativeElement.width;
  }
  this.zoomingLevel += 0.25;
  this.baseImg.nativeElement.width = this.defaultWidth * this.zoomingLevel;
  this.sizeFactor = this.zoomingLevel;
  console.log("sizeFactor", this.sizeFactor);
  this.clearCanvas()
  this.ngAfterViewInit()
}

handleZoomOut() {
  if( this.defaultWidth == null) {
    this.defaultWidth = this.baseImg.nativeElement.width;
  }
  this.zoomingLevel -= 0.25;
  this.baseImg.nativeElement.width = this.defaultWidth * this.zoomingLevel;
  this.sizeFactor = this.zoomingLevel;
  console.log("sizeFactor", this.sizeFactor);
  this.clearCanvas()
  this.ngAfterViewInit()
}

clearCanvas() {
  this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
}

}
