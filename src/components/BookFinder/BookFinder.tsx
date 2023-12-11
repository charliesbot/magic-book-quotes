import { BookType } from "@/utils/booksApi";
import { useState } from "react";
import styles from "./BookFinder.module.css";

interface BookFinderType {
  loadOptions: Function;
  onSelectBook: any;
  collection: BookType[];
}

export const BookFinder = ({
  loadOptions,
  onSelectBook,
  collection,
}: BookFinderType) => {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const handleChange = (event) => {
    setInput(event.target.value);
    loadOptions(event.target.value);
  };
  return (
    <div className={styles.container}>
      <input
        onFocus={() => {
          setShowOptions(true);
        }}
        type="text"
        className={styles.input}
        value={input}
        onChange={handleChange}
      />
      {showOptions ? (
        <ul className={styles.options}>
          {collection.map((book, index) => (
            <li
              key={index}
              onClick={() => {
                setShowOptions(false);
                setInput(book.title);
                onSelectBook(book);
              }}
            >
              {book.title}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
