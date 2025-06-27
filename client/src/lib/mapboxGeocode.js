import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
});

export const getCoordinatesFromQuery = async (query) => {
    if (!query || query.trim().length < 3) return null;

    try {
        const response = await geocodingClient.forwardGeocode({
            query,
            limit: 1,
        }).send();

        const match = response.body.features[0];
        if (match) {
            const [longitude, latitude] = match.center;
            return { latitude, longitude };
        }
        return null;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
};
