import { router } from "../../trpc";
import cancelMatchFind from "./cancelMatchFind";
import generateToken from "./generateToken";


const poolRouters = router({
  cancelMatchFind: cancelMatchFind,
  generateToken: generateToken
})

export default poolRouters