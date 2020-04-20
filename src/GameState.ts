import {Class} from './data/meta';

export interface Secret {
  cardId: string;
  cardClass: Class;
  cardName: string;
  timestamp: number;
}

export interface Quest {
  cardName: string;
  class: Class;
  progress: number;
  requirement: number;
  sidequest: boolean;
  timestamp: number;
}

export interface Entity {
  id: number;
  cardId?: string;
  CARDTYPE?: string;
  CONTROLLER?: number;
  ZONE?: string;
  ZONE_POSITION?: number;
  [tag: string]: (number | string);
}

export interface Player {
  id: number;
  name: string;
  status: 'LOST' | 'WON' | 'TIED' | '';
  turn: boolean;
  quests: Quest[];
  timeout: number;
  cardCount: number;
  position: 'top' | 'bottom';
  secrets: Secret[];
  discovery: {
    enabled: boolean;
    id: string | null;
  };
  cardsReplacedInMulligan: number;
}

export class GameState {
  playerCount: number;

  gameOverCount: number;

  players: Player[];

  mulliganActive: boolean;

  turnStartTime: Date;

  step: string;

  _currentEntity: number;

  entities: Entity[];

  turn: number;
  
  combatResult: number[];

  constructor() {
    this.reset();
  }

  static isNumber(n: any): boolean {
    return !Number.isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  get numPlayers(): number {
    return this.players.length;
  }

  reset(): void {
    this.step = '';
    this._currentEntity = -1;
    this.entities = [];
    this.turn = 0;
    this.players = [];
    this.gameOverCount = 0;
    this.combatResult = [0, 0];
  }

  addPlayer(player: Player): Player {
    this.players.push(player);
    return player;
  }

  addEntity(entity: Entity): Entity {
    this.entities.push(entity);
    return entity;
  }

  getEntityById(id: number): Entity | undefined {
    return this.entities.find(entity => entity.id === id);
  }

  removeEntityById(index: number): void {
    this.entities.splice(this.entities.findIndex(entity => entity.id === index), 1);
  }

  getPlayerById(index: number): Player | undefined {
    return this.players.find(player => player.id === index);
  }

  getPlayerByPosition(position: 'top' | 'bottom'): Player | undefined {
    return this.players.find(player => player.position === position);
  }

  getPlayerByName(name: string): Player | undefined {
    return this.players.find(player => player.name === name);
  }

  getAllPlayers(): Player[] {
    return this.players.slice(0);
  }

  tagChangeByEntity(entity: Entity, tag: string, value: string): void {
    if (GameState.isNumber(tag)) return; // eslint-disable-line
    if (GameState.isNumber(value)) {
      entity[tag] = parseInt(value, 10);
    } else {
      entity[tag] = value;
    }
  }

  setCurrentEntity(id: number): void {
    if (id !== -1) {
      const entity = this.getEntityById(id);
      if (!entity) this.addEntity({id: id}); // eslint-disable-line
    }

    this._currentEntity = id;
  }

  tagChangeById(id: number, tag: string, value: string): void {
    let x = this.getEntityById(id);
    if (!x) x = this.addEntity({id: id});  // eslint-disable-line
    if (x) this.tagChangeByEntity(x, tag, value); // eslint-disable-line
  }

  tagChange(tag: string, value: string): void {
    if (this._currentEntity < 0) {
      return;
    }

    this.tagChangeById(this._currentEntity, tag, value);
  }
}
