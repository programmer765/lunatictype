import WebSocket from 'ws';

const MatchStatus = {
  waitingForPlayers: 'waiting_for_players',
  inProgress: 'in_progress',
  completed: 'completed'
} as const;

type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];

interface MatchUsersInfo {
  userId: number;
  ws: WebSocket;
  status: MatchStatusType;
}



class MatchStore {
  private matches: Map<string, MatchUsersInfo[]>;
  private isRandomMatch: boolean;

  constructor() {
    this.matches = new Map();
    this.isRandomMatch = false;
  }

  createMatch(matchId: string, isRandom: boolean) {
    try {
      if (this.matches.has(matchId)) {
        console.log('Attempted to create a match that already exists:', matchId);
        return;
      }
  
      this.matches.set(matchId, []);
      this.isRandomMatch = isRandom;

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

    const usersInfo = this.matches.get(matchId);
    if (!usersInfo) {
      return false;
    }

    return usersInfo.some(info => info.userId === userId);
  }

  addUserToMatch(matchId: string, userId: number, ws: WebSocket) {
    try {
      if (!this.matches.has(matchId)) {
        console.log('Attempted to add user to non-existent match:', matchId);
        ws.close(1008, 'Match does not exist');
        return;
      }
  
      if (this.isRandomMatch && this.matches.get(matchId)!.length >= 2) {
        console.log('Attempted to add user to a full random match:', matchId);
        ws.close(1008, 'Match is full');
        return;
      }
      this.matches.get(matchId)?.push({ userId, ws, status: MatchStatus.waitingForPlayers });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }
  }

  getUsersInMatchExceptUser(matchId: string, userId: number): MatchUsersInfo[] {
    try {
      if (!this.matches.has(matchId)) {
        console.log('Attempted to get users from non-existent match:', matchId);
        return [];
      }
  
      const usersInfo = this.matches.get(matchId)!.filter(userInfo => userInfo.userId !== userId);
  
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
  
      const usersInfo = this.matches.get(matchId)!;
      const userInfo = usersInfo.find(info => info.userId === userId);
  
      if(!userInfo) {
        throw new Error('User not present in match');
      }
  
      if (userInfo.ws) {
        throw new Error('WebSocket already exists for user in match');
      }
  
      userInfo.ws = ws;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new Error(errorMessage);
    }

  }

  deleteMatch(matchId: string) {
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