import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import BusinessIcon from "@mui/icons-material/Business";
import DownloadIcon from "@mui/icons-material/Download";

import MyTable from "../../Components/newui/MyTable";
import type { CompanyInformationType } from "../../types/companyInformation";

import { previewToPdf } from "../../utils/previewToPdf";

//Date Generator//

const getGeneratedDateTime = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())}`;
};

export default function PreviewCompanyInfoList({
  row,
}: {
  row: CompanyInformationType;
}) {
  const handleDownloadPdf = async () => {
    await previewToPdf("company-preview", {
      fileName: row.companyName,
      orientation: "p",
      scale: 2,
      showPageNumber: true,
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 1, sm: 2 } }}>
      {/* download Icon */}
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <IconButton color="secondary" size="medium" onClick={handleDownloadPdf}>
          <DownloadIcon />
        </IconButton>
      </Box>

      <Box id="company-preview">
        {/*  Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography fontSize={18} fontWeight={600}>
                Company Profile Report
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                {row.companyName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} textAlign="right">
              <Typography fontSize={12} color="text.secondary">
                Generated on
              </Typography>
              <Typography fontSize={13} fontWeight={500}>
                {getGeneratedDateTime()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Company Info */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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

        {/* Company Contacts */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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

        {/* Branches */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
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
                sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={5}
                  mb={2}
                  justifyContent="space-between"
                >
                  <Typography>
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
                    <b>Branch Email:</b> {b.branchEmail}
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
                    {
                      id: "designation",
                      label: "Designation",
                      align: "center",
                    },
                  ]}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Footer*/}
      <Box
        sx={{
          mt: 5,
          pt: 2,
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "text.secondary",
          fontSize: 11,
        }}
      >
        Confidential Company Document • Generated by JobSphere
      </Box>
    </Box>
  );
}
