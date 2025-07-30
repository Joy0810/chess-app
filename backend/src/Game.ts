import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, CHECK, CHECKMATE } from "./messages";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board:Chess
    private startTime:Date;

    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }

    makeMove(socket:WebSocket,move:{from:string, to:string}){

        // Check if it's the correct player's turn
        const isWhiteTurn = this.board.turn() === 'w';
        const isPlayer1Turn = (isWhiteTurn && socket === this.player1) || (!isWhiteTurn && socket === this.player2);
        
        if (!isPlayer1Turn) {
            console.log("Wrong player's turn");
            return;
        }


        // Check for checkmate first
        if(this.board.isCheckmate()){
            this.player1.send(JSON.stringify({
                type:CHECKMATE,
                payload:{
                    winner:this.board.turn()==="w" ? "black" : "white",
                    message: `Checkmate! ${this.board.turn()==="w" ? "Black" : "White"} wins!`
                }
            }));
            this.player2.send(JSON.stringify({
                type:CHECKMATE,
                payload:{
                    winner:this.board.turn()==="w" ? "black" : "white",
                    message: `Checkmate! ${this.board.turn()==="w" ? "Black" : "White"} wins!`
                }
            }));
            return;
        }

        // Check for stalemate
        if(this.board.isStalemate()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:"draw",
                    message: "Stalemate! The game is a draw."
                }
            }));
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:"draw",
                    message: "Stalemate! The game is a draw."
                }
            }));
            return;
        }

        // Check for check
        if(this.board.isCheck()){
            console.log("CHECK DETECTED! Current turn:", this.board.turn());
            this.player1.send(JSON.stringify({
                type:CHECK,
                payload:{
                    message: `${this.board.turn()==="w" ? "White" : "Black"} is in check!`
                }
            }));
            this.player2.send(JSON.stringify({
                type:CHECK,
                payload:{
                    message: `${this.board.turn()==="w" ? "White" : "Black"} is in check!`
                }
            }));
        }
        
        // Send the move to both players
        this.player1.send(JSON.stringify({
            type:MOVE,
            payload:move
        }));
        this.player2.send(JSON.stringify({
            type:MOVE,
            payload:move
        }));

    }
}