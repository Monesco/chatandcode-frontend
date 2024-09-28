export const estimateTokens = (text) => {
    // Approximate 1 token per 4 characters
    return Math.ceil(text.length / 4);
  };
  