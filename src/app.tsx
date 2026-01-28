import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router';
import { Button } from "./components/ui/button"


const router = createHashRouter([
  {
    path: "/",
    element: <div className="text-3xl"><Button>Click me</Button></div>,
  },
]);

const root = createRoot(document.body);
root.render(<RouterProvider router={router} />);