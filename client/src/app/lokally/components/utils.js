
export function getUserLocation(){
    return new Promise((resolve, reject) => {
        if(navigator.geoLocation){
            navigator.geoLocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lng: longitude });
                },
                error => {
                    console.error("Error getting location:", error);
                    reject(error);
                }
            );
        } else {
            console.error("GeoLocation is not supported by this browser.");
            reject(new Error("GeoLocation not supported"));
        }
    })
}