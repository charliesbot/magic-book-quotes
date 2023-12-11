import styles from "./QuoteInput.module.css";

type Props = {
  quote: string;
  onSetQuote: (quote: string) => void;
};

export const QuoteInput = (props: Props) => {
  return (
    <textarea
      className={styles.textarea}
      value={props.quote}
      onInput={(e) => {
        props.onSetQuote(e.target.value);
      }}
    />
  );
};
