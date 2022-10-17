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

  baseCoordinates = []
  
ngOnInit(): void {
  this.baseCoordinates = coordinates
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
      this.ctx.fillRect(obj.coordinates[0]*this.sizeFactor,obj.coordinates[1]*this.sizeFactor,obj.coordinates[2]*this.sizeFactor,obj.coordinates[3]*this.sizeFactor);
    }

    let defaultWidth = this.baseImg.nativeElement.width
    console.log("local width", defaultWidth);
 }

 defaultWidth: number = null;
 zoomingLevel: number = 1;
 sizeFactor: number = 1;

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

clearCanvas() {
  this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
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
  this.drag = false
} 

onDblClick(){
  this.clearCanvas();
  this.drag = false;
}

onMouseMove(event:any) {
    if(this.drag) {
      this.rect.width = (event.layerX ) - this.rect.startX ;
      this.rect.height = (event.layerY) - this.rect.startY ;
      this.clearCanvas();
      this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height);
    }
}





}
