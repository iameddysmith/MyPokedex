import { checkResponse } from "./auth";

export const fetchAllPokemon = () => {
  return fetch("http://localhost:3001/api/pokemon")
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to fetch Pokémon data:", error);
      return [];
    });
};

export const fetchPokemonDetails = (pokemonId) => {
  return fetch(`http://localhost:3001/api/pokemon/${pokemonId}`)
    .then(checkResponse)
    .catch((error) => {
      console.error(
        `Failed to fetch Pokémon details for ID ${pokemonId}:`,
        error
      );
      throw error;
    });
};

export const fetchPokemonTypes = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    if (!response.ok) {
      throw new Error("Failed to fetch types");
    }
    const data = await response.json();
    const allTypes = data.results;
    const filteredTypes = [];

    for (const type of allTypes) {
      const typeResponse = await fetch(type.url);
      if (!typeResponse.ok) {
        throw new Error(`Failed to fetch data for type: ${type.name}`);
      }
      const typeData = await typeResponse.json();
      if (typeData.pokemon.length > 0) {
        filteredTypes.push(
          type.name.charAt(0).toUpperCase() + type.name.slice(1)
        );
      }
    }

    return filteredTypes.sort();
  } catch (error) {
    console.error("Failed to fetch types", error);
    throw error;
  }
};
