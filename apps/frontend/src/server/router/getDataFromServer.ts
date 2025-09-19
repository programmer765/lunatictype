import { trpc } from "../../utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";

const useGetRandomWordFromServer = () => {
    return useQuery(trpc.randomWord.generate.queryOptions(undefined, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    }))
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

const useIsLoggedIn = () => {
    return useQuery(trpc.auth.isLoggedIn.queryOptions(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: 0,
    }))
}

export {
    useGetRandomWordFromServer,
    useGetGoogleAuthLink,
    useGetGoogleTokenLink,
    useGetGithubAuthLink,
    useGetGithubTokenLink,
    useSignup,
    useLogin,
    useIsLoggedIn
}