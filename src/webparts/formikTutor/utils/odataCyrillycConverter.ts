export const convertCyrillicToOdata = (columnName: string) => {
  let resultString: string = "";
  for (let i = 0; i < columnName.length; i++) {
    let charCode = columnName.codePointAt(i).toString(16);
    charCode = charCode.length != 4 ? "0" + charCode : charCode;
    resultString += "_x" + charCode + "_";
  }
  return resultString;
};

export const convertOdataToCyrillic = (encodedColumnName: string) => {
  const encodedCharacters: number[] = encodedColumnName
    .split("_")
    .filter(String)
    .map((encodedCharacter) => parseInt(encodedCharacter.slice(1), 16));
  return String.fromCodePoint(...encodedCharacters);
};
