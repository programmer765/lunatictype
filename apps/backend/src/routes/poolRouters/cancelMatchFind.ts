import { pool } from "../../matchmaking/pool"
import { protectedProcedure } from "../../trpc"


const cancelMatchFind = protectedProcedure.query(({ ctx}) => {
  if(!ctx.user) {
    return { success: false, message: "User not authenticated" }
  }
  const userId = ctx.user.id;
  pool.cancelUser(parseInt(userId));
  console.log(`User ${userId} cancelled matchmaking`);
  return { success: true, message: "Matchmaking cancelled" }
})

export default cancelMatchFind;