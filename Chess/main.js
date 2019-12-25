"use strict";

const CANVAS = document.querySelector('canvas');
const CONTEXT = CANVAS.getContext('2d');

const COLORS = ['#F00','#FF0']; // ['red','yellow']
let currentColor = COLORS[0];

const WIDTH = CANVAS.width;
const HEIGHT = CANVAS.height;

function scaleImageData(imageData, scale) {
  var scaled = CONTEXT.createImageData(imageData.width * scale, imageData.height * scale);

  for(var row = 0; row < imageData.height; row++) {
    for(var col = 0; col < imageData.width; col++) {
      var sourcePixel = [
        imageData.data[(row * imageData.width + col) * 4 + 0],
        imageData.data[(row * imageData.width + col) * 4 + 1],
        imageData.data[(row * imageData.width + col) * 4 + 2],
        imageData.data[(row * imageData.width + col) * 4 + 3]
      ];
      for(var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        for(var x = 0; x < scale; x++) {
          var destCol = col * scale + x;
          for(var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }

  return scaled;
}

const SQUARE = {
  WIDTH: 80,
  HEIGHT: 80
}

class Piece {
  constructor(x,y,color,bgcolor) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.bgcolor = bgcolor;
  }
  drawItself() {
    let imageData = CONTEXT.createImageData(8,8);
    for(let i = 0; i < imageData.data.length; i += 4) {
      if(this.color === 'white') {
        if(this.template[i/4] === 0) {
          if(this.bgcolor === 'white') {
            imageData.data[i + 0] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
          } else if(this.bgcolor === 'black') {
            imageData.data[i + 0] = 255;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
          }
        } else if(this.template[i/4] === 1) {
            imageData.data[i + 0] = 120;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 60;
            imageData.data[i + 3] = 255;
          }
      } else if(this.color === 'black') {
        if(this.template[i/4] === 0) {
          if(this.bgcolor === 'white') {
            imageData.data[i + 0] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
          } else if(this.bgcolor === 'black') {
            imageData.data[i + 0] = 255;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
          }
        } else if(this.template[i/4] === 1) {
          imageData.data[i + 0] = 0;
          imageData.data[i + 1] = 0;
          imageData.data[i + 2] = 0;
          imageData.data[i + 3] = 255;
        }
      }
    }
    
    imageData = scaleImageData(imageData, 10);
    CONTEXT.putImageData(imageData, this.x, this.y);
  }
}

class Pawn extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.template = [
      0,0,0,0,0,0,0,0,
      0,0,0,1,1,0,0,0,
      0,0,1,1,1,1,0,0,
      0,0,0,1,1,0,0,0,
      0,0,0,1,1,0,0,0,
      0,0,0,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ],
    this.firstMove = true;
  };
  moveForward(){
    this.y += (color === 'white' ? -80 : 80);
    if(this.bgcolor === 'white') {
      this.bgcolor = 'black';
    } else {
      this.bgcolor = 'white';
    }
    this.firstMove = false;
  }
  moveForwardTwice() {
    if(this.firstMove){
      this.moveForward();
      this.moveForward();
      this.firstMove = false;
    } 
  }
  //na wspolzednych na ukos znajduje sie figura
  captureRight() {
    if(this.color === 'white') {
      if(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[0] === 0 && 
        CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[1] === 0 &&
        CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[2] === 0 ) {

          for(let i = 0; i < pieces.length; i++) {
            if(pieces[i].x === this.x+80 && pieces[i].y === this.y-80) {
              pieces.splice(i,1);
              console.log('the element has been removed');
            }
          }

        this.x += 80;
        this.y -= 80;
      }
    } else {
      //CONTEXT.fillStyle = '#aaa';
      //CONTEXT.fillRect(this.x+95,this.y+145,100,100);
      if(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[0] == 120 &&
        CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[1] == 0 &&
        CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[2] == 60) { 
        //zdobadz dostep do elementu ktory uprzednio znajdowal sie na tych
        //koordynatach
        for(let i = 0; i < pieces.length; i++) {
          if(pieces[i].x === this.x+80 && pieces[i].y === this.y+80) {
            pieces.splice(i,1);
            console.log('the element has been removed');
          }
        }

        this.x += 80;
        this.y += 80;
          
        //usun element ktory uprzednio znajdowal sie na tych koordynatach

        //przesun tam ten element
      }
    }
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[0]);
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[1]);
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[2]);
    console.log(`-----------------`);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[0]);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[1]);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[2]);
  }

  captureLeft() {
    if(this.color === 'white') {
      if(CONTEXT.getImageData(this.x-95,this.y-15,1,1).data[0] === 0 && 
        CONTEXT.getImageData(this.x-95,this.y-15,1,1).data[1] === 0 &&
        CONTEXT.getImageData(this.x-95,this.y-15,1,1).data[2] === 0 ) {
          
          for(let i = 0; i < pieces.length; i++) {
            if(pieces[i].x === this.x-80 && pieces[i].y === this.y-80) {
              pieces.splice(i,1);
              console.log('the element has been removed');
            }
          }
        
        this.x -= 80;
        this.y -= 80;
      }
    } else {
      //CONTEXT.fillStyle = '#aaa';
      //CONTEXT.fillRect(this.x+95,this.y+145,100,100);
      if(CONTEXT.getImageData(this.x-95,this.y+145,1,1).data[0] == 120 &&
        CONTEXT.getImageData(this.x-95,this.y+145,1,1).data[1] == 0 &&
        CONTEXT.getImageData(this.x-95,this.y+145,1,1).data[2] == 60) { 
        //zdobadz dostep do elementu ktory uprzednio znajdowal sie na tych
        //koordynatach
        for(let i = 0; i < pieces.length; i++) {
          if(pieces[i].x === this.x-80 && pieces[i].y === this.y+80) {
            pieces.splice(i,1);
            console.log('the element has been removed');
          }
        }

        this.x -= 80;
        this.y += 80;
          
        //usun element ktory uprzednio znajdowal sie na tych koordynatach

        //przesun tam ten element
      }
    }
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[0]);
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[1]);
    console.log(CONTEXT.getImageData(this.x+95,this.y-15,1,1).data[2]);
    console.log(`-----------------`);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[0]);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[1]);
    console.log(CONTEXT.getImageData(this.x+95,this.y+145,1,1).data[2]);
  }
}
}

