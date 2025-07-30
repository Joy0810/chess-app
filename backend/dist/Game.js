"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Check if it's the correct player's turn
        const isWhiteTurn = this.board.turn() === 'w';
        const isPlayer1Turn = (isWhiteTurn && socket === this.player1) || (!isWhiteTurn && socket === this.player2);
        if (!isPlayer1Turn) {
            console.log("Wrong player's turn");
            return;
        }
        try {
            this.board.move(move);
            console.log("Move made successfully:", move);
            console.log("Board state after move:");
            console.log("Is check:", this.board.isCheck());
            console.log("Is checkmate:", this.board.isCheckmate());
            console.log("Is stalemate:", this.board.isStalemate());
            console.log("Current turn:", this.board.turn());
        }
        catch (e) {
            console.log("Invalid move:", e);
            return;
        }
        // Check for checkmate first
        if (this.board.isCheckmate()) {
            this.player1.send(JSON.stringify({
                type: messages_1.CHECKMATE,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    message: `Checkmate! ${this.board.turn() === "w" ? "Black" : "White"} wins!`
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.CHECKMATE,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    message: `Checkmate! ${this.board.turn() === "w" ? "Black" : "White"} wins!`
                }
            }));
            return;
        }
        // Check for stalemate
        if (this.board.isStalemate()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: "draw",
                    message: "Stalemate! The game is a draw."
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: "draw",
                    message: "Stalemate! The game is a draw."
                }
            }));
            return;
        }
        // Check for check
        if (this.board.isCheck()) {
            console.log("CHECK DETECTED! Current turn:", this.board.turn());
            this.player1.send(JSON.stringify({
                type: messages_1.CHECK,
                payload: {
                    message: `${this.board.turn() === "w" ? "White" : "Black"} is in check!`
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.CHECK,
                payload: {
                    message: `${this.board.turn() === "w" ? "White" : "Black"} is in check!`
                }
            }));
        }
        // Send the move to both players
        this.player1.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
    }
}
exports.Game = Game;
