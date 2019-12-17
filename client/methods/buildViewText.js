const buildViewText = (view) => {
  switch (view) {
    case '1D':
      return 'Today';
    case '1W':
      return 'Past Week';
    case '1M':
      return 'Past Month';
    case '3M':
      return 'Past 3 Months';
    case '1Y':
      return 'Past Year';
    case '5Y':
      return 'Past 5 Years';
  }
  throw new Error('View Passed in wrong');
};

export default buildViewText;
