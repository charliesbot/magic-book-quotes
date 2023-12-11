"use client";

import styles from "./page.module.css";
import { BookFinder } from "@/components/BookFinder/BookFinder";
import { useCallback, useState } from "react";
import { BookType, getBooks } from "@/utils/booksApi";
import { FancyQuote } from "@/components/FancyQuote";
import { QuoteInput } from "@/components/QuoteInput/QuoteInput";
import { Signature } from "@/components/Signature/Signature";

const debounce = (func: Function, delay: number) => {
  let debounceTimer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

export default function Home() {
  const [book, setBook] = useState<BookType>();
  const [quote, setQuote] = useState<string>("");
  const [collection, setCollection] = useState<BookType[]>([]);
  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string) => {
      if (!inputValue) {
        return;
      }
      getBooks(inputValue).then((books) => {
        setCollection(books);
      });
    }, 500),
    []
  );

  return (
    <main className={styles.main}>
      <Signature />
      <div className={styles.section}>
        <QuoteInput
          quote={quote}
          onSetQuote={(value: string) => setQuote(value)}
        />
        <div className={styles.buttonSection}>
          <BookFinder
            loadOptions={loadOptionsDebounced}
            onSelectBook={setBook}
            collection={collection}
          />
          <button className={styles.buttonGenerator}>Generate</button>
        </div>
      </div>
      <FancyQuote book={book} quote={quote} />
    </main>
  );
}
