This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# Liste des routes :

/api/gutendex/getList?page=1

```json
{
  "count": 78580,
  "next": "https://gutendex.com/books/?page=2",
  "previous": null,
  "results": [ {book x32} ]
}
```

Book : 

```json
{
  "id": <number of Project Gutenberg ID>,
  "title": <string>,
  "authors": <array of Persons>,
  "summaries": <array of strings>,
  "editors": <array of Persons>,
  "translators": <array of Persons>,
  "subjects": <array of strings>,
  "bookshelves": <array of strings>,
  "languages": <array of strings>,
  "copyright": <boolean or null>,
  "media_type": <string>,
  "formats": <Format>,
  "download_count": <number>
}
```

/api/studioghibli/getList

Retourne tout les films du studio Ghbili

/api/jikan/getList

Retourne les 25 animes les plus connus

/api/jikan/getList?query=<string>&page=<number>

Retourne une liste d'anime en fonction de la recherche