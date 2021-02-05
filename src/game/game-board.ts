
import { Piece, PieceLike, Player } from "./piece";
import { PieceStand } from "./piece-stand";

const defaultInit = `
P1-GO-GO-GO-GO-OU-GO-GO-GO-GO
P2 * -GO *  *  *  *  * -GO * 
P3-GO-GO-GO-GO-GO-GO-GO-GO-GO
P4 *  *  *  *  *  *  *  *  * 
P5 *  *  *  *  *  *  *  *  * 
P6 *  *  *  *  *  *  *  *  * 
P7+FU+FU+FU+FU+FU+FU+FU+FU+FU
P8 * +KA *  *  *  *  * +HI * 
P9+KY+KE+GI+KI+OU+KI+GI+KE+KY
`;

interface HistoryLike {
    to: number;
    piece: PieceLike;
    takePieces: PieceLike[];
    doPromote: boolean;
}

export interface History extends HistoryLike {
    piece: Piece;
    takePieces: Piece[];
    at: number;
}

export class GameBoard {
    static readonly BOARD_SIZE = 9;
    readonly firstPlayer: Player = Piece.GO_PLAYER;
    turn: Player = this.firstPlayer;
    readonly board: PieceLike[] = createBoardFromCSALike(defaultInit);
    readonly shogiPlayerPieceStand = new PieceStand;
    readonly goPlayerPieceStand = new PieceStand;
    readonly history: History[] = [];
    readonly future: History[] = [];
    private toggleTurn() {
        this.turn = this.turn === Piece.GO_PLAYER ? Piece.SHOGI_PLAYER : Piece.GO_PLAYER;
    }
    private getPieceStand() {
        return this.turn === Piece.SHOGI_PLAYER
            ? this.shogiPlayerPieceStand
            : this.goPlayerPieceStand;
    }
    private addToPos(piece: Piece) {
        if(piece.pos === "stand") {
            this.getPieceStand().push(piece);
        } else {
            this.board[piece.pos] = piece;
        }
    }
    private removeFromPos(piece: Piece) {
        if(piece.pos === "stand") {
            this.getPieceStand().pop(piece);
        } else {
            this.board[piece.pos] = null;
        }
    }
    next(next: HistoryLike) {
        if(next.piece == null) return false;
        if(next.piece.pos === next.to) return false;
        const takePieces = next.takePieces.filter(Boolean) as Piece[]
        this.history.push({
            piece: next.piece,
            to: next.to,
            takePieces: takePieces,
            at: Date.now(),
            doPromote: next.doPromote,
        });

        this.board[next.to] = next.piece.move(next.to, next.doPromote);
        this.removeFromPos(next.piece);

        for(const piece of takePieces) {
            this.removeFromPos(piece);
            this.getPieceStand().push(piece);
        }

        this.toggleTurn();

        return true;
    }
    clearFuture() {
        this.future.splice(Infinity);
    }
    redo() {
        // FIXME: undo -> next -> redo でthis.futureが消えてない
        const next = this.future.pop();
        if(next === void 0) return false;

        return this.next(next);
    }
    undo(): boolean {
        const prev = this.history.pop();
        if(prev === void 0) return false;

        this.future.push(prev);

        this.board[prev.to] = null;
        this.addToPos(prev.piece);

        for(const piece of prev.takePieces) {
            this.addToPos(piece);
            this.getPieceStand().pop(piece);
        }

        this.toggleTurn();

        return true;
    }
    private takeDeadPieces(entry: number): Piece[] {
        // this.takeDeadPieces(entry + 1);
        // this.takeDeadPieces(entry - 1);
        // this.takeDeadPieces(entry + GameBoard.BOARD_SIZE);
        // this.takeDeadPieces(entry - GameBoard.BOARD_SIZE);
        return [];
    }
    putStone(to: number) {
        const putPiece = Piece.go(this.turn);
        const takePieces = this.takeDeadPieces(to);
        this.next({
            piece: putPiece,
            to,
            takePieces,
            doPromote: false,
        });
    }
    movePiece(from: number, to: number, doPromote=false) {
        this.next({
            piece: this.board[from],
            to,
            takePieces: [this.board[to]],
            doPromote,
        });
    }
}
