import { trpc } from "../../utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";

const useGetRandomWordFromServer = () => {
    const { data } = useQuery(trpc.randomWord.generate.queryOptions())
    if(data === undefined) {
        console.log(Error("data returned from server is undefined"))
    }
    const words : string[] = data ? data : [""]
    return words
}

const useGetGoogleAuthLink = () => {
    return useMutation(trpc.auth.google.link.mutationOptions())
}

const useGetGoogleTokenLink = () => {
    return useMutation(trpc.auth.google.token.mutationOptions())
}

const useGetGithubAuthLink = () => {
    return useMutation(trpc.auth.github.link.mutationOptions())
}

const useGetGithubTokenLink = () => {
    return useMutation(trpc.auth.github.token.mutationOptions())
}

const useSignup = () => {
    return useMutation(trpc.auth.signup.mutationOptions())
}

const useLogin = () => {
    return useMutation(trpc.auth.login.mutationOptions())
}

export {
    useGetRandomWordFromServer,
    useGetGoogleAuthLink,
    useGetGoogleTokenLink,
    useGetGithubAuthLink,
    useGetGithubTokenLink,
    useSignup,
    useLogin
}