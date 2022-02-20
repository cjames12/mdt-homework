export const formatTransactionDates = (transactionList) => {
  return transactionList.data.map(transaction => {
    const formattedDate = new Date(transaction.transactionDate).toDateString();

    return {...transaction, transactionDate: formattedDate};
  })
}