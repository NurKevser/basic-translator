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
    JSON.parse(localStorage.getItem("LocalHistory")) || []
  );

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
    if (event.target.value === "") {
      setHistory([
        ...history,
        { input: interimInput[0].trim(), output: interimOutput[0] },
      ]);
      localStorage.setItem(
        "LocalHistory",
        JSON.stringify([
          ...history,
          { input: interimInput[0].trim(), output: interimOutput[0] },
        ])
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8) {
      setInterimInput([...interimInput, event.target.value,]);
      setInterimOutput([...interimOutput, output]);
    } else {
      setInterimInput([]);
      setInterimOutput([]);
    }
  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
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
          <div className="lang detect">English</div>
          <textarea
            cols="60"
            rows="10"
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            value={input}
          ></textarea>
        </div>
        <div className="text output">
          <div className="lang target">Turkish</div>
          <textarea cols="60" rows="10" defaultValue={output}></textarea>
        </div>
      </div>
      <span
        className={isListening ? "micOn" : "micOff"}
        onClick={() => setIsListening((prevState) => !prevState)}
      >
        &#127897;
      </span>
      <div className="history" onClick={handleShowHistory}>
        <span>&#8635;</span>
        {tableShow && (
          <div className="table">
           <div className="table-header">
           <div>English</div>
            <div>Turkish</div>
           </div>
            {history?.map((item, i) => (
              <div key={i} className="table-row">
              <div>{item.input}</div>
              <div>{item.output}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;