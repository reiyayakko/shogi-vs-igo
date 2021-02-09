
<script lang="ts">
    import type { Player } from "./game/player";
    import type { PieceStand } from "./game/piece-stand";
    import Piece from "./Piece.svelte";

    export let stand: PieceStand;
    export let player: Player;
</script>

<div>
    {#each stand.entries() as [type, amount]}
        {#if amount > 0}
            <div class="stand-item">
                <Piece type={+type} {player} />
                <span>
                    {#if amount === Infinity}∞{:else}{amount}{/if}
                </span>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    @use "env";
    .stand-item {
        width: env.$size;
        height: env.$size;
        display: inline-block;
        position: relative;
    }
    span {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 4px 10px;
        $shadow: 0 0 4px whitesmoke;
        text-shadow: $shadow, $shadow, $shadow, $shadow;
    }
</style>
