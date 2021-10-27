export const convertCyrillicToOdata = (columnName: string): string => {
  let resultString = "";
  for (let i = 0; i < columnName.length; i++) {
    if (columnName.charAt(i).match(/[А-Яа-я]/)) {
      let charCode = columnName.codePointAt(i).toString(16);
      charCode = charCode.length !== 4 ? "0" + charCode : charCode;
      resultString += "_x" + charCode + "_";
    } else {
      resultString += columnName.charAt(i);
    }
  }
  return resultString;
};

const convertOdataToCyrillic = (encodedColumnName: string) => {
  const decodedCharacters = encodedColumnName
    .split("_")
    .filter(String)
    .map((character: string) => {
      if (!character.match(/x\d+/)) return character;
      return String.fromCodePoint(parseInt(character.slice(1), 16));
    });
  return decodedCharacters.reduce(
    (acc: string, character: string) => acc + character
  );
};
