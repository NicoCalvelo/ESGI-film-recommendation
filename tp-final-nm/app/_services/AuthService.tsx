import { User } from "@/app/_interfaces/user";

const USERS_KEY = "app_users";
const CURRENT_USER_KEY = "app_current_user";

interface StoredUser extends User {
  password: string;
  salt: string;
}

function getUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function login(email: string, password: string): User | string {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return "Identifiants incorrects.";
  }

  const piment = process.env.NEXT_PUBLIC_PASSWORD_PIMENT;
  const saltedPassword = btoa(password + user.salt);
  const expectedPassword = btoa(saltedPassword + piment);

  if (user.password !== expectedPassword) {
    return "Identifiants incorrects.";
  }

  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export function signUp(name: string, email: string, saltedPassword: string, salt: string): User | string {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return "Un compte avec cet email existe déjà.";
  }

  const piment = process.env.NEXT_PUBLIC_PASSWORD_PIMENT;
  const password = btoa(saltedPassword + piment);

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    salt,
    likes: {
      genres: [],
      actors: [],
      directors: [],
      books: [],
      films: [],
      series: [],
      anime: [],
    },
    dislikes: {
      genres: [],
      actors: [],
      directors: [],
      books: [],
      films: [],
      series: [],
      anime: [],
    },
  };

  saveUsers([...users, newUser]);

  const { password: _, ...user } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
