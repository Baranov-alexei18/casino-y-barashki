import { Fragment, useState } from "react";

import styles from "./styles.module.css";
import viteLogo from "../assets/vite.svg";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles.readTheDocs}>
        Click on the Vite and React logos to learn more
      </p>
    </Fragment>
  );
};

export default App;
