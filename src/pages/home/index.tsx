import { Card } from "antd";
import { Link } from "react-router-dom";

import PreviewAnimals from "@assets/images/games/fortune-animals/preview_for_fortune-animals.jpg";

import styles from "./styles.module.css";

export const HomePage = () => {
  return (
    <div className={styles.wrapper}>
      <Card
        className={styles.gameWrapper}
        headStyle={{ color: "white", fontSize: "32px" }}
        title="Игры"
      >
        <Card.Grid className={styles.gameCard} hoverable={false}>
          <Link to={"/fortune-animals"} className={styles.imageWrapper}>
            <img src={PreviewAnimals} alt="Веселые зверушки" />
            <div className={styles.gameTitle}>Веселые зверушки</div>
          </Link>
        </Card.Grid>
      </Card>
    </div>
  );
};
