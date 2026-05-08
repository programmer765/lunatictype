import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog"

import { ErrorState } from "@repo/types"

import React, { useEffect, useState } from 'react'

interface ErrorProps {
  message: string,
  home?: boolean,
  refresh?: boolean
  setError: React.Dispatch<React.SetStateAction<ErrorState>>
}

const handleClick = (setError: React.Dispatch<React.SetStateAction<ErrorState>>, home?: boolean, refresh?: boolean) => {
  setError(prev => ({ ...prev, showAlert: false }));
  if(home) {
    window.location.href = '/';
  } else if(refresh) {
    window.location.reload();
  }
}


export const ErrorAlert: React.FC<ErrorProps> = ({ message, home, refresh, setError }) => {

  // const [isOpen, setIsOpen] = useState(true);

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
            <AlertDialogCancel className="bg-[#272727] outline-none border border-[#272727]" onClick={() => handleClick(setError, home, refresh)}>
              { home ? "Go Home" : refresh ? "Refresh" : "Close" }
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}