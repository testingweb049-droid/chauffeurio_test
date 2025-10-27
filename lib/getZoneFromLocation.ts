// utils/getZoneFromLocation.ts
export async function getZoneFromLocation(address: string): Promise<string | null> {
  try {
    const res = await fetch(`https://chauffeurio.com/api/taxigate/price-with-zone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: address }),
    });

    if (!res.ok) {
      console.error('Zone API error:', res.statusText);
      return null;
    }

    const data = await res.json();
    
    // Assuming the response looks like: { zone: "noord_holland" }
    return data.zone || null;
  } catch (error) {
    console.error('Error fetching zone from backend:', error);
    return null;
  }
}
