import WebSocket from 'ws';

const TIMER = 60 * 1000; // 60 seconds

const MatchStatus = {
  waitingForPlayers: 'waiting_for_players',
  inProgress: 'in_progress',
  completed: 'completed'
} as const;

const MatchTypes = {
  random: 'random',
  private: 'private'
} as const;

const BroadcastMessageTypes = {
  matchStart: 'match_start',
  matchEnd: 'match_end',
  opponentPositionUpdate: 'opponent_position_update'
} as const;

type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];
type MatchType = (typeof MatchTypes)[keyof typeof MatchTypes];
type BroadcastMessageType = (typeof BroadcastMessageTypes)[keyof typeof BroadcastMessageTypes];

interface PlayerInfo {
  userId: number;
  ws: WebSocket;
  connected: boolean;
  reconnectTimer?: NodeJS.Timeout;
}

interface MatchInfo {
  players: PlayerInfo[];
  status: MatchStatusType;
  matchType: MatchType;
  disconnectedCount: number;
  matchTimer?: NodeJS.Timeout;
  wordsTyped?: number;
  totalWords?: number;
}

interface BroadcastMessage {
  type: BroadcastMessageType;
  message: string;
}


class MatchStore {
  private matches: Map<string, MatchInfo>;

  constructor() {
    this.matches = new Map();
  }

  createMatch(matchId: string, isRandom: boolean) {
    try {
      if (this.matches.has(matchId)) {
        console.log('Attempted to create a match that already exists:', matchId);
        return;
      }

      const matchInfo: MatchInfo = {
        players: [],
        status: MatchStatus.waitingForPlayers,
        matchType: isRandom ? MatchTypes.random : MatchTypes.private,
        disconnectedCount: 0
      }
  
      this.matches.set(matchId, matchInfo);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }
  
  isValidMatch(matchId: string, userId: number): boolean {
    const matchExists = this.matches.has(matchId);
    if (!matchExists) {
      return false;
    }

    const matchInfo = this.matches.get(matchId);
    if (!matchInfo) {
      return false;
    }

    const usersInfo = matchInfo.players;

    return usersInfo.some(info => info.userId === userId);
  }

  addUserToMatch(matchId: string, userId: number, ws: WebSocket) {
    try {

      const matchInfo = this.matches.get(matchId);

      if(!matchInfo) {
        throw new Error('Match does not exist');
      }
  
      if (matchInfo.matchType === MatchTypes.random && matchInfo.players.length >= 2) {
        throw new Error('Random match is already full');
      }
      matchInfo.players.push({ userId, ws, connected: false });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  getUsersInMatchExceptUser(matchId: string, userId: number): PlayerInfo[] {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }
  
      const usersInfo = matchInfo.players.filter(userInfo => userInfo.userId !== userId);
  
      return usersInfo;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Error getting users in match for matchId:', matchId, 'userId:', userId, 'Error:', errorMessage);
      return [];
    }
  }

  updateUserWebSocket(matchId: string, userId: number, ws: WebSocket) {
    try {
      if (!this.isValidMatch(matchId, userId)) {
        throw new Error('Invalid matchId or userId');
      }
  
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }
      const userInfo = matchInfo.players.find(info => info.userId === userId);
  
      if(!userInfo) {
        throw new Error('User not present in match');
      }
  
      if (userInfo.ws) {
        throw new Error('WebSocket already exists for user in match');
      }
  
      userInfo.ws = ws;
      userInfo.connected = true;

      const allPlayersConnected = matchInfo.players.every(info => info.connected);
      if (allPlayersConnected) {
        matchInfo.status = MatchStatus.inProgress;
        const broadcastMessage = { type: BroadcastMessageTypes.matchStart, message: 'Match is starting!' };
        this.broadcastToMatch(matchId, broadcastMessage);
        this.startMatchTimer(matchId, TIMER);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }

  }

  private broadcastToMatch(matchId: string, message: BroadcastMessage) {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }

      matchInfo.players.forEach(player => {
        if (player.ws && player.ws.readyState === WebSocket.OPEN) {
          player.ws.send(JSON.stringify(message));
        }
      });
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }
  
  handleDisconnect(matchId: string, userId: number) {
    try {

      const matchInfo = this.matches.get(matchId);
      if (!this.isValidMatch(matchId, userId) || !matchInfo) {
        throw new Error('Invalid matchId or userId');
      }

      const playerInfo = matchInfo.players.find(info => info.userId === userId);
      if (!playerInfo) {
        throw new Error('User not found in match');
      }

      playerInfo.connected = false;

      if (matchInfo.status === MatchStatus.completed) {
        matchInfo.disconnectedCount++;
        if (matchInfo.disconnectedCount >= matchInfo.players.length) {
          this.deleteMatch(matchId);
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }

  }

  private startMatchTimer(matchId: string, duration: number) {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }

      matchInfo.matchTimer = setTimeout(() => {
        matchInfo.status = MatchStatus.completed;
        const broadcastMessage = { type: BroadcastMessageTypes.matchEnd, message: 'Match has ended!' };
        this.broadcastToMatch(matchId, broadcastMessage);
        this.endMatch(matchId);
      }, duration);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  private startMatchWordsCounter(matchId: string, totalWords: number) {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }

      matchInfo.wordsTyped = 0;
      matchInfo.totalWords = totalWords;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  private endMatch(matchId: string) {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }

      matchInfo.status = MatchStatus.completed;

      const playersDisconnected = matchInfo.players.every(player => !player.connected);
      if (playersDisconnected) {
        this.deleteMatch(matchId);
      }


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  private deleteMatch(matchId: string) {
    try {
      if (!this.matches.has(matchId)) {
        console.log('Attempted to delete non-existent match:', matchId);
        return;
      }
      this.matches.delete(matchId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

}

const matchStore = new MatchStore();
export default matchStore;