export interface BookType {
  authors: string;
  title: string;
  image: string;
}

function replaceImageZoom(url?: string) {
  if (!url) {
    return "";
  }
  let urlObj = new URL(url);
  let params = urlObj.searchParams;
  params.set("zoom", "4");
  return urlObj.origin + urlObj.pathname + "?" + params.toString();
}

export const getBooks = async (query: string) => {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.append("q", query);
  url.searchParams.append("orderBy", "relevance");
  const result = await fetch(url, { method: "GET" });
  const json = await result.json();
  const books: BookType[] = json.items
    .map(({ volumeInfo }) => volumeInfo)
    .map((info) => {
      const images = info.imageLinks;
      const image = images?.thumbnail ?? images?.smallThumbnail;
      console.log(info);
      return {
        authors: info.authors?.join(", "),
        title: info.title,
        image: replaceImageZoom(image),
      };
    });

  return books;
};
