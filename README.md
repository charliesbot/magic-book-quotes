# Magic Book Quotes

Magic Book Quotes is a web app made using NextJS.

It facilitates the creation of images from book quotes by leveraging the [Google Books API](https://developers.google.com/books)

## Run the project

```
npm run dev
```

Then, open your browser and navigate to http://localhost:3000 to start creating magical quotes!

## How It Works

The application utilizes the Google Books API to fetch essential data, including the book's title, author, and cover image.
This data is then transmitted to the server side.
Here, a canvas is generated and converted into an image, which is subsequently sent back to the client for display.
