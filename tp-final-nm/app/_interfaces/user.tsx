export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    genres: string[];
    actors: string[];
    directors: string[];
    books: string[];
    films: string[];
    series: string[];
    anime: string[];
  };
}
