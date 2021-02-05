
import { Piece } from "./piece";

export class PieceStand {
    [Piece.GO] = Infinity;
    [Piece.ROOK] = 0;
    [Piece.BISHOP] = 0;
    [Piece.GOLD] = 0;
    [Piece.SILVER] = 0;
    [Piece.KNIGHT] = 0;
    [Piece.LANCE] = 0;
    [Piece.PAWN] = 0;
    push(piece: Piece): void {
        let type = piece.type;
        if(piece.isPromoted) type -= Piece.PROMOTE;

        this[type as keyof PieceStand]++;
    }
    has(type: number): boolean {
        return this[type as keyof PieceStand] > 0;
    }
    pop(piece: Piece): void {
        let type = piece.type;
        if(piece.isPromoted) type -= Piece.PROMOTE;

        if(this.has(type)) {
            this[type as keyof PieceStand]--;
        }
    }
}
