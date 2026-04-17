
export class Pool {
  private pool: Array<number>;
  private cancelledUsers: Map<number, number>;
  private activeUsers: Set<number>;

  constructor() {
    this.pool = [];
    this.cancelledUsers = new Map();
    this.activeUsers = new Set();
    console.log('Pool is started')
  }

  addUser(userId: number) {
    if (this.activeUsers.has(userId)) {
      return;
    }
    this.activeUsers.add(userId);
    this.pool.push(userId);
  }

  cancelUser(userId: number) {
    if (this.activeUsers.has(userId)) {
      this.activeUsers.delete(userId);
    }
    this.cancelledUsers.set(userId, (this.cancelledUsers.get(userId) ?? 0) + 1);
  }

  findMatch(): [number, number] | null {
    while (this.pool.length >= 2) {
      const userId1 = this.pool.shift()!;
      const userId2 = this.pool.shift()!;

      const cancelledCount1 = this.cancelledUsers.get(userId1) ?? 0;
      const cancelledCount2 = this.cancelledUsers.get(userId2) ?? 0;

      if (cancelledCount1) {
        this.cancelledUsers.set(userId1, cancelledCount1 - 1);
        continue;
      }

      if (cancelledCount2) {
        this.cancelledUsers.set(userId2, cancelledCount2 - 1);
        continue;
      }

      if (cancelledCount1 === 0 && cancelledCount2 === 0) {

        this.activeUsers.delete(userId1);
        this.activeUsers.delete(userId2);

        return [userId1, userId2];
      }
      
      if (cancelledCount1 === 0) {
        this.pool.unshift(userId1);
      }

      if (cancelledCount2 === 0) {
        this.pool.unshift(userId2);
      }
      
    }
    return null;
  }

}