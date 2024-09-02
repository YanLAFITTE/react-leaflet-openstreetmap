import { useState } from "react";
import MapComponent from "./MapComponent";

const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([51.505, -0.09]); // Default position: London

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {

    setSelectedPosition([suggestion.lat, suggestion.lon]);
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative", height: "400px" }}>
      <div
        style={{
          position: "",
          top: "10px",
          left: "10px",
         width:"100vw"
        }}
      >
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          placeholder='Search for an address...'
          style={{ padding: "10px", width: "300px" }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
           
              padding: "0",
              margin: "5px 0",
              listStyle: "none",
              width: "300px",
              maxHeight: "150px",
              overflowY: "scroll",
            }}
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ padding: "10px", cursor: "pointer" }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <MapComponent position={selectedPosition} markerLabel={query} />
    </div>
  );
};

export default AddressSearch;
