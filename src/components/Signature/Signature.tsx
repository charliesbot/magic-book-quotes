import styles from "./Signature.module.css";

export const Signature = () => {
  return (
    <div className={styles.signature}>
      Built with ❤️ by{" "}
      <a href="https://twitter.com/charliesbot">@charliesbot</a>
    </div>
  );
};
