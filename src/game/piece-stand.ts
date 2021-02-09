
import { Piece } from "./piece";

type PieceType = (
    | typeof Piece.GO
    | typeof Piece.ROOK
    | typeof Piece.BISHOP
    | typeof Piece.GOLD
    | typeof Piece.SILVER
    | typeof Piece.KNIGHT
    | typeof Piece.LANCE
    | typeof Piece.PAWN
);

export class PieceStand {
    private [Piece.GO] = Infinity;
    private [Piece.ROOK] = 0;
    private [Piece.BISHOP] = 0;
    private [Piece.GOLD] = 0;
    private [Piece.SILVER] = 0;
    private [Piece.KNIGHT] = 0;
    private [Piece.LANCE] = 0;
    private [Piece.PAWN] = 0;
    push(piece: Piece): void {
        let type = piece.type;
        if(piece.isPromoted) type -= Piece.PROMOTE;

        this[type as PieceType]++;
    }
    has(type: number): boolean {
        return this[type as PieceType] > 0;
    }
    pop(piece: Piece): void {
        let type = piece.type;
        if(piece.isPromoted) type -= Piece.PROMOTE;

        if(this.has(type)) {
            this[type as PieceType]--;
        }
    }
    entries(): [number, number][] {
        return Object.entries(this).map(([type, amount]) => [+type, amount]);
    }
}
