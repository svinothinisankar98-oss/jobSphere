import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type MyAccordionProps = {
  title: React.ReactNode;
  expanded: boolean;                 //parent control open and close//
  onChange: (expanded: boolean) => void;
  children: React.ReactNode;         //Content inside accordion (forms, tables//

  count?: number;

  
  summaryRight?: React.ReactNode;   // actions, badges, buttons
  disabled?: boolean;               //disable accordian when needed
   titleColor?: string;             //heading color//

}

export default function MyAccordion({
  title,
  expanded,
  onChange,
  children,
  count,
  summaryRight,
  disabled = false,
  titleColor
}: MyAccordionProps) {
  return (
    <Accordion
      expanded={expanded}
      disabled={disabled}
      onChange={(_, isExpanded) => onChange(isExpanded)}
      sx={{
        mb: 2,
        borderRadius: 2,
        width: "100%",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={700}   color={titleColor }>{title}</Typography>

            {count !== undefined && (
             <Box
                    px={1.5}
                    py={0.5}
                    borderRadius="50%"
                    bgcolor="#626262"
                    color="white"
                    fontSize="13px"
                    // minWidth="24px"
                    textAlign="center"
                  >
                    {count}
                  </Box>
            )}
          </Box>

          {/* optional right side content */}
          {summaryRight}
        </Box>
      </AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
