import matchStore from "./matchStore";
import chalk from "chalk";
import { Codes, CodesType, ErrorCodesType, PlayerInfo } from "@repo/types"

type MatchCallback = (match: [PlayerInfo, PlayerInfo], matchId: string) => void;


class Pool {
  private pool: Array<PlayerInfo>;
  private cancelledUsers: Map<number, number>;
  private activeUsers: Set<number>;
  private findMatchCallback: Map<number, MatchCallback>;
  private timeOfLastCallToFindMatch: Map<number, NodeJS.Timeout>;

  constructor() {
    this.pool = [];
    this.cancelledUsers = new Map();
    this.activeUsers = new Set();
    this.findMatchCallback = new Map();
    this.timeOfLastCallToFindMatch = new Map();
    console.log('Pool has started')
  }

  private setTimeOfCall(userId: number) {
    const timeFact = Math.floor(Math.random() * 4) + 2;
    console.log(chalk.blue(`Added cooldown for userId: ${userId} of ${timeFact}secs`))
    const time = (timeFact * 1000);
    const timeoutId = setTimeout(() => {
      this.timeOfLastCallToFindMatch.delete(userId);
    }, time);
    this.timeOfLastCallToFindMatch.set(userId, timeoutId);
  }

  join(userInfo: PlayerInfo, callback: MatchCallback): ErrorCodesType | typeof Codes.SUCCESS {
    const userId = userInfo.playerId;
    if (this.activeUsers.has(userId)) {
      return Codes.IN_MATCHMAKING;
    }

    if (this.timeOfLastCallToFindMatch.has(userId)) {
      return Codes.MATCHMAKING_COOLDOWN;
    }

    this.setTimeOfCall(userId);
    this.activeUsers.add(userId);
    this.pool.push(userInfo);
    this.findMatchCallback.set(userId, callback);
    this.findMatch();
    return Codes.SUCCESS;
  }

  cancelUser(userId: number) {
    if (!this.activeUsers.has(userId)) {
      return;
    }
    this.activeUsers.delete(userId);
    this.cancelledUsers.set(userId, (this.cancelledUsers.get(userId) ?? 0) + 1);
    this.findMatchCallback.delete(userId);
    console.log(chalk.blue(`Cancelled count for user ${userId}: ${this.cancelledUsers.get(userId)}\n`))
  }

  private getValidUserId(): PlayerInfo | null {
    while (this.pool.length > 0) {

      const userInfo = this.pool.shift()!;
      const userId = userInfo.playerId;
      let cancelledCount1 = this.cancelledUsers.get(userId) ?? 0;
      console.log(chalk.blue(`userId: ${userId}, cancelledCount1: ${cancelledCount1}\n`));
      
      if (cancelledCount1 === 0) {
        return userInfo;
      }
      
      // Decrement the cancelled count for the first user if they have cancelled
      --cancelledCount1;
      if (cancelledCount1 === 0) {
        this.cancelledUsers.delete(userId);
      } else {
        this.cancelledUsers.set(userId, cancelledCount1);
      }
    }
    return null;
  }

  private findMatch() {
    while (this.pool.length >= 2) {
      
      const userInfo1 = this.getValidUserId();

      if (userInfo1 === null) {
        return;
      }
      
      
      // Decrement the cancelled count for the second user if they have cancelled
      const userInfo2 = this.getValidUserId();

      if (userInfo2 === null) {
        // If the second user is null, add the first user back to the pool and return
        this.pool.unshift(userInfo1);
        return;
      }

      const userId1 = userInfo1.playerId;
      const userId2 = userInfo2.playerId;

      console.log(chalk.yellow(`UserId1: ${userId1}, UserId2: ${userId2}`))

      // If both the user are not the same user and they are active, create a match
      if (userId1 !== userId2 && this.activeUsers.has(userId1) && this.activeUsers.has(userId2)) {

        this.activeUsers.delete(userId1);
        this.activeUsers.delete(userId2);

        const callback1 = this.findMatchCallback.get(userId1);
        const matchId = crypto.randomUUID();
        if (callback1) {
          callback1([userInfo1, userInfo2], matchId);
        }

        const callback2 = this.findMatchCallback.get(userId2);
        if (callback2) {
          callback2([userInfo2, userInfo1], matchId);
        }

        this.findMatchCallback.delete(userId1);
        this.findMatchCallback.delete(userId2);

        matchStore.createMatch(matchId, true);
        matchStore.addUserToMatch(matchId, userId1, null as any);
        matchStore.addUserToMatch(matchId, userId2, null as any);

        return;
      }
      

      console.log(chalk.yellow(`\nAt end of findMatch:\nuserId1: ${userId1}, userId2: ${userId2}, pool: ${this.pool}\n`))

      
    }
    return;
  }

}

export const pool = new Pool();