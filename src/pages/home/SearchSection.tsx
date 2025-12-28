import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CommonDropdown from "../../Components/ui/CommonDropdown";
import { locationService } from "../../service/locationService";
import "./SearchSection.css";

/* ================= TYPES ================= */

type Option = {
  id: number;
  item: string;
};

type Props = {
  search: string;
  setSearch: (value: string) => void;
  selected: string;
  setSelected: (value: string) => void;
  onSearch: () => void;
};

/* ================= COMPONENT ================= */

const SearchSection = ({
  search,
  setSearch,
  selected,
  setSelected,
  onSearch,
}: Props) => {
  const [locations, setLocations] = useState<Option[]>([]);

  /* ================= FETCH LOCATIONS ================= */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="search-wrapper">
      <div className="search-box">
        {/* SEARCH INPUT */}
        <div className="field-box">
          <SearchIcon className="icon" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LOCATION DROPDOWN */}
        <div className="field-box location">
          <LocationOnIcon className="icon" />
          <div className="dropdown-fix">
            <CommonDropdown
              name="location"
              value={selected}
              options={locations}
              placeholder="Select Location"
              onChange={(e) => setSelected(e.target.value)}
            />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button className="find-btn" onClick={onSearch}>
          Find Jobs
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
