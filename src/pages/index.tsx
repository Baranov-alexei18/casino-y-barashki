import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { Header } from "@shared/components/Header";
import { APP_ROUTES } from "@app/routes";
import { useStoreMoneyAccount } from "@app/store/useStoreMoneyAccount";

export const App = () => {
  const { setMoney } = useStoreMoneyAccount((state) => state);

  useEffect(() => {
    if (!localStorage.getItem("coins")) {
      setMoney(10000);
      localStorage.setItem("coins", "10000");
    } else {
      const deposit = Number(localStorage.getItem("coins"));
      setMoney(deposit);
    }
  }, [setMoney]);

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
