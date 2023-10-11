import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import CreateLeague from './scenes/leagues/Create.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/leagues',
    element: <div>Leagues</div>,
  },
  {
    path: '/leagues/create',
    element: <CreateLeague />,
  },
  {
    path: '/leagues/:id',
    element: <div>League</div>,

  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
