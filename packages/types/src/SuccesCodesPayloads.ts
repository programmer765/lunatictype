export interface PlayerInfo {
  playerId: number;
  username: string;
  pictureUrl: string | null;
}


export interface MatchFoundPayload {
  matchId: string;
  players: PlayerInfo[];
}
