import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// this is a separate parser from tag-update, because tag-update also overwrites the attack with a zero
export class HeroAttackParser extends AbstractLineParser {
  regex = /GameState\.DebugPrintPower\(\) -\s+TAG_CHANGE Entity=\[entityName=.* id=(\d+) zone=PLAY zonePos=\d cardId=TB_BaconShop_HERO\w+ player=\d+\] tag=ATK value=([1-9]\d*)/;

  eventName = 'hero-attack' as const;

  lineMatched(parts: string[], gameState: GameState): void {
    const id = parseInt(parts[1], 10);
    const attack = parseInt(parts[2], 10);
		gameState.combatResult = [id, attack];
  }

  formatLogMessage(): string {
    return 'hero-attack';
  }

  shouldEmit(gameState: GameState): boolean {
    return false;
  }
}
