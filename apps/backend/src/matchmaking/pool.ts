import matchStore from "./matchStore";
import chalk from "chalk";

type MatchCallback = (match: [number, number], matchId: string) => void;


class Pool {
  private pool: Array<number>;
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
    const time = Date.now() + (timeFact * 1000);
    const timeoutId = setTimeout(() => {
      this.timeOfLastCallToFindMatch.delete(userId);
    }, time);
    this.timeOfLastCallToFindMatch.set(userId, timeoutId);
  }

  join(userId: number, callback: MatchCallback): boolean {
    if (this.activeUsers.has(userId)) {
      return false;
    }

    if (!this.timeOfLastCallToFindMatch.has(userId)) {
      return false;
    }

    this.setTimeOfCall(userId);
    this.activeUsers.add(userId);
    this.pool.push(userId);
    this.findMatchCallback.set(userId, callback);
    this.findMatch();
    return true;
  }

  cancelUser(userId: number) {
    if (!this.activeUsers.has(userId)) {
      return;
    }
    this.activeUsers.delete(userId);
    this.cancelledUsers.set(userId, (this.cancelledUsers.get(userId) ?? 0) + 1);
    console.log(chalk.blue(`Cancelled count for user ${userId}: ${this.cancelledUsers.get(userId)}\n`))
  }

  private findMatch() {
    while (this.pool.length >= 2) {
      const userId1 = this.pool.shift()!;
      const userId2 = this.pool.shift()!;
      console.log(chalk.yellow(`At start of pool:\nuserId1: ${userId1}, userId2: ${userId2}, pool: ${this.pool}`));

      // Decrement the cancelled count for the first user if they have cancelled
      let cancelledCount1 = this.cancelledUsers.get(userId1) ?? 0;
      if (cancelledCount1) {
        --cancelledCount1;
        this.cancelledUsers.set(userId1, cancelledCount1);
        if (cancelledCount1 === 0) {
          this.findMatchCallback.delete(userId1);
          this.cancelledUsers.delete(userId1);
        }
      }

      console.log(chalk.blueBright(`CancelledCount1: ${cancelledCount1} for userId1: ${userId1}\n`))

      // Decrement the cancelled count for the second user if they have cancelled
      let cancelledCount2 = this.cancelledUsers.get(userId2) ?? 0;
      if (cancelledCount2) {
        --cancelledCount2;
        this.cancelledUsers.set(userId2, cancelledCount2);
        if (cancelledCount2 === 0) {
          this.findMatchCallback.delete(userId2);
          this.cancelledUsers.delete(userId2);
        }
      }

      console.log(chalk.blueBright(`CancelledCount2: ${cancelledCount2} for userId2: ${userId2}\n`))

      // If both the user has the cancelled of zero, they are not the same user and they are active, create a match
      if (cancelledCount1 === 0 && cancelledCount2 === 0 && userId1 !== userId2 && this.activeUsers.has(userId1) && this.activeUsers.has(userId2)) {

        this.activeUsers.delete(userId1);
        this.activeUsers.delete(userId2);

        const callback1 = this.findMatchCallback.get(userId1);
        const matchId = crypto.randomUUID();
        if (callback1) {
          callback1([userId1, userId2], matchId);
        }

        const callback2 = this.findMatchCallback.get(userId2);
        if (callback2) {
          callback2([userId1, userId2], matchId);
        }

        this.findMatchCallback.delete(userId1);
        this.findMatchCallback.delete(userId2);

        matchStore.createMatch(matchId, true);
        matchStore.addUserToMatch(matchId, userId1, null as any);
        matchStore.addUserToMatch(matchId, userId2, null as any);

        return;
      }
      
      // if either user has a cancelled count greater than zero, add them back to the pool
      if (cancelledCount1 > 0) {
        this.pool.unshift(userId1);
      }

      if (cancelledCount2 > 0) {
        this.pool.unshift(userId2);
      }

      // If both users are the same, remove the first user from the pool
      if (userId1 === userId2) {
        this.pool.shift();
      }

      console.log(chalk.yellow(`\nAt end of pool:\nuserId1: ${userId1}, userId2: ${userId2}, pool: ${this.pool}\n`))

      
    }
    return;
  }

}

export const pool = new Pool();