export default class Board{
    constructor(height, width, mines){
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.board = this.#generateBoard();
    }

    get area() {
        return this.width * this.height;
    }

    #generateBoard() {
        
        let arr1 = new Array(this.width);

        for(let i = 0; i < arr1.length; i++){
            let arr2 = new Array(this.height);
            arr1[i] = arr2;
            for(let j = 0; j < arr2.length; j++){
                arr2[j] = 0;
            }
        }

        let minesToPlace = this.mines;
        let spacesLeft = this.area;

        for(let i = 0; i < arr1.length; i++){
            for(let j = 0; j < arr1[i].length; j++){
                if(Math.random() <= minesToPlace/spacesLeft){
                    arr1[i][j] = -1;
                    minesToPlace--;
                }
                spacesLeft--;
            }
        }

        for(let i = 0; i < arr1.length; i++){
            for(let j = 0; j < arr1[i].length; j++){
                
                if(arr1[i][j] == -1){
                    continue;
                }

                let leftInBounds = i > 0;
                let rightInBounds = i < (arr1.length -1)
                let upInBounds = j > 0;
                let downInBounds = j < (arr1[i].length - 1);

                if (leftInBounds && (arr1[i-1][j] == -1)){
                    arr1[i][j]++;
                }

                if (rightInBounds && (arr1[i+1][j] == -1)){
                    arr1[i][j]++;
                }

                if (upInBounds && (arr1[i][j-1] == -1)){
                    arr1[i][j]++;
                }

                if(downInBounds && (arr1[i][j+1] == -1)){
                    arr1[i][j]++;
                }
                
                if(downInBounds && rightInBounds && arr1[i+1][j+1] == -1){
                    arr1[i][j]++;
                }

                if(downInBounds && leftInBounds && arr1[i-1][j+1] == -1){
                    arr1[i][j]++;
                }

                if(upInBounds && rightInBounds && arr1[i+1][j-1] == -1){
                    arr1[i][j]++;
                }

                if(upInBounds && leftInBounds && arr1[i-1][j-1] == -1){
                    arr1[i][j]++;
                }

            }
        }
        return arr1;
    }
}