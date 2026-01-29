import { Box, Paper, Typography, Grid, Stack, Divider } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";

import MyTable from "../../Components/newui/MyTable";
import type { CompanyInformationType } from "../../types/companyInformation";
import { alignItems, justifyContent } from "@mui/system";
import BusinessIcon from "@mui/icons-material/Business";

export default function PreviewCompanyInfoList({
  row,
}: {
  row: CompanyInformationType;
}) {
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 1, sm: 2 },
      }}
    >
      {/* ================= COMPANY INFO ================= */}

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        {/* <Typography variant="h6" fontWeight={600} mb={2} textAlign={"center"}>
          Company Information
        </Typography> */}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight={600}>Company Name</Typography>
            <Typography fontWeight={500}>{row.companyName}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight={600}>Company Email</Typography>
            <Typography fontWeight={500}>{row.companyEmail}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= COMPANY CONTACTS ================= */}

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <ContactsIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Company Contacts
          </Typography>
        </Stack>

        <MyTable
          rows={row.contact}
          tableSize="small"
          disablePagination
          columns={[
            { id: "name", label: "Name", align: "left" },
            { id: "phone", label: "Phone", align: "center" },
            { id: "email", label: "Email", align: "left" },
          ]}
        />
      </Paper>

      {/* ================= BRANCHES ================= */}

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={3}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Branches & Contacts
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {row.branches.map((b, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                p: 2,
              }}
            >
              {/* Branch Header */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={5}
                mb={2}
                justifyContent={"space-between"}
              >
                <Typography >
                  <Box
                    component="span"
                    sx={{
                      bgcolor: "primary.main",
                      color: "#fff",
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      mr: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    Branch {index + 1}
                  </Box>
                  {b.branchName}
                </Typography>

                <Typography>
                  <b> Branch Email:</b> {b.branchEmail}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <MyTable
                rows={b.branchContact.map((d: any) => ({
                  name: d?.name || "-",
                  phone: d?.phone || "-",
                  email: d?.email || "-",
                  designation: d?.designation || "-",
                }))}
                disablePagination
                tableSize="small"
                columns={[
                  { id: "name", label: "Name", align: "left" },
                  { id: "phone", label: "Phone", align: "center" },
                  { id: "email", label: "Email", align: "left" },
                  { id: "designation", label: "Designation", align: "center" },
                ]}
              />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
