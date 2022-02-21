document.getElementById('wordInput').addEventListener("keyup", (e)=> {
  e.key === "Enter" && handleClick();
})

var playing = false;

const handleClick = () => {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  word &&
    getDefinition(word)
      .then((resp) => {
        if(resp.status >= 400) {
          renderErrorScreen(resp.json());
          return "ERROR";
        } 
        return resp.json();
      })
      .then((res) => {
          if(res !== "ERROR") {
            renderDefinition(res[0]);
          }
      })
      .catch((err) => {
        console.log(err)
      })
}

const getDefinition = (word) => {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
}

function renderDefinition(df){
  clearInput();
  let dfbody = document.querySelector(".df-body");
  let dfheader = document.querySelector(".df-header");

  let phoneticText;
  df.phonetics.every((phonetic) => {
    if (phonetic.text.length > 0) {
      phoneticText = phonetic.text;
      return false;
    }
    return true;
  });

  dfheader.innerHTML = "";
  dfbody.innerHTML = "";

  dfheader.innerHTML = `<h2 class="wordShowcase">${df.word} ${
    phoneticText ?
    `<span class="phoneticShowcase">${phoneticText}</span>` : ""
  } </h2>`;
  let audioSrc;
  
  df.phonetics.every(phonetic => {
    if (phonetic.audio.length > 0) {
      audioSrc = phonetic.audio;
      createAudioBtn(audioSrc);
      return false
    }
    return true
  })
  

  function createAudioBtn () { 
    if(audioSrc.length > 0) {
      let btn = document.createElement("button");
      btn.innerText = "🔊";
      btn.classList.add("audioBtn");
      btn.onclick = async function playAudio () {
        if(!playing) {
          let audio = new Audio(audioSrc);
          audio.type = "audio/mp3";
          playing = true;
          setTimeout(()=> {
            playing = false
          }, 1000)
          try {
            await audio.play();
          } catch {
            alert("error, the audio could not be played :/");
          }
        } else {

        }
      }
      dfheader.appendChild(btn);
    }
  }

  
  
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

function renderErrorScreen (resp) {
  resp.then(res => {
    document.querySelector(".df-body").innerHTML = `
    <div class="error-container">
      <h2>${res.title}</h2>
      <p>${res.message}</p>
    </div>
    `
  })
}