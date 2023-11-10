const playBoard = document.querySelector('.playBoard');
const moveCount = document.querySelector('.movesCount');
const skipBtn = document.querySelector('.skipBtn');
const undoBtn = document.querySelector('.undoBtn');
const restartBtn = document.querySelector('.restartBtn');
const info = document.querySelector('.info');
const result = document.querySelector('.result');

let isMouseDown = false; //mouse down flag
let RedL = [];
let BlueL = [[1,2], [1,3], [2,3], [3,3]];
let oldRed = [[2,2], [3,2], [4,2], [4,3]];
let oldBlue = [];
let playerFlag = 2; // 1 for blue & 2 red
let pieceFlag = false;
let pieceSelected = false;
let selectedPiece;
let piece; //
let grid = [[3, 1, 1, 0],
            [0, 5, 1, 0],
            [0, 5, 1, 0],
            [0, 5, 5, 3]];  // 0: empty, 1: blue, 2:red, 3:piece, 4:oldBlue, 5:oldRed
let gridBoxes;
let styles = ['', 'bluePlayer', 'redPlayer', 'piece', 'oldBlue', 'oldRed'];

//strings for info sectoin html
let blueTurn = `It's <span class="blueColor">Blue's turn!</span> Draw your L piece.`;
let redTurn = `It's <span class="redColor">Red's turn!</span> Draw your L piece.`;
let pieceTurn = `<p>you can optionally move ONE of the black pieces.</p> <p>Click on the piece you would like to move, then click on its new location.</p>`;

const compareFuncRow = (a, b) => {//sort array acc to row then col
    if( a[0] - b[0] !== 0)
        return a[0] - b[0];
    else
        return a[1] - b[1];
}
const compareFuncCol = (a, b) => {//sort array acc to col then row
    if( a[1] - b[1] !== 0)
        return a[1] - b[1];
    else
        return a[0] - b[0];
}

const validateL = (arr) => {
    if(arr.length !== 4) // if length is not 4 means not a L shape
        return false;

    //check if L is same as old
    arr.sort(compareFuncRow);
    if(playerFlag == 2){ // for RedPlayer
        oldRed.sort(compareFuncRow);
        let temp = 1;
        for(let i=0;i<arr.length;i++){
            if(arr[i][0] !== oldRed[i][0] || arr[i][1] !== oldRed[i][1]) //menas current L is different from old one : break and move forward
            {
                temp = 0; break; 
            }
        }
        if(temp === 1) // means old and current L are same : false
            return false;
    }
    else if(playerFlag == 1){ //for blue player
        oldBlue.sort(compareFuncRow);
        let temp = 1;
        for(let i=0;i<arr.length;i++){
            if(arr[i][0] !== oldBlue[i][0] || arr[i][1] !== oldBlue[i][1])  //menas current L is different from old one : break and move forward
            {
                temp = 0; break;
            }
        }
        if(temp === 1) // means old and current L are same : false
            return false;
    }
    //-----------------check for horizontal L shape

    //arr.sort(compareFuncRow); already called above
    if(arr[0][0] === arr[1][0] && arr[1][0] === arr[2][0]){                  //if row value is same for first 3 element
        if(arr[3][0] === arr[2][0] -1 || arr[3][0] === arr[2][0] +1) {                  // row value of forth element must be +1 or -1 wrt 3rd element
            if(arr[3][1] === arr[2][1] || arr[3][1] === arr[0][1]){                  //  and column value must be same as the 3rd element or 1st element
                return true;
             }
        }
    }
    else if(arr[1][0] === arr[2][0] && arr[2][0] === arr[3][0]){                          //if row value is same for last 3 element
        if(arr[0][0] === arr[1][0] -1 || arr[0][0] === arr[1][0] +1) {                  // row value of first element must be +1 or -1 wrt 2nd element 
            if(arr[0][1] === arr[1][1] || arr[0][1] === arr[3][1]){                  //  and column value must be same as the 2nd element or 4th element 
                return true;
             }
        }
    }

    //-----------------check for vertical L shape
    arr.sort(compareFuncCol);
    if(arr[0][1] === arr[1][1] && arr[1][1] === arr[2][1]){                  //if column value is same for first 3 elemen
        if(arr[3][1] === arr[2][1] -1 || arr[3][1] === arr[2][1] +1) {                  // column value of forth element must be +1 or -1 wrt 3rd element 
            if(arr[3][0] === arr[2][0] || arr[3][0] === arr[0][0]){                  //  and row value must be same as the 3rd element or 1st element
                return true;
             }
        }
    }
    else if(arr[1][1] === arr[2][1] && arr[2][1] === arr[3][1]){                          //if column value is same for last 3 element
        if(arr[0][1] === arr[1][1] -1 || arr[0][1] === arr[1][1] +1) {                  // column value of first element must be +1 or -1 wrt 2nd element 
            if(arr[0][0] === arr[1][0] || arr[0][0] === arr[3][0]){                  //  and row value must be same as the 2nd element or 4th element
                return true;
             }
        }
    }
    return false;
}

