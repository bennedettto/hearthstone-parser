import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if a card is changing tags.
export class CombatStartsParser extends AbstractLineParser {
	regex = /GameState.DebugPrintPower\(\) -\s+TAG_CHANGE Entity=GameEntity tag=NUM_TURNS_IN_PLAY value=(\d+)/;

	eventName = 'combat-starts' as const;

	lineMatched(parts: string[], gameState: GameState): void {
		gameState.turn = parseInt(parts[1], 10);
	}

	formatLogMessage(_: string[]): string {
		return 'combat starts';
	}

	shouldEmit(gameState: GameState): boolean {
		return gameState.turn >= 2 && (gameState.turn % 2 === 1);
	}
}
