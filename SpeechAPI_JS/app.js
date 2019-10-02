// init speech synth api
const synth = window.speechSynthesis;

// get dom elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // loop through voices and display in dom
  voices.forEach(voice => {
    // create option element
    const option = document.createElement("option");
    // fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";
    // set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// speak
const speak = () => {
  //check if already speaking
  if (synth.speaking) {
    console.error("already speaking");
    return;
  }
  if (textInput.value !== "") {
    // add background animation
    body.style.background = "#141414 url(/img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";
    // get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // speak  end
    speakText.onend = e => {
      console.log("done speaking");
      body.style.background = "#141414";
    };

    // speak error
    speakText.onError = e => {
      console.log("Something went wrong");
    };

    // selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    console.log(selectedVoice);

    // loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // speak
    synth.speak(speakText);
  }
};

// event listeners

textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// rate value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));
// pitch value change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// voice select change
voiceSelect.addEventListener("change", e => speak());