const possibleMoves = () => {//fiding total possible moves in grid
    let checkArr = grid;
    let oldValue = 5 - (2-playerFlag);   // 5 or 4 for differnt players

    for(let i=0;i<4;i++){ //set value 4 or 5 to zero in this checkArr
        for(let j=0;j<4;j++){
            if(checkArr[i][j] === oldValue)
                checkArr[i][j] = 0;
        };
    };

    let totalL = 0; //setting count to zero
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(checkArr[i][j] == 0)
            {    
                //horizontal L's forward direction (up & down)
                if(j<2){ 
                    if(i<3){
                        if(checkArr[i][j+1] === 0 && checkArr[i][j+2] === 0 && checkArr[i+1][j+2] === 0) //for --,
                            {totalL++; console.log(i,j,1)}
                        if(checkArr[i+1][j] === 0 && checkArr[i+1][j+1] === 0 && checkArr[i+1][j+2] === 0) //for '--
                            {totalL++; console.log(i,j,2)}
                    }
                    if(i>0){
                        if(checkArr[i][j+1] === 0 && checkArr[i][j+2] === 0 && checkArr[i-1][j+2] === 0) //for ,--
                            {totalL++; console.log(i,j,3)}
                        if(checkArr[i-1][j] === 0 && checkArr[i-1][j+1] === 0 && checkArr[i-1][j+2] === 0) //for --'
                            {totalL++; console.log(i,j,4)}
                    }
                }

                //vertical L's forward direction (up & down)
                if(j<3){
                    if(i<2){
                        if(checkArr[i][j+1] === 0 && checkArr[i+1][j+1] === 0 && checkArr[i+2][j+1] === 0) //for ꓶ
                            {totalL++; console.log(i,j,5)}
                        if(checkArr[i+1][j] === 0 && checkArr[i+2][j] === 0 && checkArr[i+2][j+1] === 0) //for L
                            {totalL++; console.log(i,j,6)}
                    }

                    if(i>1){
                        if(checkArr[i][j+1] === 0 && checkArr[i-1][j+1] === 0 && checkArr[i-2][j+1] === 0) //for ⅃
                            {totalL++; console.log(i,j,7)}
                        if(checkArr[i-1][j] === 0 && checkArr[i-2][j] === 0 && checkArr[i-2][j+1] === 0) //for Γ
                            {totalL++; console.log(i,j,8)}
                    }
                }
            }
        }
    }
    totalL = totalL -1; //ignore the current position
    moveCount.innerHTML = totalL; //update possible moves in html
    console.log("Total moves possible", totalL);

    if(totalL === 0){ //if no possible moves show result : win
        if(playerFlag === 1)
            result.innerHTML  = 'RED Player wins!!!';
        else
            result.innerHTML  = 'BLUE Player wins!!!';
    }
};

