import styles from "src/styles/Header.module.css";

export const Header = (props) => {
  return (
    <div>
      <header className={styles.mainHeader}>{props.title}</header>
    </div>
  );
};
