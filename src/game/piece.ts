
import type { Pos, Vec2 } from "./types";

export type Player = typeof Piece.SHOGI_PLAYER | typeof Piece.GO_PLAYER;

export type PieceLike = Piece | null;

export class Piece {
    static readonly SHOGI_PLAYER = "shogi";
    static readonly GO_PLAYER = "go";
    constructor(
        public readonly player: Player,
        public readonly pos: Pos,
        public readonly type: number,
    ) {}
    move(pos: number, doPromote=false): Piece {
        return new Piece(this.player, pos, this.type + (doPromote ? Piece.PROMOTE : 0));
    }
    get isPromoted(): boolean {
        return Piece.PROMOTE < this.type;
    }
    static go(player: Player=this.GO_PLAYER) {
        return new this(player, "stand", this.GO);
    }
    static shogi(type: number) {
        return new this(this.SHOGI_PLAYER, "stand", type);
    }
    /** 成った駒のoffset */
    static readonly PROMOTE = 8;
    /** GO/Stone/碁石 */
    static readonly GO = 0;
    /** OU/King/王, 玉 */
    static readonly KING = 1;
    /** HI/Rook/飛車 */
    static readonly ROOK = 2;
    /** KA/Bishop/角行 */
    static readonly BISHOP = 3;
    /** KI/Gold/金 */
    static readonly GOLD = 4;
    /** GI/Silver/銀 */
    static readonly SILVER = 5;
    /** KE/Knight/桂馬 */
    static readonly KNIGHT = 6;
    /** KY/Lance/香車 */
    static readonly LANCE = 7;
    /** FU/Pawn/歩兵 */
    static readonly PAWN = 8;
    static canMove(type: number, amount: Vec2): boolean {
        switch(type) {
        case this.GO:
            return false;
        case this.KING:
            return Math.abs(amount.x) < 2 && Math.abs(amount.y) < 2;
        case this.ROOK + 1:
        case this.BISHOP + 1:
            return this.canMove(this.KING, amount)
                || this.canMove(type - 1, amount);
        case this.ROOK:
            return amount.x === 0 || amount.y === 0;
        case this.BISHOP:
            return Math.abs(amount.x) === Math.abs(amount.y);
        case this.GOLD:
            return amount.y === 1 ? Math.abs(amount.x) < 2
                : amount.y === 0 ? Math.abs(amount.x) === 1
                : amount.y === -1 && amount.x === 0;
        case this.SILVER:
            return amount.y === 1 ? Math.abs(amount.x) < 2
                : amount.y === -1 && Math.abs(amount.x) === 1;
        case this.KNIGHT:
            return Math.abs(amount.x) === 1 && amount.y === 2;
        case this.LANCE:
            return amount.x === 0 && amount.y > 0;
        case this.PAWN:
            return amount.x === 0 && amount.y === 1;
        default:
            if(type % 2 === 1) {
                return this.canMove(this.GOLD, amount);
            }
            throw new TypeError(`Invald ShogiPiece type. (${type})`);
        }
    }
}
