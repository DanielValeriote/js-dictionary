document.getElementById('wordInput').addEventListener("keyup", (e)=> {
  e.key === "Enter" && handleClick();
})

const handleClick = () => {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  word &&
    getDefinition(word)
      .then((resp) => resp.json())
      .then((res) => renderDefinition(res[0]))
      .catch((err) => {
        document.querySelector(
          ".df-body"
        ).innerHTML = `<h3 style="color: red; text-align: center">Sorry, no definition found :/</h3>`;
      })
}

const getDefinition = (word) => {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
}

const renderDefinition = (df) => {
  clearInput();
  let dfbody = document.querySelector(".df-body");
  dfbody.innerHTML = "";
  df.meanings.forEach((meaning) => {
    let ol = document.createElement("ol");
    ol.innerHTML = `<h3 class="partOfSpeech">${meaning.partOfSpeech}</h3>`
    meaning.definitions.forEach(definition => {
      let li = document.createElement("li");
      li.innerHTML = `
      <p>${definition.definition}</p>
      ${
        definition.example
          ? `<p class="sentence-example "><span class="ex-label">ex: </span>${definition.example}</p>`
          : ""
      } 
      `;
      ol.appendChild(li)
    })
    dfbody.appendChild(ol)
  })

  df.meanings[0].definitions.forEach(df => {
    let li = document.createElement("li");
    li.innerHTML = `
    <p>${df.definition}</p>
    ${
      df.example
        ? `<p class="sentence-example to-copy"><span class="ex-label">ex: </span>${df.example}</p>`
        : ""
    }
    `;
  });
}

function clearInput () {
  document.getElementById("wordInput").value = "";
}