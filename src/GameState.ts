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
  [tag: string]: any;
}

export interface Player extends Entity {
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
  }

  addPlayer(player: Player): Player {
    this.players.push(player);
    if (!player.discovery) {
    	player.discovery = {enabled: false, id: null};
    }
    return player;
  }

  addEntity(entity: Entity): Entity {
    this.entities.push(entity);
    return entity;
  }

  getEntityById(id: number): Entity | undefined {
    const tmp = this.getPlayerById(id);
    if (tmp) {
      return tmp;
    }

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

    if (tag === 'CARDTYPE' && value === 'PLAYER' && !this.getPlayerById(entity.id)) {
      this.addPlayer(entity as Player);
      this.removeEntityById(entity.id);
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