class Knight extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.move = {
      
    }
    this.template = [
      0,0,0,0,0,0,0,0,
      0,0,0,1,1,0,0,0,
      0,0,1,1,0,1,1,0,
      0,0,1,1,1,1,1,0,
      0,0,1,1,1,0,0,0,
      0,0,0,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ]
  };
}

class Rook extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.move = {
      
    }
    this.template = [
      0,0,0,0,0,0,0,0,
      0,1,0,1,1,0,1,0,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0,
      0,0,1,1,1,1,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0
    ]
  };
}

class Bishop extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.move = {
      
    }
    this.template = [
      0,0,0,0,0,0,0,0,
      0,0,0,0,1,0,0,0,
      0,0,1,0,0,1,0,0,
      0,0,1,1,0,1,0,0,
      0,0,0,1,1,0,0,0,
      0,0,0,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0,
    ]
  };
}

class Queen extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.move = {
      
    }
    this.template = [
      0,0,0,0,0,0,0,0,
      0,1,0,1,1,0,1,0,
      0,0,1,1,1,1,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0,
    ]
  };
}

class King extends Piece {
  constructor(x,y,color,bgcolor){
    super(x,y,color,bgcolor);
    this.move = {
      
    }
    this.template = [
      0,0,0,0,0,0,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      0,0,0,0,0,0,0,0,
    ]
  };
}

//640/x = 8
//640 = 8x
//x = 80 
//yeah

CONTEXT.fillStyle = COLORS[1];

const SQUARES_IN_A_ROW = WIDTH/SQUARE.WIDTH; //SHOULD BE 8
const SQUARES_IN_A_COLUMN = HEIGHT/SQUARE.HEIGHT; //SAB

