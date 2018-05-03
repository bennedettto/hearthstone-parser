import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if the game is over.
export class GameOverLineParser extends AbstractLineParser {
	regex = /\[Power\] GameState\.DebugPrintPower\(\) - TAG_CHANGE Entity=(.*) tag=PLAYSTATE value=(LOST|WON|TIED)/;
	eventName = 'game-over';

	lineMatched(parts: string[], gameState: GameState) {
		// Set the status for the appropriate player.
		const player = gameState.getPlayerByName(parts[0]);
		if (player) {
			player.status = parts[1];
		}

		gameState.gameOverCount++;
		if (gameState.gameOverCount === 2) {
			gameState.reset();
		}
	}

	formatLogMessage(_parts: string[], gameState: GameState) {
		if (gameState.gameOverCount === 2) {
			return 'The current game has ended.';
		}

		return false;
	}

	shouldEmit(gameState: GameState) {
		// When both players have lost, emit a game-over event.
		return gameState.gameOverCount === 2;
	}
}