const init = () => { //giving grid 16 gridboxes with style acc to grid arr value and style
    let html= '';
    for(let i=1;i<=4;i++){
        for(let j=1; j<=4;j++){
            html += `<div class="gridBox ${styles[grid[i-1][j-1]]}" style="grid-area: ${i}/${j}"></div>` //adding 16 grid boxes with style
        }
    }
    playBoard.innerHTML = html; // setting playboard html

    gridBoxes = document.querySelectorAll('.gridBox'); // calling it after creating grid boxes

    //adding event listener for all grid box : mouseover and mousedown
    gridBoxes.forEach((ele) => {
        //console.log(ele);
        ele.addEventListener('mouseover', () =>{
            let eleRow = Number(ele.style.gridRowStart); //row of current element
            let eleCol = Number(ele.style.gridColumnStart); //column of current element
            if(pieceFlag || pieceSelected)
                return;
            if(isMouseDown){  //check if mouse is clicked this box is already selected or not
                if(playerFlag === 2 && (grid[eleRow-1][eleCol-1] === 0 || grid[eleRow-1][eleCol-1] === 5)){
                    //remove old css classes
                    ele.classList.remove('bluePlayer');
                    ele.classList.remove('piece');
                    ele.classList.remove('oldRed');
                    //add new one
                    ele.classList.add('redPlayer');
                    RedL.push([eleRow, eleCol]);
                    grid[eleRow-1][eleCol-1] = 2;
                }
                else if(playerFlag === 1 && (grid[eleRow-1][eleCol-1] === 0 || grid[eleRow-1][eleCol-1] === 4)){
                    //remove old css classes
                    ele.classList.remove('redPlayer');
                    ele.classList.remove('piece');
                    ele.classList.remove('oldBlue');
                    //add new one
                    ele.classList.add('bluePlayer');
                    BlueL.push([eleRow, eleCol]);
                    grid[eleRow-1][eleCol-1] = 1;
                }
            }
        })
        ele.addEventListener('mousedown', () =>{
            let eleRow = Number(ele.style.gridRowStart); //row of current element
            let eleCol = Number(ele.style.gridColumnStart); //column of current element
            isMouseDown = true;
            if(pieceFlag){ // when player selected a black piece to move
                if(grid[eleRow-1][eleCol-1] === 3){  // 3 means black piece
                    piece = [eleRow, eleCol];
                    pieceFlag = false;
                    pieceSelected = true;
                    ele.style.backgroundColor= "rgb(34, 157, 34)";
                    selectedPiece = ele;
                    //disable skipBtn
                    skipBtn.style.cursor = 'not-allowed';
                    skipBtn.style.color = 'darkgrey';
                    skipBtn.style.borderColor = 'darkgrey';
                    //enable undoBtn
                    undoBtn.style.cursor = 'pointer';
                    undoBtn.style.color = 'aqua';
                    undoBtn.style.borderColor = 'aqua';
                }
            }
            else if(pieceSelected){ // when player selected empty location for black piece
                if(grid[eleRow-1][eleCol-1] === 0){
                    selectedPiece.classList.remove('piece');
                    selectedPiece.style.backgroundColor = '';
                    ele.classList.add('piece');
                    grid[eleRow-1][eleCol-1] = 3;
                    grid[piece[0]-1][piece[1]-1] = 0;
                    piece = [];
                    selectedPiece = null;
                    pieceSelected = false;
                    //set player current things to old one...
                    if(playerFlag === 1){
                        BlueL.forEach((ele) => {
                            let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                            gridBoxes[temp-1].classList.remove('bluePlayer');  //remove bluePlayer class
                            gridBoxes[temp-1].classList.add('oldBlue');  //add oldBlue class
                            grid[ele[0]-1][ele[1]-1]= 4;  //set 4 in grid array
                        })
                        oldBlue = BlueL;
                        BlueL = [];
                        //change player turn in html
                        info.innerHTML = blueTurn;
                    }
                    if(playerFlag === 2){
                        RedL.forEach((ele) => {
                            let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                            gridBoxes[temp-1].classList.remove('redPlayer');  //remove redPlayer class
                            gridBoxes[temp-1].classList.add('oldRed');  //add oldRed class
                            grid[ele[0]-1][ele[1]-1]= 5;  //set 5 in grid array
                        })
                        oldRed = RedL;
                        RedL = [];
                        //change player turn in html
                        info.innerHTML = redTurn;
        
                    }
                    possibleMoves();

                    //disable undoBtn
                    undoBtn.style.cursor = 'not-allowed';
                    undoBtn.style.color = 'darkgrey';
                    undoBtn.style.borderColor = 'darkgrey';
                }
            }
            else if(isMouseDown){  //check if mouse is clicked & this box is already selected or not
                if(playerFlag == 2 && (grid[eleRow-1][eleCol-1] === 0 || grid[eleRow-1][eleCol-1] === 5)){
                    ele.classList.remove('bluePlayer');
                    ele.classList.remove('piece');
                    ele.classList.remove('oldRed');
                    ele.classList.add('redPlayer');
                    RedL.push([eleRow, eleCol]);
                    grid[eleRow-1][eleCol-1] = 2;
                }
                else if(playerFlag == 1 && (grid[eleRow-1][eleCol-1] === 0 || grid[eleRow-1][eleCol-1] === 4)){
                    ele.classList.remove('redPlayer');
                    ele.classList.remove('piece');
                    ele.classList.remove('oldBlue');
                    ele.classList.add('bluePlayer');
                    BlueL.push([eleRow, eleCol]);
                    grid[eleRow-1][eleCol-1] = 1;
                }
            }
        })
    });

}

