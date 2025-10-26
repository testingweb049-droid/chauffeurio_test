// components/utils/calculateDistance.ts
export const calculateDistance = async (
    origin: string,
    destination: string
  ): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const endpoint = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
      const response = await fetch(endpoint);
      const data = await response.json();
  
      if (data.rows[0].elements[0].status === "OK") {
        return data.rows[0].elements[0].distance.text; // Returns the distance in readable format (e.g., "15 km")
      }
  
      return null;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return null;
    }
  };
  