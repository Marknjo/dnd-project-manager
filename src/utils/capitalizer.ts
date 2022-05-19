/**
 * Capitalizer
 * @param word Word to capitalize
 * @returns Capitalized word
 */
const capitalizer = (word: string) => {
  return (
    word.charAt(0).toLocaleUpperCase() +
    word.toLocaleLowerCase().split('').slice(1).join('')
  );
};

export default capitalizer;
