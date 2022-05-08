document.getElementById('wordInput').addEventListener("keyup", e=> e.key === "Enter" && main());

var playing = false;

const main = () => {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  if(word) {
    changeLoadingState(true);
    getDefinition(word)
      .then((resp) => {
        if(resp.status >= 400) {
          renderErrorScreen(resp.json());
          changeLoadingState(false);
          return "ERROR";
        } 
        return resp.json();
      })
      .then((res) => {
          if(res !== "ERROR") {
            renderDefinition(res[0]);
            changeLoadingState(false);
          }
      })
      .catch((err) => console.error(err.message));
  }
}

const getDefinition = (word) => fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

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
          setTimeout(()=> playing = false, 1000)
          try {
            await audio.play();
          } catch (err) {
            alert("error, the audio could not be played :/");
            console.error(err.message)
          }
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

function renderErrorScreen (resp) {
  resp.then(res => {
    document.querySelector(".df-header").innerHTML = ""
    document.querySelector(".df-body").innerHTML = `
    <div class="error-container">
      <h2>${res.title}</h2>
      <p>${res.message}</p>
    </div>
    `
  })
}

const changeLoadingState = (isLoading) => {
  if(isLoading) {
    const loadingMessage = document.createElement('h1')
    loadingMessage.innerText = "Loading ..."
    loadingMessage.id = 'isLoadingMessage'

    document.getElementById('definitionContainer').appendChild(loadingMessage)
  } 
  else document.getElementById('isLoadingMessage').remove()
}

const clearInput = () => document.getElementById("wordInput").value = "";