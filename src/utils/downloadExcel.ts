import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

//types//

export type ExcelColumn = {
  label: string;
  key: string;
  width?: number;

  // NEW → allows custom value export//
  resolver?: (row: any) => any;
};

//Sheet Config//

export type SheetConfig = {
  sheetName: string;
  columns: ExcelColumn[];
  data: any[];
  excludeColumns?: string[];
  

};

//universal column mapper//

type AnyColumn = {
  key?: string;
  field?: string;
  id?: string;

  label?: string;
  headerName?: string;
  title?: string;

  width?: number;

 
  excelValue?: (row: any) => any;
};

type SummaryRule<T = any> = {
  label: string;                      //text apperas in excel//
  filter?: (row: T) => boolean;        //condition//
};

export const buildSummarySheet = <T>(
  sheetName: string,
  data: T[],
  rules: SummaryRule<T>[]
): SheetConfig => {
  return {
    sheetName,
    columns: [
      { key: "label", label: "Category", width: 35 },
      { key: "count", label: "Count", width: 20 },
    ],
    data: rules.map(rule => ({
      label: rule.label,
      count: rule.filter ? data.filter(rule.filter).length : data.length
    }))
  };
};


//map to Excel columns//

export const mapToExcelColumns = (columns: AnyColumn[]): ExcelColumn[] => {

  return columns
    //  remove non-exportable columns //
    .filter(col => {
      const key = col.key ?? col.field ?? col.id ?? "";

      // ignore action / empty columns   button edit delete icons and empty columns/
      if (!key) return false;
      if (key.toLowerCase() === "actions") return false;

      return true;
    })

    //column names//
    .map((col) => {

      const columnKey =
        col.key ??
        col.field ??
        col.id ??
        "";

      const columnLabel =
        col.label ??
        col.headerName ??
        col.title ??
        columnKey;

      return {
        key: String(columnKey),
        label: String(columnLabel),
        width: col.width || 25,
        resolver: col.excelValue
      };
    });
};


//export excel function//

export const downloadExcel = async (
  sheets: SheetConfig[],
  filename: string
) => {
  const workbook = new ExcelJS.Workbook();

  sheets.forEach((sheetConfig) => {
    const worksheet = workbook.addWorksheet(sheetConfig.sheetName);

    /* ---------- STEP 1: CREATE HEADER ---------- */
    const finalColumns = sheetConfig.excludeColumns
  ? sheetConfig.columns.filter(c => !sheetConfig.excludeColumns!.includes(c.key))
  : sheetConfig.columns;

worksheet.columns = finalColumns.map(col => ({
  header: col.label,
  key: col.key,
  width: col.width || 25
}));

    const columnCount = finalColumns.length;

    /* ---------- STEP 2: PUSH HEADER DOWN ---------- */
    worksheet.spliceRows(1, 0, [], []); 
    // now:
    // row1 empty
    // row2 empty
    // row3 = header

    /* ---------- STEP 3: TITLE ---------- */
    worksheet.getCell(1, 1).value = sheetConfig.sheetName;
    worksheet.mergeCells(1, 1, 1, columnCount);

    const titleCell = worksheet.getCell(1, 1);
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 28;

    /* ---------- STEP 4: GENERATED DATE ---------- */
    worksheet.getCell(2, 1).value =
      `Generated On: ${new Date().toLocaleString()}`;
    worksheet.mergeCells(2, 1, 2, columnCount);
    worksheet.getCell(2, 1).alignment = { horizontal: "right" };

    /* ---------- STEP 5: ADD DATA ---------- */
   sheetConfig.data.forEach(row => {

  const rowValues = finalColumns.map(col =>
    col.resolver ? col.resolver(row) : row[col.key]
  );

  worksheet.addRow(rowValues);

});

    /* ---------- HEADER STYLE (ROW 3 NOW) ---------- */
    const header = worksheet.getRow(3);

    header.font = { bold: true };
    header.alignment = { horizontal: "center", vertical: "middle" };

    header.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEFEFEF" }
      };
    });

    /* ---------- ROW HEIGHT ---------- */
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 3) row.height = 20;
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${filename}.xlsx`);
};
