import { checkResponse } from "./auth";

export const fetchPokemonWithCache = (type, searchTerm, page) => {
  const cacheKey = `${type}-${searchTerm}-${page}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    return Promise.resolve(JSON.parse(cachedData));
  }

  return fetch(
    `http://localhost:3001/api/pokemon?type=${type}&search=${searchTerm}&page=${page}`
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
      return data;
    })
    .catch((error) => {
      console.error("Failed to fetch Pokémon data:", error);
      return null;
    });
};

export const fetchUserCollection = (token) => {
  return fetch("http://localhost:3001/api/pokemon-collection", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error fetching user collection:", error);
      throw error;
    });
};

export const addPokemonToCollection = (token, pokemonData) => {
  return fetch("http://localhost:3001/api/pokemon-collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pokemonData),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error adding Pokémon to collection:", error);
      throw error;
    });
};

export const removePokemonFromCollection = (token, pokemonId) => {
  return fetch(`http://localhost:3001/api/pokemon-collection/${pokemonId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Error removing Pokémon from collection:", error);
      throw error;
    });
};
