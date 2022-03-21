import React, { useEffect, useState } from "react";
import "./style/translation.scss";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const Translation = () => {
  const [input, setInput] = useState(""); //handle both written and spoken input
  const [output, setOutput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimInput, setInterimInput] = useState([]);
  const [interimOutput, setInterimOutput] = useState([]);
  const [tableShow, setTableShow] = useState(false);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("LocalHistory"))
  );

  const store = JSON.parse(localStorage.getItem("LocalHistory"));

  useEffect(() => {
    translate(output);
  }, [input]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleShowHistory = () => {
    setTableShow(!tableShow);
  };

  const handleInput = (event) => {
    setInput(event.target.value);
    if (event.target.value.trim() === "" || event.target.value.trim() === " ") {
      setHistory({
        input: [...history.input, interimInput[0]],
        output: [...history.output, interimOutput[0]],
      });
      localStorage.setItem(
        "LocalHistory",
        JSON.stringify({
          input: [...history.input, interimInput[0]],
          output: [...history.output, interimOutput[0]],
        })
      );
      setInterimInput([]);
      setInterimOutput([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8) {
      // setHistory(event.target.value)
      console.log("event", event.target.value);
      setInterimInput([...interimInput, event.target.value]);
      setInterimOutput([...interimOutput, output]);
    }
  };

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
    <div className="container">
      <header>Basic Translator</header>
      <div className="container-box">
        <div className="text input">
          <div className="language">English</div>
          <textarea
            cols="30"
            rows="10"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={input}
          ></textarea>
        </div>
        <div className="text output">
          <div className="language">Turkish</div>
          <textarea cols="30" rows="10" defaultValue={output}></textarea>
        </div>
      </div>
      <span
        className="mic"
        onClick={() => setIsListening((prevState) => !prevState)}
      >
        &#127897;
      </span>
      <div className="history" onClick={handleShowHistory}>
        &#8635;
        {tableShow && <div>{store.input}</div>}
      </div>
    </div>
  );
};

export default Translation;
