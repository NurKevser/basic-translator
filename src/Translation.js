import axios from "axios";
import React, { useEffect, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const Translation = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setInput(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const API_KEY = "AIzaSyAsXHjBeoy5CDgNgp6lWUnIo-d3NraDho8";
  const DETECT_LANG = "en";
  const TARGET_LANG = "tr";

  const translate = async () => { 

    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&q=${input}&source=${DETECT_LANG}&target=${TARGET_LANG}`;
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setOutput(response.data.translations[0].translatedText);
      })
      .catch((error) => {
        console.log(error);
      });
    };
    
    
  return (
    <div>
      <div>Basic Translator</div>
      <div className="container">
        <div className="language">English</div>
        <div className="text">
          <div className="text from">
            <textarea
              cols="30"
              rows="10"
              onInput={(e) => setInput(e.target.value)}
              value={input}
            ></textarea>
          </div>
          <span onClick={() => setIsListening((prevState) => !prevState)}>
            &#127897;
          </span>
        <div className="language">Turkish</div>
          <div className="text to">
            <textarea cols="30" rows="10" value={output}></textarea>
          </div>
        </div>
        <button onClick={(e) => translate()}>Translate</button>
      </div>
    </div>
  );
};

export default Translation;
