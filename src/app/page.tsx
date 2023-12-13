"use client";

import styles from "./page.module.css";
import { BookFinder } from "@/components/BookFinder/BookFinder";
import { useCallback, useEffect, useState } from "react";
import { BookType, createBookQuote, getBooks } from "@/utils/booksApi";
import { QuoteInput } from "@/components/QuoteInput/QuoteInput";
import { Signature } from "@/components/Signature/Signature";
import { getDebugBook } from "@/utils/powerModes";

const debounce = (func: Function, delay: number) => {
  let debounceTimer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

export default function Home() {
  const [book, setBook] = useState<BookType | null>(null);
  const [quote, setQuote] = useState<string>("");
  const [image, setImage] = useState<string>();
  const [collection, setCollection] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const debugBook = getDebugBook();
    setBook(debugBook);
  }, []);

  const onCreateImage = async () => {
    setIsLoading(true);
    const tempImageBlob = await createBookQuote(quote, book!);
    const imageURL = URL.createObjectURL(tempImageBlob);
    setIsLoading(false);
    setImageBlob(tempImageBlob);
    setImage(imageURL);
  };

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

  async function copyBlobToClipboard() {
    if (!imageBlob) {
      return;
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [imageBlob.type]: imageBlob,
        }),
      ]);
      console.log("Blob copied to clipboard");
    } catch (error) {
      console.error("Failed to copy blob:", error);
    }
  }

  async function shareImage() {
    if (!imageBlob) {
      return;
    }
    const file = new File([imageBlob], "magic_quote.jpg", {
      type: imageBlob.type,
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
        });
        console.log("Image shared successfully");
      } catch (error) {
        console.error("Error sharing the image:", error);
      }
    } else {
      console.error("Web Share API is not supported in this browser.");
    }
  }

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
          <button
            onClick={() => {
              debugger;
              if (isLoading || book == undefined || !quote) {
                return;
              }
              onCreateImage();
            }}
            className={styles.buttonGenerator}
          >
            {isLoading ? <div className={styles.spinner} /> : "Generate"}
          </button>
        </div>
        <img className={styles.imageQuote} src={image} alt={quote} />
        {imageBlob ? (
          <div className={styles.quoteActions}>
            <button
              className={styles.actionButton}
              onClick={copyBlobToClipboard}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
              </svg>
            </button>
            {navigator.canShare !== undefined ? (
              <button className={styles.actionButton} onClick={shareImage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
                </svg>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
