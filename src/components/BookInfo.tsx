import { BookType } from "@/utils/booksApi";
import Image from "next/image";

type Props = {
  book: BookType;
};

export const BookInfo = (props: Props) => {
  const { book } = props;
  if (!book) {
    return null;
  }
  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.image} alt={book.title} width={300} />
    </div>
  );
};
