import * as React from 'react';
import {useState} from 'react';
import Timer from './GameComponents/Timer';
import ResetButton from './GameComponents/ResetButton';
import Counter from './GameComponents/Counter';
import BoardDisplay from './GameComponents/BoardDisplay';
import Board from '../../shared/Board';

type Config = {
    height: number, 
    width: number,
    mines: number
}

type SinglePlayerGameProps = {
    config: Config
}


export default function(props: SinglePlayerGameProps): JSX.Element {

    const boardStartState = {
        gameState: "inprogress",
        height: props.config.height,
        width: props.config.width,
        mines: props.config.mines,
        minesRemaining: props.config.mines,
        seed: Board.generateSeed(),
        squaresRemaining: (props.config.height * props.config.width) - props.config.mines,
        tiles: createTiles(props.config.height, props.config.width),
    }

    const [board, setBoard] = useState(boardStartState);

    function createTiles(height: number, width: number): number[][] {
        let tilesRows = new Array<number[]>(height)
        for(let i = 0; i < height; i++){
            let row = new Array<number>(width);
            for(let j = 0; j < width; j++){
                row[j]=-2;
            }
            tilesRows[i] = row;
        }
        return tilesRows;
    }

    function tileClicked (x: number, y: number): void {
        if(board.gameState !== "inprogress"){
            return;
        }
        if(board.tiles[x][y] > -2){
            return;
        }

        let tempBoard = new Board(board.height, board.width, board.mines, board.seed);
        let values = tempBoard.checkCoordinates(x, y);

        for(let i = 0; i < values.length; i++){
            setBoard(prevBoard => {
                let temp = {
                    ...prevBoard,
                    squaresRemaining: prevBoard.squaresRemaining- 1,
                }
                temp.tiles[values[i].x][values[i].y] = values[i].value;
                if(temp.squaresRemaining === 0){
                    temp.gameState ="gamewon";
                }
                return temp;
            });
        }
        if(values[0].value === -1){
            setBoard(prevBoard => {
                return {
                    ...prevBoard,
                    gameState: "gameover"
                }
            });
        }
    }

    function tileRightClicked (x: number, y: number): void {
        if(board.gameState !== "inprogress"){
            return;
        }
        let tile = board.tiles[x][y];
        //if tile is shown do nothing
        if(tile > 0){
            return;
        }
        //if tile is covered put a flag on it and decrement the mines counter
        else if(tile === -2){
            setBoard(prevBoard => {
                let temp = {
                    ...prevBoard
                };
                temp.tiles[x][y] = -3;
                temp.minesRemaining--;
                return temp;
            });
        }
        // if tile has flag put a question mark on it and increment the mines counter
        else if(tile === -3){
            setBoard(prevBoard => {
                let temp = {
                    ...prevBoard
                };
                temp.tiles[x][y] = -4;
                temp.minesRemaining++;
                return temp;
            });
        }
        //if tile has question mark on it remove it 
        else if(tile === -4){
            setBoard(prevBoard => {
                let temp = {
                    ...prevBoard
                };
                temp.tiles[x][y] = -2;
                return temp;
            });
        }
    }

    function restartGame() {
        setBoard(boardStartState);
    }

    function contextMenu(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    return (
        <div className="singleplayer-game" onContextMenu={contextMenu}>
            <div className="game-bar">
                <Counter mines={board.minesRemaining}/>
                <ResetButton 
                    clickEvent={restartGame}
                    gameState={board.gameState}
                />
                <Timer />
            </div>
            <BoardDisplay 
                height={board.height}
                width={board.width}
                tiles={board.tiles}
                tileClicked={tileClicked}
                tileRightClicked={tileRightClicked}
            />
        </div>                
    );
}