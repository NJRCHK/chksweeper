import Player from './Player.js';
import { Point , LeaderboardEntry, GameDifficulty } from '../../shared/types.js';

export default class Game {
    players: Player[];
    seed: number;
    inProgress: boolean;
    guests: number;
    difficulty: GameDifficulty;

    constructor(players ?: Player[]) {
        this.seed = this.generateSeed();
        this.inProgress = true;
        this.difficulty = this.generateRandomDifficulty();
        if(players !== undefined){
            this.players = players.map(player => {
                return new Player(player.username, player.id, this.seed, this.difficulty);
            });
        } else {
            this.players = [];
        }
        this.guests = 1;
    }

    generateRandomDifficulty() {
        let difficulty = Math.floor(Math.random() * (GameDifficulty.EXPERT - GameDifficulty.BEGINNER + 1) + GameDifficulty.BEGINNER);
        return difficulty as GameDifficulty;
    }

    resetPlayer(id: number) {
        let player = this.getPlayerWithId(id);
        player.resetPlayer();
    }

    getPlayerWithId(id: number): Player {
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].id === id){
                return this.players[i];
            }
        }
        throw `Player does not exist with id ${id}`;
    }

    addPlayer(id: number, username?: string) {
        let newPlayer;
        if(username === undefined){
            newPlayer = new Player(`Guest ${this.guests}`,id, this.seed, this.difficulty);
            this.guests++;
        }
        else {
            newPlayer = new Player(username, id, this.seed, this.difficulty);
        }
        this.players.push(newPlayer);
    }

    handlePlayerClick(id: number, clickedTile: Point) {
        if(!this.inProgress){
            return;
        }
        const player = this.getPlayerWithId(id);
        player.revealTile(clickedTile);
        if(player.board.squaresRemaining === 0){
            this.inProgress = false;
        }
    }

    clientifyPlayers() {
        let clonedPlayers = JSON.parse(JSON.stringify(this.players));
        for(let i = 0; i < clonedPlayers.length; i++){
            let board = clonedPlayers[i].board;
            delete board.seed;
            delete board.squaresRemaining;
            delete board.board;
        }
        return clonedPlayers;
    }

    compareMinesremaining(player1: LeaderboardEntry, player2: LeaderboardEntry) {
        if(player1.squaresRemaining < player2.squaresRemaining){
            return -1;
        }
        else if(player1.squaresRemaining > player2.squaresRemaining){
            return 1;
        }
        return 0;
    }

    getLeaderboard() {
        let leaderboard = new Array<LeaderboardEntry>;
        leaderboard = this.players.map(player => {
            return ({
                username: player.username,
                squaresRemaining: player.board.squaresRemaining,
                percentage: (1 - (player.board.squaresRemaining/(player.board.area - player.board.mines)))*100,
            }) as LeaderboardEntry;
        });
        leaderboard.sort(this.compareMinesremaining);
        return leaderboard;
    }

    removePlayer(id: number){
        this.players = this.players.filter(player => player.id !== id);
    }

    generateSeed(): number {
        let randomNumber = Math.random();
        randomNumber = randomNumber* Math.pow(10, 8);
        randomNumber = Math.trunc(randomNumber); 
        return randomNumber;
    }
}
