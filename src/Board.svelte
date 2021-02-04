
<script lang="ts">
    import type { PieceLike } from "./game/piece";
    import Piece from "./Piece.svelte";
    import { chineseNumeralTable } from "./tables";
    import { squareLink } from "./store";

    export let board: PieceLike[];
</script>

<div class="board">
    <div class="columns-scale">
        {#each "987654321" as char}
            <span>{char}</span>
        {/each}
    </div>
    <div class="rows-scale">
        {#each chineseNumeralTable as char}
            <span>{char}</span>
        {/each}
    </div>
    <div class="squares">
        {#each board as piece, i}
            <div class="square" class:is-select={$squareLink === i} on:click={() => squareLink.change(i)}>
                {#if piece}
                    <Piece type={piece.type} player={piece.player} />
                {/if}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "env";
    $lineWidth: 2em;
    .board {
        width: env.$size * 9 + $lineWidth * 2;
        position: relative;
        padding: 0 0 $lineWidth $lineWidth;
        $col1: rgb(#ab8b49, 0.5);
        $col2: #ee9649;
        background: linear-gradient(90deg, $col1, $col1 45%, $col1),
                    repeating-radial-gradient(
                        ellipse at 45% 500%,
                        $col2,
                        $col2 0.25%,
                        lighten($col2, 4%) 0.5%,
                        lighten($col2, 4%) 1%,
                    );
    }
    @mixin scale($width, $height) {
        span {
            display: inline-block;
            width: $width;
            height: $height;
            text-align: center;
            line-height: $height;
        }
    }
    .columns-scale {
        margin-right: $lineWidth;
        @include scale(env.$size, $lineWidth);
    }
    .rows-scale {
        width: $lineWidth;
        position: absolute;
        right: 0;
        @include scale($lineWidth, env.$size);
    }
    .squares {
        width: calc(#{env.$size} * 9 + 4px);
        display: flex;
        flex-wrap: wrap;
        border: 2px saddlebrown solid;
    }
    .square {
        border: 1px saddlebrown solid;
        width: env.$size;
        height: env.$size;
        &.is-select {
            animation: blink 600ms alternate infinite;
            @keyframes blink {
                100% { box-shadow: 0 0 1em #a05000 inset; }
            }
        }
    }
</style>
