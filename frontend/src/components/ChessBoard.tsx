import type { PieceSymbol, Square, Color } from "chess.js"
import { useState } from "react";
import { MOVE } from "../screens/Game";

export function ChessBoard({board,socket,chess,playerColor,isMyTurn,isInCheck}:{
    board:({
        type:PieceSymbol;
        color:Color;
    }|null)[] [];
    socket:WebSocket;
    chess: any; // Chess.js instance
    playerColor: 'w'|'b'|null;
    isMyTurn: boolean;
    isInCheck: boolean;
}){
    const[from,setFrom]=useState<null|Square>(null);
    const[to,setTo]=useState<null|Square>(null);
    const[validMoves,setValidMoves]=useState<Square[]>([]);

    const getSquareFromPosition = (row: number, col: number): Square => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return `${files[col]}${ranks[row]}` as Square;
    };

    const getPieceIcon = (piece: { type: PieceSymbol; color: Color } | null): string => {
        if (!piece) return '';
        
        const pieceIcons = {
            'w': {
                'p': '♙', // white pawn
                'r': '♖', // white rook
                'n': '♘', // white knight
                'b': '♗', // white bishop
                'q': '♕', // white queen
                'k': '♔'  // white king
            },
            'b': {
                'p': '♟', // black pawn
                'r': '♜', // black rook
                'n': '♞', // black knight
                'b': '♝', // black bishop
                'q': '♛', // black queen
                'k': '♚'  // black king
            }
        };
        
        return pieceIcons[piece.color][piece.type] || '';
    };

    const handleSquareClick = (square: Square) => {
        // Only allow moves if it's the player's turn
        if (!isMyTurn) {
            console.log("Not your turn!");
            return;
        }

        if (!from) {
            // First click - select piece
            const piece = chess.get(square);
            if (piece && piece.color === playerColor) {
                setFrom(square);
                // Get valid moves for this piece
                const moves = chess.moves({ square, verbose: true });
                setValidMoves(moves.map((move: any) => move.to));
            }
        } else {
            // Second click - make move
            if (validMoves.includes(square)) {
                setTo(square);
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: {
                        from,
                        to: square
                    }
                }));
                console.log({ from, to: square });
                setFrom(null);
                setTo(null);
                setValidMoves([]);
            } else {
                // Invalid move, reset selection
                setFrom(null);
                setValidMoves([]);
            }
        }
    };

    return <div className="text-white-200">
        {board.map((row,i)=>{
            return <div key={i} className="flex">
                {row.map((square,j)=>{
                    const squareCoord = getSquareFromPosition(i, j);
                    const isSelected = from === squareCoord;
                    const isValidMove = validMoves.includes(squareCoord);
                    const isKingInCheck = isInCheck && square?.type === 'k' && square?.color === chess.turn();
                    
                    return <div 
                        key={j} 
                        className={`w-16 h-16 ${(i+j)%2===0?'bg-[#ebecd0]':'bg-[#779556]'} ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isValidMove ? 'ring-2 ring-green-500' : ''} ${isKingInCheck ? 'ring-2 ring-red-500' : ''}`}
                        onClick={() => handleSquareClick(squareCoord)}
                        style={{ cursor: isMyTurn ? 'pointer' : 'not-allowed', opacity: isMyTurn ? 1 : 0.7 }}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col items-center">
                                <span 
                                    className="text-4xl font-bold leading-none"
                                    style={{ 
                                        fontSize: '2rem',
                                        lineHeight: '1',
                                        color: square?.color === 'b' ? '#000' : '#fff',
                                        textShadow: square?.color === 'w' ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
                                        fontFamily: 'Arial, "Segoe UI", sans-serif'
                                    }}
                                >
                                    {getPieceIcon(square)}
                                </span>
                            </div>
                        </div>
                    </div>
                })}
                </div>
        })}
    </div>
}