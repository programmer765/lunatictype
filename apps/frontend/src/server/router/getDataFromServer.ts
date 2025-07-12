import { trpc } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

const useGetRandomWordFromServer = () => {
    const { data } = useQuery(trpc.randomWord.generate.queryOptions())
    if(data === undefined) {
        console.log(Error("data returned from server is undefined"))
    }
    const words : string[] = data ? data : [""]
    return words
}

export {
    useGetRandomWordFromServer,
}