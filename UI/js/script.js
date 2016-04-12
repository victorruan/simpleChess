;
var chessBoard = []; //棋盘
var over =false; //是否结束
var myWin = [];
var computerWin = [];

for(var i =0;i<15;i++){
    chessBoard[i] = [];
    for(var j =0;j<15;j++){
        chessBoard[i][j] = 0;
    }
}
var wins = [];
for(var i =0;i<15;i++){
    wins[i] = [];
    for(var j =0;j<15;j++){
        wins[i][j] = [];
    }
}

var count = 0;

for(var i = 0;i<15;i++){
    for(var j =0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}

for(var i = 0;i<15;i++){
    for(var j =0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}

for(var i = 0;i<11;i++){
    for(var j =0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}

for(var i = 0;i<11;i++){
    for(var j =14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}

for(var i =0 ;i<count;i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}


var chess = document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle = "#bfbfbf";
var me = true;

var logo = new Image();
logo.src = 'images/logo.jpg';

logo.onload = function(){
    context.drawImage(logo,0,0,450,450);
    drewChessBoard();
};

var drewChessBoard = function (){
    for(var i = 0;i<15;i++){
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
    }
};

var oneStep = function(i,j,me){
    context.beginPath();
    context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
    if(me){
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle = gradient;
    context.fill();
};

chess.onclick = function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if(chessBoard[i][j]==0){
        oneStep(i,j,me);
        chessBoard[i][j]=1;
        for(var k = 0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k] = 6;
                if(myWin[k]==5){
                    alert('你赢了');
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
            computerAI();
        }
    }
};

var computerAI = function(){
    var x = 0;
    var y = 0;
    var max = 0;
    var myScore = [];
    var computerScore = [];
    for(var i = 0 ; i<15;i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j = 0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i =0;i<15;i++){
        for(var j =0;j<15;j++){
            if(chessBoard[i][j] == 0){
                for(var k =0;k< count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[i][j]+=200;
                        }else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }else if(myWin[k]==3){
                            myScore[i][j]+=2000;
                        }else if(myWin[k]==4){
                            myScore[i][j]+=10000;
                        }
                        if(computerWin[k]==1){
                            computerScore[i][j]+=220;
                        }else if(computerWin[k]==2){
                            computerScore[i][j]+=420;
                        }else if(computerWin[k]==3){
                            computerScore[i][j]+=2200;
                        }else if(computerWin[k]==4){
                            computerScore[i][j]+=20000;
                        }
                    }
                }


               if(myScore[i][j] > max){
                   max = myScore[i][j];
                   x = i;
                   y = j;
               } else if(myScore[i][j] == max){
                   if(computerScore[i][j] > computerScore[x][y]){
                       x = i;
                       y = j;
                   }
               }

                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    x = i;
                    y = j;
                } else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[x][y]){
                        x = i;
                        y = j;
                    }
                }
            }
        }
    }

        oneStep(x,y,false);
        chessBoard[x][y]=1;
        for(var k = 0;k<count;k++){
            if(wins[x][y][k]){
                computerWin[k]++;
                myWin[k]=6;
                if(computerWin[k]==5){
                    alert('计算机赢了');
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
        }
};