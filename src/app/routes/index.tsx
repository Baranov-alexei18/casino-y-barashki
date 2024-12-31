import { FortuneAnimalsPage } from "@pages/fortune-animals";
import { HomePage } from "@pages/home";

export const APP_ROUTES = [
  {
    id: 1,
    path: "/",
    component: <HomePage />,
  },
  {
    id: 2,
    path: "/fortune-animals",
    component: <FortuneAnimalsPage />,
  },
];
