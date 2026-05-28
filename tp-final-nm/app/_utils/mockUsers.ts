import { User } from "@/app/_interfaces/user";

const MOCK_USERS: User[] = [
  {
    id: "mock_1",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    likes: {
      genres: ["Action", "Adventure", "Sci-Fi"],
      actors: ["Tom Cruise", "Keanu Reeves"],
      directors: ["Christopher Nolan", "Quentin Tarantino"],
      books: ["Science Fiction", "Mystery"],
      films: ["Fast & Furious", "Mission Impossible"],
      series: ["Breaking Bad", "The Witcher"],
      anime: ["Attack on Titan", "Demon Slayer", "One Piece"],
    },
    dislikes: {
      genres: ["Horror", "Romance"],
      actors: [],
      directors: [],
      books: ["Poetry"],
      films: [],
      series: [],
      anime: ["Slice of Life"],
    },
  },
  {
    id: "mock_2",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    likes: {
      genres: ["Horror", "Thriller", "Psychological"],
      actors: ["Tilda Swinton", "Benedict Cumberbatch"],
      directors: ["David Fincher", "Denis Villeneuve"],
      books: ["Horror", "Mystery", "Dark Fantasy"],
      films: ["Hereditary", "The Ring"],
      series: ["Stranger Things", "Dark"],
      anime: ["Psychological", "Mystery"],
    },
    dislikes: {
      genres: ["Comedy", "Children's"],
      actors: ["Will Smith"],
      directors: [],
      books: ["Romance"],
      films: [],
      series: [],
      anime: ["Slice of Life", "Comedy"],
    },
  },
  {
    id: "mock_3",
    name: "Lucas Rodriguez",
    email: "lucas.rodriguez@example.com",
    likes: {
      genres: ["Comedy", "Romance", "Drama"],
      actors: ["Ryan Gosling", "Emma Stone"],
      directors: ["Greta Gerwig", "Taika Waititi"],
      books: ["Contemporary", "Humor"],
      films: ["La La Land", "Crazy Stupid Love"],
      series: ["Schitt's Creek", "Ted Lasso"],
      anime: ["Romance", "Comedy", "Slice of Life"],
    },
    dislikes: {
      genres: ["Horror", "War", "Gore"],
      actors: [],
      directors: [],
      books: ["Horror", "Dark"],
      films: [],
      series: [],
      anime: ["Graphic Violence"],
    },
  },
  {
    id: "mock_4",
    name: "Sophia Müller",
    email: "sophia.muller@example.com",
    likes: {
      genres: ["Documentary", "Biography", "Educational"],
      actors: ["David Attenborough"],
      directors: ["Werner Herzog", "Ken Burns"],
      books: ["Non-Fiction", "Science", "History", "Philosophy"],
      films: ["March of the Penguins", "13th"],
      series: ["Planet Earth", "Cosmos"],
      anime: [],
    },
    dislikes: {
      genres: ["Action", "Superhero"],
      actors: [],
      directors: [],
      books: ["Fantasy", "Romance"],
      films: [],
      series: [],
      anime: ["Most Anime"],
    },
  },
  {
    id: "mock_5",
    name: "James Park",
    email: "james.park@example.com",
    likes: {
      genres: ["Sci-Fi", "Fantasy", "Adventure"],
      actors: ["Leonardo DiCaprio", "Oscar Isaac"],
      directors: ["Denis Villeneuve", "Hayao Miyazaki"],
      books: ["Science Fiction", "Fantasy", "Manga"],
      films: ["Dune", "Inception", "Interstellar"],
      series: ["The Expanse", "Westworld"],
      anime: ["Cowboy Bebop", "Neon Genesis Evangelion", "Death Note", "Studio Ghibli"],
    },
    dislikes: {
      genres: ["Reality TV", "Sport"],
      actors: [],
      directors: [],
      books: [],
      films: [],
      series: [],
      anime: ["Excessive Fan Service"],
    },
  },
];

/**
 * Get all mock users
 */
export function getMockUsers(): User[] {
  return MOCK_USERS;
}

/**
 * Get a specific mock user by ID
 */
export function getMockUserById(userId: string): User | undefined {
  return MOCK_USERS.find((user) => user.id === userId);
}

/**
 * Search mock users by name or email (excludes current user)
 */
export function searchMockUsers(query: string, excludeUserId?: string): User[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_USERS.filter((user) => {
    // Exclude current user if specified
    if (excludeUserId && user.id === excludeUserId) {
      return false;
    }

    // Search by name or email
    return (
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Get mock users by preference similarity (for recommendations)
 */
export function getMockUsersByGenreSimilarity(
  genres: string[],
  excludeUserId?: string,
  limit: number = 5
): User[] {
  if (genres.length === 0) {
    return MOCK_USERS.filter((user) => user.id !== excludeUserId).slice(0, limit);
  }

  const scoredUsers = MOCK_USERS.map((user) => {
    if (excludeUserId && user.id === excludeUserId) {
      return { user, score: -1 };
    }

    const matches = genres.filter((g) => user.likes.genres.includes(g));
    return { user, score: matches.length };
  });

  return scoredUsers
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.user);
}
