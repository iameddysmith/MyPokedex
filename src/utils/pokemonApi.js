export const fetchPokemonData = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/pokemon");
    if (!response.ok) throw new Error("Failed to fetch Pokémon data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
