import { trpc } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

const useGetRandomWordFromServer = () => {
    const { data } = useQuery(trpc.randomWord.generate.queryOptions())
    console.log(JSON.stringify(data));
}

const useGetUserInfoFromServer : object = () => {
    const userQuery = useQuery(trpc.user.getUser.queryOptions())
    console.log(userQuery.data);

}

export {
    useGetRandomWordFromServer,
    useGetUserInfoFromServer
}