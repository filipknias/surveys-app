// Format expiration date
export const formatExpirationDate = (date) => {
  const dateString = new Date(date).toLocaleString();
  const formattedDate = dateString.substr(0, dateString.length - 3);
  return formattedDate;
};

// Format created at date
export const formatCreatedAtDate = (date) => {
  const dateString = new Date(date).toDateString();
  const formattedDate = dateString.substr(3, dateString.length);
  return formattedDate;
};
