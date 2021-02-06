
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
    /** OU/King/王将, 玉将 */
    static readonly KING = 1;
    /** HI/Rook/飛車 (RY/竜王) */
    static readonly ROOK = 2;
    /** KA/Bishop/角行 (UM/竜馬) */
    static readonly BISHOP = 3;
    /** KI/Gold/金将 */
    static readonly GOLD = 4;
    /** GI/Silver/銀将 (NG/全/成銀) */
    static readonly SILVER = 5;
    /** KE/Knight/桂馬 (NK/圭/成桂) */
    static readonly KNIGHT = 6;
    /** KY/Lance/香車 (NY/杏/成香) */
    static readonly LANCE = 7;
    /** FU/Pawn/歩兵 (TO/と金) */
    static readonly PAWN = 8;
    static canMove(type: number, amount: Vec2): boolean {
        const abs = Math.abs;
        switch(type) {
        case this.GO:
            return false;
        case this.KING:
            return abs(amount.x) < 2 && abs(amount.y) < 2;
        case this.ROOK + this.PROMOTE:
        case this.BISHOP + this.PROMOTE:
            return this.canMove(this.KING, amount)
                || this.canMove(type - this.PROMOTE, amount);
        case this.ROOK:
            return amount.x === 0 || amount.y === 0;
        case this.BISHOP:
            return abs(amount.x) === abs(amount.y);
        case this.SILVER + this.PROMOTE:
        case this.KNIGHT + this.PROMOTE:
        case this.LANCE + this.PROMOTE:
        case this.PAWN + this.PROMOTE:
        case this.GOLD:
            return amount.y === 1 ? abs(amount.x) < 2
                : amount.y === 0 ? abs(amount.x) === 1
                : amount.y === -1 && amount.x === 0;
        case this.SILVER:
            return amount.y === 1 ? abs(amount.x) < 2
                : amount.y === -1 && abs(amount.x) === 1;
        case this.KNIGHT:
            return abs(amount.x) === 1 && amount.y === 2;
        case this.LANCE:
            return amount.x === 0 && amount.y > 0;
        case this.PAWN:
            return amount.x === 0 && amount.y === 1;
        default:
            throw new TypeError(`Invald ShogiPiece type. (${type})`);
        }
    }
}
