import jssha from 'jssha';

const { SALT } = process.env;

// eslint-disable-next-line import/prefer-default-export
export const getHash = (input) => {
  // eslint-disable-next-line new-cap
  const shaObj = new jssha('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // const unhasedString = `${input}`;
  const unhasedString = `${input}-${SALT}`;
  shaObj.update(unhasedString);

  return shaObj.getHash('HEX');
};
