import WebSocket from 'ws';


interface MatchUsersInfo {
  userId: number;
  ws: WebSocket;
}


class MatchStore {
  private matches: Map<string, MatchUsersInfo[]>;
  private isRandomMatch: boolean;

  constructor() {
    this.matches = new Map();
    this.isRandomMatch = false;
  }

  createMatch(matchId: string, isRandom: boolean) {
    if (this.matches.has(matchId)) {
      console.log('Attempted to create a match that already exists:', matchId);
      return;
    }

    this.matches.set(matchId, []);
    this.isRandomMatch = isRandom;
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
    this.matches.get(matchId)?.push({ userId, ws });
  }

  getUsersInMatchExceptUser(matchId: string, userId: number): MatchUsersInfo[] {
    if (!this.matches.has(matchId)) {
      console.log('Attempted to get users from non-existent match:', matchId);
      return [];
    }

    const usersInfo = this.matches.get(matchId)!.filter(userInfo => userInfo.userId !== userId);

    return usersInfo;
  }

  updateUserWebSocket(matchId: string, userId: number, ws: WebSocket) {
    if (!this.isValidMatch(matchId, userId)) {
      console.log('Attempted to update WebSocket for non-existent match:', matchId);
      ws.close(1008, 'Match does not exist');
      return;
    }

    const usersInfo = this.matches.get(matchId)!;
    const userInfo = usersInfo.find(info => info.userId === userId);

    if(!userInfo) {
      console.log('Attempted to update WebSocket for user not in match:', userId, 'matchId:', matchId);
      ws.close(1008, 'User not present in match');
      return;
    }

    if (userInfo.ws) {
      console.log('Attempted to update WebSocket for user that already has a WebSocket in match:', userId, 'matchId:', matchId);
      ws.close(1008, 'WebSocket already exists for user in match');
      return;
    }

    userInfo.ws = ws;

  }

}

const matchStore = new MatchStore();
export default matchStore;