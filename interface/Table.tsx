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
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import styles from "../css/components/Table.module.css";
import { setSnackbar } from "../redux/snackbar.slice";

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
  collection: string;
};

const Table = ({ className, rows, collection }: ITable) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [rowID, setRowID] = React.useState<number>();

  const dispatch = useDispatch();

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
      const querySnapshot = await db.collection(collection).where(field, "==", value).get();
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

  const deleteRow = async () => {
    const id = rowID;
    const actualID: any = await getDocumentIdByFieldValue("id", id);
    try {
      await db.collection(collection).doc(actualID).delete();
      console.log(`Document with ID ${actualID} was successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting document with ID ${actualID}:`, error);
    }
    handleClose();
    dispatch(
      setSnackbar({
        open: true,
        content: "You have successfully deleted your progress",
      })
    );
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const setupDialog = (idx: number) => {
    setOpenDialog(true);
    setRowID(rows[idx].id);
  };

  React.useEffect(() => {
    console.log(rowID);
  }, [rowID]);

  return (
    <>
      <TableContainer component={Paper}>
        <ThemeProvider theme={tableTheme}>
          <MuiTable
            sx={{ minWidth: 500 }}
            className={className}
            aria-label="custom pagination table"
          >
            <TableBody>
              <TableCell>Date</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell align="right">Muscle gain (g)</TableCell>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row: any, idx: number) => (
                <TableRow key={idx} onClick={() => setupDialog(idx)}>
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
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title="Are you sure you want to delete this row?"
        textStyles={styles.text}
        contentStyles={styles.background}
        contentText={
          "You are about to delete this row which is part of your personal progress. You really want to do that?"
        }
        actions={
          <>
            <Button color="secondary" onClick={handleClose} label="No" />
            <Button color="secondary" onClick={deleteRow} autoFocus={true} label="Yes" />
          </>
        }
      />
    </>
  );
};

export default Table;
