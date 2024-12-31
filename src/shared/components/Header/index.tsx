import React, { FC, useState } from "react";
import { MenuOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import Logo from "@assets/images/logo-barashka.png";

import styles from "./styles.module.css";

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <button
          className={styles.catalogButton}
          onClick={() => console.log("Open Catalog")}
        >
          <AppstoreAddOutlined style={{ fontSize: "24px" }} />
        </button>
        <div className={styles.logoWrapper}>
          <Link to={"/"} className={styles.logoContainer}>
            <img src={Logo} alt="Project Logo" />
          </Link>
        </div>

        <div className={styles.burger} onClick={toggleMenu}>
          <MenuOutlined style={{ fontSize: "24px" }} />
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.menu}>
          <p>About</p>
          <p>Contact</p>
          <p>Support</p>
        </div>
      )}
    </header>
  );
};
