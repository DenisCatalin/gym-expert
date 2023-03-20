import { useEffect, useState } from "react";
import styles from "../../css/components/TransactionHistory.module.css";
import { Dialog } from "../../interface/Dialog";
import { tooltipTheme } from "../../utils/muiTheme";
import { ThemeProvider } from "@mui/material";
import { Button } from "../../interface/Button";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import TransactionHistoryButtonIcon from "../../styles/TransactionHistoryIcon.style";
import fetchData from "../../utils/fetchData";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const TransactionHistoryButton = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any>({});

  const userRedux = useSelector((state: any) => state.user.user);

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    (async () => {
      const data = await fetchData(`${process.env.NEXT_PUBLIC_FETCH_GET_TRANSACTIONS}`, {
        method: "GET",
        headers: {
          body: JSON.stringify({
            issuer: userRedux.issuer,
          }),
        },
      });
      setTransactions(data?.transactionHistory?.data?.purchases);
      console.log(data?.transactionHistory?.data?.purchases);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <ThemeProvider theme={tooltipTheme}>
        <TransactionHistoryButtonIcon
          color="secondary"
          label={
            <>
              <ReceiptLongRoundedIcon htmlColor="#fff" />
            </>
          }
          role="button"
          ariaLabel="Transaction history"
          className={styles.thButton}
          tooltip="Transaction history"
          tooltipPlacement="left"
          onClick={handleOpen}
          disabled={isLoading ? true : false}
        />
      </ThemeProvider>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title={"Transaction history"}
        fullWidth={true}
        maxWidth={"xl"}
        textStyles={styles.text}
        contentStyles={styles.background}
        contentOther={
          <>
            <TableContainer component={Paper} className={styles.background}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.text} align="center">
                      Product
                    </TableCell>
                    <TableCell className={styles.text} align="center">
                      Price
                    </TableCell>
                    <TableCell className={styles.text} align="center">
                      Payment ID
                    </TableCell>
                    <TableCell className={styles.text} align="center">
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <TableBody>
                    {transactions &&
                      transactions?.map((transaction: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            className={styles.text}
                            align="center"
                            sx={{ border: "none", outline: "none" }}
                          >
                            {transaction.planName}ly subscription
                          </TableCell>
                          <TableCell
                            className={styles.text}
                            align="center"
                            sx={{ border: "none", outline: "none" }}
                          >
                            ${transaction.planPrice}
                          </TableCell>
                          <TableCell
                            className={styles.text}
                            align="center"
                            sx={{ border: "none", outline: "none" }}
                          >
                            {transaction.paymentId}
                          </TableCell>
                          <TableCell
                            className={styles.text}
                            align="center"
                            sx={{ border: "none", outline: "none" }}
                          >
                            {transaction.date}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </>
        }
        actions={
          <>
            <Button label="Close" color="secondary" onClick={handleClose} />
          </>
        }
      />
    </>
  );
};

export default TransactionHistoryButton;
