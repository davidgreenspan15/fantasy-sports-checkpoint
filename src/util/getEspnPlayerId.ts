export const getPlayerID = (url: string) => {
  const x = url.split('/');
  const index = x.findIndex(s => s === 'id');
  if (index >= 0) {
    return x[index + 1];
  }
};