init();


document.addEventListener("mousedown", () => { //added mousedown event listener for whole document
    console.log("down");
    isMouseDown = true; //setting isMouseDown : true;
});


document.addEventListener('mouseup', () => { //added mouseup event listener for whole document
    console.log("up");
    isMouseDown = false; //setting isMouseDown : false;
    if(pieceFlag || pieceSelected)
        return;
    
    if(playerFlag === 2){
        if(validateL(RedL)){
            playerFlag = 1; //change playerFlag
            pieceFlag = true;
            //set oldRed to empty
            oldRed.forEach((ele) => {
                let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                gridBoxes[temp-1].classList.remove('oldRed');  //remove oldRed class
                if(grid[ele[0]-1][ele[1]-1] === 5) 
                    grid[ele[0]-1][ele[1]-1]= 0;  //set 0 in grid array
            });
            //enable skipBtn
            skipBtn.style.cursor = 'pointer';
            skipBtn.style.color = 'aqua';
            skipBtn.style.borderColor = 'aqua';
            info.innerHTML = pieceTurn;
        }
        else { 
            RedL.forEach((ele) => { // remove style for selected boxes
                let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                //console.log(temp, gridBoxes[temp]);
                gridBoxes[temp-1].classList.remove('redPlayer');  //remove redPlayer class
                grid[ele[0]-1][ele[1]-1] = 0;  //set 0 in grid array
            });
            oldRed.forEach((ele) => { // add style for old L
                let temp = (ele[0]-1)*4 + ele[1];
                gridBoxes[temp-1].classList.add('oldRed');  //add oldRed class 
                grid[ele[0]-1][ele[1]-1]= 5;  //set 5 in grid array
            });
            RedL = [];   //empty RedL
        }
        
    }
    else if(playerFlag === 1){
        if(validateL(BlueL)){
            playerFlag = 2; //change playerFlag
            pieceFlag = true;
            //set oldBlue to empty
            oldBlue.forEach((ele) => {
                let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                gridBoxes[temp-1].classList.remove('oldBlue');  //remove oldBlue class
                if(grid[ele[0]-1][ele[1]-1] === 4) 
                    grid[ele[0]-1][ele[1]-1]= 0;  //set 0 in grid array
            });
            //enable skipBtn
            skipBtn.style.cursor = 'pointer';
            skipBtn.style.color = 'aqua';
            skipBtn.style.borderColor = 'aqua';
            info.innerHTML = pieceTurn;
        }
        else { 
            BlueL.forEach((ele) => { //remove style for selected boxes
                let temp = (ele[0]-1)*4 + ele[1];  
                //console.log(temp, gridBoxes[temp]);
                gridBoxes[temp-1].classList.remove('bluePlayer');  //unset background color
                grid[ele[0]-1][ele[1]-1] = 0;  //set 0 in grid array
            });
            oldBlue.forEach((ele) => {
                let temp = (ele[0]-1)*4 + ele[1]; 
                gridBoxes[temp-1].classList.add('oldBlue');  //add oldBlue class
                grid[ele[0]-1][ele[1]-1]= 4;  //set 4 in grid array
            });
            BlueL = [];   //empty RedL
        }
        
    }
})

