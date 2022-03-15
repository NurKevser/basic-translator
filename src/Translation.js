import axios from "axios";
import React, { useEffect, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US" || "tr-TR";

const Translation = () => {
  const [options, setOptions] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  //speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState(null);

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
      setText(transcript)
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const translate = () => {
    const params = new URLSearchParams();
    params.append("q", input);
    params.append("source", from);
    params.append("target", to);
    params.append("api_key", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    axios
      .post("https://libretranslate.de/translate", params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        setOutput(res.data.translatedText);
      });
  };

  useEffect(() => {
    axios
      .get("https://libretranslate.com/languages", {
        headers: { accept: "application/json" },
      })
      .then((res) => {
        setOptions(res.data);
      });
  }, []);
  return (
    <div>
      <div>Basic Translator</div>
      <div className="container">
        <div className="detect-lang">
          <select
            className="detect-lang_from"
            onChange={(e) => setFrom(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.name}
              </option>
            ))}
          </select>
          <select
            className="detect-lang_from"
            onChange={(e) => setTo(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text">
          <div className="text from">
            <textarea
              cols="30"
              rows="10"
              onInput={(e) => setInput(e.target.value)}
              value={text}
            ></textarea>
          </div>
          
            <span onClick={() => setIsListening(prevState => !prevState)}>&#127897;</span>
         
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
