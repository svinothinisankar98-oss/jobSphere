import { useEffect, useState } from "react";
import { Grid, Paper, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTheme } from "@mui/material/styles";
import { locationService } from "../../service/locationService";
import MyButton from "../../Components/newui/MyButton";
import CommonDropdown from "../../Components/ui/CommonDropdown";
import CommonTextField from "../../Components/ui/CommonTextField";

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

const SearchSection = ({
  search,
  setSearch,
  selected,
  setSelected,
  onSearch,
}: Props) => {
  const [locations, setLocations] = useState<Option[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search Input */}

        <Grid size={{ xs: 12, md: 5 }}>
          <CommonTextField
            name="search"
            value={search}
            placeholder="Job title, keywords, or company"
            startIcon={<SearchIcon />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        {/* Location Dropdown */}

        <Grid size={{ xs: 12, md: 4 }}>
          <CommonDropdown
            name="location"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            options={locations}
            placeholder="Select Location"
            startIcon={<LocationOnIcon />}
          />
        </Grid>

        {/* Button */}

        <Grid size={{ xs: 12, md: 3 }}>
          <MyButton
            fullWidth
            size="medium"
            variant="contained"
            onClick={onSearch}
            label="Find Jobs"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchSection;
