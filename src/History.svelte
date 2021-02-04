
<script lang="ts">
    import type { History } from "./game/game-board";
    import { game } from "./store";
    import SquareLink from "./SquareLink.svelte";
    import { pieceTypesShort } from "./tables";

    export let historys: History[];

    const timeStyle = "2-digit";
    const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
        hour: timeStyle,
        minute: timeStyle,
        second: timeStyle,
    });
</script>

<table>
    {#each historys as history}
        <tr>
            <td>
                {#if history.piece.player === $game.firstPlayer}☗{:else}☖{/if}
            </td>
            <td>
                
                <SquareLink pos={history.piece.pos} />
                &gt;
                <SquareLink pos={history.to} />
                {pieceTypesShort[history.piece.type]}
            </td>
            <td>{dateTimeFormatter.format(history.at)}</td>
        </tr>
    {/each}
</table>

<style lang="scss">
    table {
        min-width: 8em;
        border-collapse: collapse;
    }
    tr { border-bottom: 1px solid black }
    td { padding: .2em }
</style>
