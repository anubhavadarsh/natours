/* eslint-disable */
const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW51YmhhdmFkYXJzaCIsImEiOiJjbDEwaDI3YzcwMWU2M2lwYzNrbGF6ZXl4In0.hoF6kGkW7L2JGIkPxQNniw';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/anubhavadarsh/cl10l358n00df14oe6ge8f9z9', // style URL
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add POPUP
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 150,
      right: 100,
    },
  });
};

document.addEventListener('DOMContentLoaded', function () {
  const mapBox = document.getElementById('map');

  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }
});
