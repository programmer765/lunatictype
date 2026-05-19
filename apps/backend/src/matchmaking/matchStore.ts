import WebSocket from 'ws';
import { MatchSocketMessage, SocketMsgCodes, SocketMsgCodesType } from '@repo/types';
import { generate } from 'random-words';

const TIMER = 60 * 1000; // 60 seconds

const MatchStatus = {
  WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const;

const MatchTypes = {
  random: 'random',
  private: 'private'
} as const;

type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];
type MatchType = (typeof MatchTypes)[keyof typeof MatchTypes];

export interface ClientInfo {
  userId: number;
  ws: WebSocket;
  connected: boolean;
  ready: boolean;
  reconnectTimer?: NodeJS.Timeout;
}

interface MatchInfo {
  players: ClientInfo[];
  status: MatchStatusType;
  matchType: MatchType;
  disconnectedCount: number;
  matchTimer?: NodeJS.Timeout;
  wordsTyped?: number;
  totalWords?: number;
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
        status: MatchStatus.WAITING_FOR_PLAYERS,
        matchType: isRandom ? MatchTypes.random : MatchTypes.private,
        disconnectedCount: 0
      }
  
      this.matches.set(matchId, matchInfo);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  setClientReady(matchId: string, userId: number) {
    try {
      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Match does not exist');
      }

      const userInfo = matchInfo.players.find(info => info.userId === userId);
      if (!userInfo) {
        throw new Error('User not found in match');
      }
      userInfo.ready = true;
      const allPlayersReady = matchInfo.players.every(info => info.ready);
      const allPlayersConnected = matchInfo.players.every(info => info.connected);
      if (allPlayersReady && allPlayersConnected) {
        matchInfo.status = MatchStatus.IN_PROGRESS;
        const broadcastMessage : MatchSocketMessage = {
          code: SocketMsgCodes.MATCH_START,
          isError: false,
        };
        this.broadcastToMatch(matchId, broadcastMessage);
        // this.startMatchTimer(matchId, TIMER);
      }
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
        throw new Error('This match is already full');
      }
      matchInfo.players.push({ userId, ws, ready: false, connected: false });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }


  sendWordsListToUsers(matchId: string) {
    try {

      const matchInfo = this.matches.get(matchId);
      if (!matchInfo) {
        throw new Error('Invalid matchId');
      }

      const words = generate({ exactly: 500, maxLength: 6});
      if(Array.isArray(words) === false || words === undefined || words === null) {
        throw new Error("randomWords did not generate propery. It is either not an array or undefined")
      }
      const wordsArray = Array.isArray(words) ? words : [""]

      const message : MatchSocketMessage = {
        code: SocketMsgCodes.WORD_LIST,
        isError: false,
        payload: {
          words: wordsArray
        }
      }
      
      this.broadcastToMatch(matchId, message);


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }


  getUsersInMatchExceptUser(matchId: string, userId: number): ClientInfo[] {
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

      // const allPlayersConnected = matchInfo.players.every(info => info.connected);
      // if (allPlayersConnected) {
      //   matchInfo.status = MatchStatus.IN_PROGRESS;
      //   const broadcastMessage : MatchSocketMessage = {
      //     code: SocketMsgCodes.MATCH_START,
      //     isError: false,
      //   };
      //   this.broadcastToMatch(matchId, broadcastMessage);
      //   // this.startMatchTimer(matchId, TIMER);
      // }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }

  }

  private broadcastToMatch(matchId: string, message: MatchSocketMessage) {
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

      playerInfo.ready = false;
      playerInfo.connected = false;

      if (matchInfo.status === MatchStatus.COMPLETED) {
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
        matchInfo.status = MatchStatus.COMPLETED;
        const broadcastMessage : MatchSocketMessage = {
          code: SocketMsgCodes.MATCH_END,
          isError: false,
        };
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

      matchInfo.status = MatchStatus.COMPLETED;

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