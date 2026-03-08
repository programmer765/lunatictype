import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import AuthPage from './Pages/AuthPage'
import ErrorPage from './Pages/ErrorPage'
import RoomLandingPage from './Pages/Room/RoomLandingPage'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/trpc'
import RandomLandingPage from './Pages/Random/RandomLandingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/v1/auth',
    element: <AuthPage />,
  },
  {
    path: '/play/online/room',
    element: <RoomLandingPage />
  },
  {
    path: '/play/online/random',
    element: <RandomLandingPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
