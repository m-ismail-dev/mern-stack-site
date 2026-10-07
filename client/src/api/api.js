const BASE_URL = "http://localhost:3000/api";

export async function register(firstName, lastName, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  const user = response.json();

  return user;
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const user = response.json();

  return user;
}

export async function getMe() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const user = response.json();

  return user;
}
