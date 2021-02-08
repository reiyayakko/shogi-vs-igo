
import { SHOGI_PLAYER, GO_PLAYER, Player } from "./player";
import { Piece, PieceLike } from "./piece";
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
    promote: boolean;
}

export interface History extends HistoryLike {
    piece: Piece;
    takePieces: Piece[];
    at: number;
}

export class GameBoard {
    static readonly BOARD_SIZE = 9;
    readonly firstPlayer: Player = GO_PLAYER;
    turn: Player = this.firstPlayer;
    readonly board: PieceLike[] = createBoardFromCSALike(defaultInit);
    readonly shogiPlayerPieceStand = new PieceStand;
    readonly goPlayerPieceStand = new PieceStand;
    readonly history: History[] = [];
    readonly future: History[] = [];
    private toggleTurn() {
        this.turn = this.turn === GO_PLAYER ? SHOGI_PLAYER : GO_PLAYER;
    }
    private getPieceStand() {
        return this.turn === SHOGI_PLAYER
            ? this.shogiPlayerPieceStand
            : this.goPlayerPieceStand;
    }
    private setPiece(piece: Piece) {
        if(piece.pos === "stand") {
            this.getPieceStand().push(piece);
        } else {
            this.board[piece.pos] = piece;
        }
    }
    private unsetPiece(piece: Piece) {
        if(piece.pos === "stand") {
            this.getPieceStand().pop(piece);
        } else {
            this.board[piece.pos] = null;
        }
    }
    next(next: HistoryLike) {
        const { piece } = next;
        if(piece == null || piece.pos === next.to) return false;

        const pieceStand = this.getPieceStand();
        if(piece.pos === "stand") {
            if(!pieceStand.has(piece.type)) return false;
        }

        const takePieces = next.takePieces.filter(Boolean) as Piece[];
        for(const takePiece of takePieces) {
            if(takePiece.pos === "stand") continue;
            this.unsetPiece(takePiece);
            pieceStand.push(takePiece);
        }

        this.unsetPiece(piece);
        this.setPiece(piece.move(next.to, next.promote));

        this.history.push({
            piece,
            to: next.to,
            takePieces,
            at: Date.now(),
            promote: next.promote,
        });

        this.toggleTurn();

        return true;
    }
    private clearFuture() {
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

        // this.unsetPiece(this.board[prev.to]);
        this.board[prev.to] = null;
        this.setPiece(prev.piece);

        const pieceStand = this.getPieceStand();
        for(const piece of prev.takePieces) {
            this.setPiece(piece);
            pieceStand.pop(piece);
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
        this.next({
            piece: Piece.go(this.turn),
            to,
            takePieces: this.takeDeadPieces(to),
            promote: false,
        });
    }
    putPiece(to: number, type: number) {
        this.next({
            piece: new Piece(this.turn, "stand", type),
            to,
            takePieces: [],
            promote: false,
        });
    }
    movePiece(from: number, to: number, doPromote=false) {
        this.next({
            piece: this.board[from],
            to,
            takePieces: [this.board[to]],
            promote: doPromote,
        });
    }
}
