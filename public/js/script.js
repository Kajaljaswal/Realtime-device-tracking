// check if browser support geolocation

// initilize socket .io
const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            // Settings
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

const markers = {}; // Change to markers to hold multiple users

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16); // Set map view to the latest position
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update position of existing marker
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker from the map
        delete markers[id]; // Delete marker from the markers object
    }
});
