
<script lang="ts">
    import type { Player } from "./game/player";
    import { pieceTypesEN } from "./tables";

    export let player!: Player;
    export let type!: number;

    let alt = pieceTypesEN[type];
    if(alt === "king") {
        alt += player === "shogi" ? "-alpha" : "-beta";
    }
</script>

<div class={`type-${type} player-${player}`} role="img" aria-label={alt} />

<style lang="scss">
    @use "env";

    $shadow-color: rgb(#000, .5);
    @function shadow-props($sign: 1) {
        $offset: 1px * $sign;
        @return $offset $offset 3px $shadow-color;
    }

    * {
        display: inline-block;
        background-position: center;
        background-size: auto 80%;
        background-repeat: no-repeat;
        width: env.$size;
        height: env.$size;
        margin: auto;
        &.player-shogi {
            transform: scale(1, 1);
            filter: drop-shadow(shadow-props(1));
        }
        &.player-go {
            transform: scale(-1, -1);
            filter: drop-shadow(shadow-props(-1));
        }
    }
    .type-0 {
        &.player-shogi::before { background-color: #333; }
        &.player-go::before { background-color: #f8f8ff; }
        &::before {
            content: "";
            display: block;
            $margin: .8em;
            margin: $margin;
            width: env.$size - $margin*2;
            height: env.$size - $margin*2;
            border-radius: 50%;
            box-shadow: shadow-props(), 1px 1px 8px $shadow-color inset;
        }
    }
    .type-1 {
        &.player-shogi { background-image: url("../assets/shogi_king-alpha.png"); }
        &.player-go { background-image: url("../assets/shogi_king-beta.png"); }
    }
    $pieces: "rook", "bishop", "gold", "silver", "knight", "lance", "pawn";
    $i: 1;
    @each $type in $pieces {
        $i: $i + 1;
        .type-#{$i} {
            background-image: url("../assets/shogi_"+$type+".png");
        }
        @if $type != "gold" {
            .type-#{$i + 8} {
                background-image: url("../assets/shogi_"+$type+"_promoted.png");
            }
        }
    }
</style>
