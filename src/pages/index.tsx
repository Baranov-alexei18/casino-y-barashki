import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { Header } from "@shared/components/Header";
import { APP_ROUTES } from "@app/routes";
import { useStoreMoneyAccount } from "@app/store/useStoreMoneyAccount";

export const App = () => {
  const { setMoney } = useStoreMoneyAccount((state) => state);

  useEffect(() => {
    if (!localStorage.getItem("balance")) {
      setMoney(10000);
      localStorage.setItem("balance", "10000");
    } else {
      const deposit = Number(localStorage.getItem("balance"));
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
