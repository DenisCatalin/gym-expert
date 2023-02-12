import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { ThemeProvider } from "@mui/material";
import { tableTheme } from "../utils/muiTheme";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

firebase.initializeApp({
  apiKey: "AIzaSyDhSgEog6qqbLTE_WakNisgFLVLHG7wVqg",
  authDomain: "gym-expert-chat.firebaseapp.com",
  projectId: "gym-expert-chat",
  storageBucket: "gym-expert-chat.appspot.com",
  messagingSenderId: "791772438333",
  appId: "1:791772438333:web:9aedb139733266f3f0ef54",
  measurementId: "G-ZK5ZS8BCZV",
});

const db = firebase.firestore();

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? (
          <LastPageIcon htmlColor="#fff" />
        ) : (
          <FirstPageIcon htmlColor="#fff" />
        )}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight htmlColor="#fff" />
        ) : (
          <KeyboardArrowLeft htmlColor="#fff" />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft htmlColor="#fff" />
        ) : (
          <KeyboardArrowRight htmlColor="#fff" />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? (
          <FirstPageIcon htmlColor="#fff" />
        ) : (
          <LastPageIcon htmlColor="#fff" />
        )}
      </IconButton>
    </Box>
  );
}

type ITable = {
  className?: string;
  rows: any;
};

const Table = ({ className, rows }: ITable) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDate = (seconds: number) => {
    const output = new Date(Math.floor(seconds * 1000));
    const startingDate = output.toString().split("GMT");
    return startingDate[0];
  };

  async function getDocumentIdByFieldValue(field: string, value: any) {
    try {
      const querySnapshot = await db.collection("userProgress").where(field, "==", value).get();
      if (querySnapshot.empty) {
        console.log(`No documents found with ${field} equal to ${value}.`);
        return null;
      } else {
        const document = querySnapshot.docs[0];
        console.log(`Document data:`, document.data());
        return document.id;
      }
    } catch (error) {
      console.error(`Error getting document with ${field} equal to ${value}:`, error);
      return null;
    }
  }

  const deleteRow = async (idx: number) => {
    const id = rows[idx].id;
    console.log(rows[idx].id);
    const mortiiTai: any = await getDocumentIdByFieldValue("id", id);
    try {
      await db.collection("userProgress").doc(mortiiTai).delete();
      console.log(`Document with ID ${mortiiTai} was successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting document with ID ${mortiiTai}:`, error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <ThemeProvider theme={tableTheme}>
        <MuiTable sx={{ minWidth: 500 }} className={className} aria-label="custom pagination table">
          <TableBody>
            <TableCell>Date</TableCell>
            <TableCell align="right">Weight</TableCell>
            <TableCell align="right">Muscle gain (g)</TableCell>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row: any, idx: number) => (
              <TableRow key={idx} onClick={() => deleteRow(idx)}>
                <TableCell component="th" scope="row">
                  {`${getDate(row?.createdAt?.seconds)}`}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.weightLoss}kg
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.muscleGain}g
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </MuiTable>
      </ThemeProvider>
    </TableContainer>
  );
};

export default Table;
