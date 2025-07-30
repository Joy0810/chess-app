import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import {Chess} from "chess.js"

export const INIT_GAME="init_game";
export const MOVE="move"
export const GAME_OVER="game_over"
export const CHECK="check"
export const CHECKMATE="checkmate"

export function Game(){

    const socket=useSocket();
    const [chess,setChess]=useState(new Chess());
    const [board,SetBoard]=useState(chess.board());
    const [playerColor,setPlayerColor]=useState<'w'|'b'|null>(null);
    const [isInCheck,setIsInCheck]=useState(false);
    const [gameStatus,setGameStatus]=useState<string>('');

    useEffect(()=>{
        if(!socket) return;
        socket.onmessage=(event)=>{
            try {
                const message=JSON.parse(event.data);
                console.log(message);
                switch(message.type){
                    case INIT_GAME:
                        const newChess = new Chess();
                        setChess(newChess);
                        SetBoard(newChess.board());
                        // Convert "white"/"black" to "w"/"b"
                        const color = message.payload?.color === "white" ? "w" : "b";
                        setPlayerColor(color);
                        console.log("Game Initialized, Player Color:", color);
                        break;
                    case MOVE:
                        const move=message.payload;
                        setChess(prevChess => {
                            const updatedChess = new Chess(prevChess.fen());
                            updatedChess.move(move);
                            SetBoard(updatedChess.board());
                            console.log("Move Made");
                            
                            // Clear check state when a move is made
                            setIsInCheck(false);
                            setGameStatus('');
                            
                            return updatedChess;
                        });
                        break;
                    case GAME_OVER:
                        console.log("Game Over:", message.payload);
                        setGameStatus(message.payload.message || "Game Over");
                        break;
                    case CHECK:
                        console.log("CHECK MESSAGE RECEIVED:", message.payload);
                        setIsInCheck(true);
                        setGameStatus(message.payload.message);
                        break;
                    case CHECKMATE:
                        console.log("Checkmate:", message.payload);
                        setGameStatus(message.payload.message);
                        setIsInCheck(false);
                        break;
                    case "status":
                        console.log("Status:", message.payload);
                        break;
                }
            } catch (error) {
                console.error("Failed to parse message:", event.data);
            }
        }
    },[socket]);

    if(!socket) return <div>Connecting...</div>

    return <div className="felx justify-center">
        <div className="pt-8 max-w-screen-lg">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                <div className="col-span-4  flex justify-center">
                    <ChessBoard 
                        board={board} 
                        socket={socket} 
                        chess={chess} 
                        playerColor={playerColor}
                        isMyTurn={chess.turn() === playerColor}
                        isInCheck={isInCheck}
                    />
                </div>
                <div className="col-span-2 bg-[#262522] w-full flex justify-center">
                    <div className="pt-8 text-white">
                        <div>Player Color: {playerColor === 'w' ? 'White' : playerColor === 'b' ? 'Black' : 'None'}</div>
                        <div>Current Turn: {chess.turn() === 'w' ? 'White' : 'Black'}</div>
                        <div>Is My Turn: {chess.turn() === playerColor ? 'Yes' : 'No'}</div>
                        {isInCheck && (
                            <div className="mt-4 p-2 bg-red-600 rounded text-center font-bold">
                                CHECK!
                            </div>
                        )}
                        {gameStatus && (
                            <div className="mt-4 p-2 bg-blue-600 rounded text-center">
                                {gameStatus}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2 bg-[#262522] w-full flex justify-center">
                    <div className="pt-8">
                        <Button
                            color="#81b64c"
                            onClick={()=>{
                                socket.send(JSON.stringify({
                                    type:INIT_GAME
                                }))
                            }}
                        >Play
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}