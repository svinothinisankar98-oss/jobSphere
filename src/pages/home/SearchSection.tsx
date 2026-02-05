import { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";


// import { locationService } from "../../service/locationService";
import MyButton from "../../Components/newui/MyButton";
import CommonDropdown from "../../Components/ui/CommonDropdown";
import CommonTextField from "../../Components/ui/CommonTextField";
import JobFilters from "../joblist/JobFilters";
import { getAllLocations } from "../../hooks/useLocationService";
import ErrorFallback from "../../ErrorFallback";

import { useLocation } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

import { handleError } from "../../utils/handleError";


type Option = {
  id: number;
  item: string;
};

//Props//

type Props = {
  search: string;
  setSearch: (value: string) => void;
  selected: string;
  setSelected: (value: string) => void;
  onSearch: () => void;

  jobType: string[];
  setJobType: (v: string[]) => void;
  experience: string[];
  setExperience: (v: string[]) => void;
  salary: string[];
  setSalary: (v: string[]) => void;
};

export default function SearchSection({
  search,
  setSearch,
  selected,
  setSelected,
  onSearch,
  jobType,
  setJobType,
  experience,
  setExperience,
  salary,
  setSalary,
}: Props) {

  const location = useLocation();

  //location state//

  const [locations, setLocations] = useState<Option[]>([]);

//Stores API error if fetch fails//

  const [locationError, setLocationError] = useState<any>();

  const { showBoundary } = useErrorBoundary();

  //fetch locations in api//

 useEffect(() => {
  const fetchLocations = async () => {
    try {
      const data = await getAllLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      handleError(err, {
         showBoundary,
        setLocalError: setLocationError,
      });
    }
  };

  fetchLocations();
}, []);
  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 2, maxWidth: 1000, mx: "auto" }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <CommonTextField
            name="search"
            value={search}
            placeholder="Job title, keywords, or company"
            startIcon={<SearchIcon />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CommonDropdown
            name="location"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            options={locations}
            placeholder="Select Location"
            startIcon={<LocationOnIcon />}
          />
          

          {locationError && (                       //Error handling in UI//
            <ErrorFallback
              error={locationError}
              resetErrorBoundary={() => setLocationError(null)}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <MyButton
            fullWidth
            variant="contained"
            onClick={onSearch}
            label="Find Jobs"
          />
        </Grid>
      </Grid>
      {location.pathname.startsWith("/jobs") && (
        <Box mt={2} marginRight={10}>
          <JobFilters
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salary={salary}
            setSalary={setSalary}
          />
        </Box>
      )}
    </Paper>
  );
}
