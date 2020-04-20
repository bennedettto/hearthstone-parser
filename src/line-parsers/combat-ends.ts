import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if a card is changing tags.
export class CombatEndsParser extends AbstractLineParser {
  regex = /GameState\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=BOARD_VISUAL_STATE value=1/;

  eventName = 'combat-ends' as const;

  lineMatched(parts: string[], gameState: GameState): void {
  }

  formatLogMessage(): string {
    return 'combat ends';
  }

  shouldEmit(gameState: GameState): boolean {
    return true;
  }
}