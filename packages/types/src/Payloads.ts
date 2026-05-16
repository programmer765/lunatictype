export interface PlayerInfo {
  playerId: number;
  username: string;
  pictureUrl: string | null;
}


export interface MatchFoundPayload {
  matchId: string;
  players: PlayerInfo[];
}


export interface PositionUpdatePayload {
  position: number,
  wpm: number,
  rawWpm: number
}

export interface WordListPayload {
  words: string[];
}