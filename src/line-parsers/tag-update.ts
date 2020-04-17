import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if the game is over.
export class TagUpdateParser extends AbstractLineParser {
  regex = /./;

  TagChangeRegex = /^\[Power\] GameState\.DebugPrintPower\(\) -\s+TAG_CHANGE Entity=(.+) tag=(\w+) value=(\w+)/;

  CreationRegex = /^\[Power\] GameState\.DebugPrintPower\(\) -\s*FULL_ENTITY - (Creating|Updating).*(id|ID)=(\d+).*CardID=(\w*)/;

  UpdatingEntityRegex = /^\[Power\] GameState\.DebugPrintPower\(\) -\s*(SHOW_ENTITY|CHANGE_ENTITY) - Updating Entity=(.+) CardID=(\w*)/;

  CreationTagRegex = /^\[Power\] GameState\.DebugPrintPower\(\) -\s*tag=(\w+) value=(\w+)/;

  otherRegex = /^\[Power\] GameState\.DebugPrintPower\(\) -\s*(GameEntity|Player) EntityID=(\d+)/;

  eventName = 'minion-update' as const;

  getEntityIdFromRawEntity(rawEntity: string): number {
    if (rawEntity.startsWith('[')) {
      const tmp = /id=(\d+)/.exec(rawEntity);
      if (tmp) {
        return parseInt(tmp[1], 10);
      }
    }

    if (GameState.isNumber(rawEntity)) {
      return parseInt(rawEntity, 10);
    }

    return -1;
  }

  lineMatched(parts: string[], gameState: GameState): void {
    const line = parts[0];
    /* Entity = [...] should be done by tag-change.js */
    if (this.TagChangeRegex.exec(line)) {
      if (parts[1] === 'GameEntity' && parts[2] === 'STEP') {
        gameState.step = parts[3];
      } else {
        const entityId = this.getEntityIdFromRawEntity(parts[1]);
        if (entityId >= 0) {
          gameState.tagChangeById(entityId, parts[2], parts[3]);
        }
      }
    } else if (this.CreationRegex.exec(line)) {
      const id = parseInt(parts[3], 10);
      const cardId = parts[4];
      const entity = gameState.getEntityById(id);
      if (!entity) {
        gameState.addEntity({id: id, cardId: cardId});
      }

      gameState.setCurrentEntity(id);
    } else if (this.UpdatingEntityRegex.exec(line)) {
      const cardId = parts[3];
      const entityId = this.getEntityIdFromRawEntity(parts[2]);
      if (entityId >= 0) {
        let entity = gameState.getEntityById(entityId);
        if (!entity) {
          entity = gameState.addEntity({id: entityId});
        }

        if (entity && !entity.cardId) {
          gameState.tagChangeByEntity(entity, 'cardId', cardId);
        }
      }

      gameState.setCurrentEntity(entityId);
    } else if (this.CreationTagRegex.exec(line) && !line.includes('HIDE_ENTITY')) {
      gameState.tagChange(parts[1], parts[2]);
      //      } else if (line.includes("HIDE_ENTITY")) {
      //      console.log("hide entity not implemented");
    } else if (this.otherRegex.exec(line)) {
      gameState.setCurrentEntity(parseInt(parts[2], 10));
    }
  }

  parseLine(line: string): any {
    let x: any;
    if (x = this.TagChangeRegex.exec(line)) return x; // eslint-disable-line
    if (x = this.CreationRegex.exec(line)) return x; // eslint-disable-line
    if (x = this.UpdatingEntityRegex.exec(line)) return x; // eslint-disable-line
    if (x = this.CreationTagRegex.exec(line)) return x; // eslint-disable-line
    return this.otherRegex.exec(line);
  }

  formatLogMessage(_: string[], gameState: GameState): string | false {
    if (gameState.gameOverCount === 2) {
      return 'The current game has ended.';
    }

    return false;
  }

  shouldEmit(gameState: GameState): boolean {
    // When both players have lost, emit a game-over event.
    return gameState.gameOverCount === 2;
  }
}