const switchColors = function() {
  if(currentColor === COLORS[0]) {
    currentColor = COLORS[1];
  } else {
    currentColor = COLORS[0];
  }
  CONTEXT.fillStyle = currentColor;
}

function drawBoard () {
  if(SQUARES_IN_A_ROW != 8 || SQUARES_IN_A_COLUMN != 8){
    
    console.log(`Adjust the size of squares to canvas\n
    width/height so that canvas.width/square.width = 8,\n
    same applies to the height of each`); 
    
    //check how to fix the way it is written in code
    //so that it can display the same, without looking like sh*t-code
    //AKA. they way it is written TRIGGERS ME, 
    //but it's the only way I know to make it work currently...
    
  } else {
    for(let y = 0; y < SQUARES_IN_A_COLUMN ; y ++) {
      for(let x = 0; x < SQUARES_IN_A_ROW ; x ++) {
        switchColors();
        CONTEXT.fillRect(x*SQUARE.WIDTH,y*SQUARE.HEIGHT,SQUARE.WIDTH,SQUARE.HEIGHT);
        if(x === SQUARES_IN_A_ROW - 1) {
          switchColors();
        }
      }
    }
  }
}

const pieces = [];
let color = ['white','black'];
for(let i = 0; i < WIDTH; i+=160){
  pieces.push(new Pawn(i+0,80,'black',color[1]));
  pieces.push(new Pawn(i+80,80,'black',color[0]));
}
for(let i = 0; i < WIDTH; i+=160){
  pieces.push(new Pawn(i+0,HEIGHT-160,'white',color[0]));
  pieces.push(new Pawn(i+80,HEIGHT-160,'white',color[1]));
}
pieces.push(new Knight(160,0,'black','white'));
pieces.push(new Knight(WIDTH-240 ,0,'black','black'));

const constructors = [
  function(x,y,color,bgcolor){return new Rook(x,y,color,bgcolor)},
  function(x,y,color,bgcolor){return new Knight(x,y,color,bgcolor)},
  function(x,y,color,bgcolor){return new Bishop(x,y,color,bgcolor)}
];

let curr = color[1];
let currPieceCol = color[0];

function returnAndChangeColor(){
  if(curr == color[0]) {
    curr = color[1];
    return color[0];
  }else {
    curr = color[0];
    return color[1];
  }
}

function changeColor() {
  if(curr == color[0]){
    curr = color[1];
  } else {
    curr = color[0];
  }
}

function changePieceColor() {
  if(currPieceCol == color[0]){
    currPieceCol = color[1];
  } else {
    currPieceCol = color[0];
  }
}

for(let i = 0; i < constructors.length; i++) {
  pieces.push(constructors[i](i*80,HEIGHT-80,currPieceCol,curr));
  changeColor();
  pieces.push(constructors[i](WIDTH-i*80-80,HEIGHT-80,currPieceCol,curr));
}

changePieceColor();

for(let i = 0; i < constructors.length; i++) {
  pieces.push(constructors[i](i*80,0,currPieceCol,curr));
  changeColor(curr);
  pieces.push(constructors[i](WIDTH-i*80-80,0,currPieceCol,curr));
}

pieces.push(new Queen(240,0,'black','black'));
pieces.push(new King(320,0,'black','white'));
pieces.push(new Queen(240,HEIGHT-80,'white','white'));
pieces.push(new King(320,HEIGHT-80,'white','black'));

function drawPieces() { //TODO: DODAJ KOLORY JAKO PARAMETRY
  for(let i = 0; i < pieces.length; i++) { 
    pieces[i].drawItself();
  }
}

function drawGame() { //TODO: DODAJ KOLORY WSZYSTKIEGO JAKO PARAMETRY
  drawBoard(); //TODO: DODAJ KOLORY PLANSZY JAKO PARAMETRY
  drawPieces(); //TODO: DODAJ KOLORY FIGUR JAKO PARAMETRY
}

drawGame();
pieces[2].moveForwardTwice();
pieces[2].moveForwardTwice();
drawGame();
pieces[2].captureRight();
drawGame();