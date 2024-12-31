import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "@shared/components/Header";
import { APP_ROUTES } from "@app/routes";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {APP_ROUTES.map(({ path, component, id }) => (
          <Route key={id} path={path} element={component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
