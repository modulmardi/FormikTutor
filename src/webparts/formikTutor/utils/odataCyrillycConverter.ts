export const convertCyrillicToOdata = (columnName: string): string => {
  let resultString = "";
  let nonCyrillicFirstSymbol = false;
  for (let i = 0; i < columnName.length; i++) {
    if (columnName.charAt(i) === " ") continue;
    if (!columnName.charAt(i).match(/[A-Za-z\d_]/)) {
      resultString += mutateCharacter(columnName, i);
    } else {
      if (i === 0 && columnName.charAt(i).match(/\d/))
        nonCyrillicFirstSymbol = true;
      resultString += columnName.charAt(i);
    }
  }
  console.log("_______________________________________");
  console.log(columnName, resultString, resultString.length);
  console.log("_______________________________________");

  if (nonCyrillicFirstSymbol && resultString.length > 33) {
    resultString = mutateCharacter(resultString, 0) + resultString.slice(1);
  }
  return resultString.match(/^.{0,32}/)[0];
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

const mutateCharacter = (character: string, i) => {
  let charCode = character.codePointAt(i).toString(16);
  return "_x" + normalizeEncodedCharacter(charCode) + "_";
};

const normalizeEncodedCharacter = (encodedCharacter: string) => {
  return "0".repeat(4 - encodedCharacter.length) + encodedCharacter;
};