skipBtn.addEventListener('click', () => {// add event listener for skip btn
    if(pieceFlag){
        pieceFlag = false;
        //set player current things to old one...
        if(playerFlag === 1){
            BlueL.forEach((ele) => {
                let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                gridBoxes[temp-1].classList.remove('bluePlayer');  //remove bluePlayer class
                gridBoxes[temp-1].classList.add('oldBlue');  //add oldBlue class
                grid[ele[0]-1][ele[1]-1]= 4;  //set 4 in grid array
            })
            oldBlue = BlueL;
            BlueL = [];
            //change player turn in html
            info.innerHTML = blueTurn;
        }
        if(playerFlag === 2){
            RedL.forEach((ele) => {
                let temp = (ele[0]-1)*4 + ele[1];  // get the number for gridBox
                gridBoxes[temp-1].classList.remove('redPlayer');  //remove redPlayer class
                gridBoxes[temp-1].classList.add('oldRed');  //add oldRed class
                grid[ele[0]-1][ele[1]-1]= 5;  //set 4 in grid array
            })
            oldRed = RedL;
            RedL = [];
            //change player turn in html
            info.innerHTML = redTurn;
        }
        possibleMoves();

        //disable undoBtn
        skipBtn.style.cursor = 'not-allowed';
        skipBtn.style.color = 'darkgrey';
        skipBtn.style.borderColor = 'darkgrey';
    }
});


undoBtn.addEventListener('click', () => { // add event listener for undo btn
    if(pieceSelected) {
        pieceSelected = false;
        piece = [];
        pieceFlag = true;
        selectedPiece.style.backgroundColor= '';
        selectedPiece = null;
        //disable skipBtn
        skipBtn.style.cursor = 'pointer';
        skipBtn.style.color = 'aqua';
        skipBtn.style.borderColor = 'aqua';
        //enable undoBtn
        undoBtn.style.cursor = 'not-allowed';
        undoBtn.style.color = 'darkgrey';
        undoBtn.style.borderColor = 'darkgrey';
    }
});

restartBtn.addEventListener('click', () => { // add event listener for restart btn
    RedL = [];
    BlueL = [[1,2], [1,3], [2,3], [3,3]];
    oldRed = [[2,2], [3,2], [4,2], [4,3]];
    oldBlue = [];
    playerFlag = 2;
    pieceFlag = false;
    pieceSelected = false;
    selectedPiece = null;
    piece = null;
    grid = [[3, 1, 1, 0],
            [0, 5, 1, 0],
            [0, 5, 1, 0],
            [0, 5, 5, 3]]; 
     
    init();
    possibleMoves();

    info.innerHTML = redTurn;
    result.innerHTML = '';

    undoBtn.style.cursor = 'not-allowed';
    undoBtn.style.color = 'darkgrey';
    undoBtn.style.borderColor = 'darkgrey';

    skipBtn.style.cursor = 'not-allowed';
    skipBtn.style.color = 'darkgrey';
    skipBtn.style.borderColor = 'darkgrey';

});
