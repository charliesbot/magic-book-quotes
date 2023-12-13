import { BookType } from "./booksApi";

export function getDebugBook(): BookType | null {
  const params = new URLSearchParams(window.location.search);
  const book = params.get("book");
  if (book == "guidebook") {
    return {
      authors: "Gergely Orosz",
      title: "The Software Engineer's Guidebook",
      image:
        "https://m.media-amazon.com/images/I/51omP75v+AL._AC_UF1000,1000_QL80_.jpg",
    };
  }
  return null;
}
