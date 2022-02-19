const handleClick = () => {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  word &&
  getDefinition(word.toLowerCase());
}

const getDefinition = () => {

}