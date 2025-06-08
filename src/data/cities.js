export const albanianCities = [
    "Tirana",
    "Durrës",
    "Vlorë",
    "Elbasan",
    "Shkodër",
    "Fier",
    "Korçë",
    "Berat",
    "Lushnjë",
    "Kavajë",
    "Pogradec",
    "Laç",
    "Gjirokastër",
    "Patos",
    "Krujë",
    "Kuçovë",
    "Kukës",
    "Lezhë",
    "Peshkopi",
    "Sarandë"
].sort();

// Group cities by first letter for better UI organization if needed
export const citiesByLetter = albanianCities.reduce((acc, city) => {
    const firstLetter = city[0].toUpperCase();
    if (!acc[firstLetter]) {
        acc[firstLetter] = [];
    }
    acc[firstLetter].push(city);
    return acc;
}, {}); 