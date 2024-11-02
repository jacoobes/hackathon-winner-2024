import citiesData from './korea.json'

/**
 * Retrieves all cool spots in a given city.
 *
 * @param {string} cityName - The name of the city to search for.
 * @returns {Array} - An array of cool spots in the city, or an empty array if the city is not found.
 */
export function getCoolSpotsByCity(cityName) {
  const city = citiesData.find(city => city.city.toLowerCase() === cityName.toLowerCase());
  return city ? city.cool_spots : [];
}

// Example usage:
// console.log(getCoolSpotsByCity("Seoul"));

/**
 * Retrieves a specific cool spot by its name within a city.
 *
 * @param {string} cityName - The name of the city to search in.
 * @param {string} spotName - The name of the cool spot to retrieve.
 * @returns {Object|null} - The cool spot object if found, or null if not found or if the city is not found.
 */
export function getCoolSpotByName(cityName, spotName) {
  const city = citiesData.find(city => city.city.toLowerCase() === cityName.toLowerCase());
  if (city) {
    const coolSpot = city.cool_spots.find(spot => spot.name.toLowerCase() === spotName.toLowerCase());
    return coolSpot || null; // Return null if not found
  }
  return null; // City not found
}

// Example usage:
// console.log(getCoolSpotByName("Seoul", "Gyeongbokgung Palace"));

/**
 * Retrieves an array of image URLs for a specified cool spot in a given city.
 *
 * @param {string} cityName - The name of the city to search in.
 * @param {string} spotName - The name of the cool spot to retrieve images for.
 * @returns {Array} - An array of image URLs for the cool spot, or an empty array if not found.
 */
export function getImagesForCoolSpot(cityName, spotName) {
  const coolSpot = getCoolSpotByName(cityName, spotName);
  return coolSpot ? coolSpot.images : [];
}

// Example usage:
// console.log(getImagesForCoolSpot("Busan", "Haeundae Beach"));

/**
 * Retrieves all cities from the data.
 *
 * @returns {Array} - An array of city names.
 */
export function getAllCities() {
  return citiesData.map(city => city.city);
}
// Example usage:
// console.log(getAllCities());

