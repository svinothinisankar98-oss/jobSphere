import Grid from "@mui/material/Grid";
import MyTextField from "../../../Components/newui/MyTextField";
import MyDropDown from "../../../Components/newui/MyDropDown";
import MyYearPicker from "../../../Components/newui/MyDatePicker";
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from "../../../constants/DropDownOptions";

// const INDUSTRY_OPTIONS = [
//   { id: 1, item: "IT" },
//   { id: 2, item: "Finance" },
//   { id: 3, item: "Healthcare" },
//   { id: 4, item: "Education" },
// ];

// const COMPANY_SIZE_OPTIONS = [
//   { id: 1, item: "1–10" },
//   { id: 2, item: "11–50" },
//   { id: 3, item: "51–200" },
//   { id: 4, item: "200+" },
// ];

function CompanyDetails() {
  return (
    <Grid container spacing={2}>
      {/* Row 1 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="companyName" label="Company Name" required />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="email" label="Company Email" required />
      </Grid>

      {/* Row 2 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="phone" label="Company Phone" required />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="website" label="Company Website" required />
      </Grid>

      {/* Row 3 */}
      <Grid size={{ xs: 12, md: 6 }}>
        {/* <MyTextField name="foundedYear" label="Founded Year" /> */}
        <MyYearPicker name="foundedYear" label="Founded Year" pickerType="year" />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="gstNumber" label="GST Number" />
      </Grid>

      {/* Row 4 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropDown
          name="industry"
          label="Industry"
          required
          options={INDUSTRY_OPTIONS}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MyDropDown
          name="companySize"
          label="Company Size"
          required
          options={COMPANY_SIZE_OPTIONS}
        />
      </Grid>
    </Grid>
  );
}

export default CompanyDetails;
