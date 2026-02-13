import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"

import React from 'react'

interface ErrorProps {
  message: string
}


export const ErrorAlert: React.FC<ErrorProps> = ({ message }) => {
  return (
    <>
      <AlertDialog open={true}>
        <AlertDialogContent className="text-white bg-[#111111] outline-none border border-[#272727]">
          <AlertDialogHeader className="font-bold border-[#272727] border-b py-1">
            <AlertDialogTitle>Error</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="font-light">
            {message}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#272727] outline-none border border-[#272727]" onClick={() => {window.location.reload()}}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}