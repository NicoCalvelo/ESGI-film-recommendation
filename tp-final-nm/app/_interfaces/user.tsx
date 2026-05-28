export interface User {
  id: string;
  name: string;
  email: string;
  likes: {
    genres: string[];
    actors: string[];
    directors: string[];
    books: string[];
    films: string[];
    series: string[];
    anime: string[];
  };
  dislikes: {
    genres: string[];
    actors: string[];
    directors: string[];
    books: string[];
    films: string[];
    series: string[];
    anime: string[];
  };
}
