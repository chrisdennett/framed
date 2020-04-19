import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
import rita from "rita";

export const PiffleControl = ({ piffleInputs, setPiffleInputs }) => {
  const { name, birthYear, media, canvasType, repiffleCount } = piffleInputs;

  const onArtistNameChange = (e) => {
    const name = e.target.value;
    setPiffleInputs({ ...piffleInputs, name });
  };

  const onMediaTypeChange = (e) => {
    const media = e.target.value;
    setPiffleInputs({ ...piffleInputs, media });
  };

  const onCanvasTypeChange = (e) => {
    const canvasType = e.target.value;
    setPiffleInputs({ ...piffleInputs, canvasType });
  };

  const onBirthYearChange = (e) => {
    const birthYear = e.target.value;
    setPiffleInputs({ ...piffleInputs, birthYear });
  };

  const onRepiffleCountChange = () => {
    setPiffleInputs({ ...piffleInputs, repiffleCount: repiffleCount + 1 });
  };

  return (
    <Container>
      <InputHolder>
        <InputLabel>Artist's Name: </InputLabel>
        <input type="text" value={name} onChange={onArtistNameChange} />
      </InputHolder>
      <InputHolder>
        <InputLabel>Birth Year: </InputLabel>
        <input type="text" value={birthYear} onChange={onBirthYearChange} />
      </InputHolder>
      <InputHolder>
        <InputLabel>Created With: </InputLabel>
        <input type="text" value={media} onChange={onMediaTypeChange} />
      </InputHolder>
      <InputHolder>
        <InputLabel>Created On: </InputLabel>
        <input type="text" value={canvasType} onChange={onCanvasTypeChange} />
      </InputHolder>
      <ButtHolder>
        <Button label="RE-PIFFLE" raised onClick={onRepiffleCountChange} />
      </ButtHolder>
    </Container>
  );
};

const Container = styled.div`
  padding-left: 7px;
  padding-right: 7px;

  input {
    padding: 10px;
    border-radius: 3px;
    border: none;
    width: 150px;
    font-size: 16px;
  }
`;

const InputHolder = styled.div`
  margin-bottom: 15px;
`;

const InputLabel = styled.div`
  width: 100%;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, 0.7);

  span {
    color: white;
  }
`;

const ButtHolder = styled.div`
  margin: 5px 5px 15px 0;
`;

//
export const generatePiffle = (inputs, inMobileMode) => {
  const starterElements = starter.split("#");
  let phrase = "";

  for (let el of starterElements) {
    phrase += getElement(el);
  }

  const firstName = inputs.name.split(" ")[0];
  let personalisedPhrase = phrase.replace("artistName", firstName);
  personalisedPhrase = personalisedPhrase.replace("mediaType", inputs.media);

  let title = generateTitle(inMobileMode);

  return { ...inputs, title, text: personalisedPhrase };
};

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

const generateTitle = (inMobileMode) => {
  // let rs = rita.randomWord("jj", 4);

  const w1 = capitalize(rita.randomWord("jj", getRandomInt(1, 5)));
  const w2 = capitalize(rita.randomWord("jj", getRandomInt(1, 5)));
  const w3 = capitalize(rita.randomWord("nn", getRandomInt(1, 5)));

  if (Math.random() > 0.4 || inMobileMode) return `${w1} ${w3}`;

  return `${w1} ${w2} ${w3}`;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const starter =
  "Here #artistName# #pluralVerb1# #adjective1# #noun1#, #verb1# #pluralNoun1# #preposition1# #adjective2# #pluralNoun2#, #adverb1# #verb2# #artTypeNoun1# #pluralNoun3#.";

const getElement = (el) => {
  let processedEl = el;

  if (grammar[el]) {
    const options = grammar[el];
    processedEl = options[Math.floor(Math.random() * options.length)];
  }

  return processedEl;
};

const grammar = {
  pluralVerb1: [
    "utilises",
    "employs",
    "promotes",
    "exploits",
    "applies",
    "manipulates",
    "flips",
    "reinvents",
    "adapts",
    "embraces",
    "exposes",
    "taps",
    "exposes",
    "deploys",
    "unfolds",
    "harnesses",
    "examines",
  ],
  adjective1: [
    "collective",
    "conceptual",
    "essential",
    "existential",
    "distinctive",
    "temporal",
    "synthetic",
    "primordial",
    "sublime",
    "provocative",
    "reductive",
    "fragile",
    "instinctive",
  ],
  noun1: [
    "non-being",
    "universalities",
    "unrealities",
    "violence",
    "passivities",
    "aggressions",
    "testaments",
    "robustnesses",
    "significance",
    "landscapes",
    "humanity",
  ],
  verb1: [
    "luring",
    "inviting",
    "enticing",
    "hooking",
    "pulling",
    "ambushing",
    "tempting",
    "drawing",
    "inducing",
    "seducing",
    "pushing",
    "hooking",
  ],
  pluralNoun1: [
    "viewers",
    "observers",
    "onlookers",
    "spectators",
    "witnesses",
    "bystanders",
  ],
  preposition1: [
    "into",
    "toward",
    "inside",
    "within",
    "to leave",
    "to eschew",
    "to question",
    "to abandon",
    "to disregard",
    "to shun",
  ],
  adjective2: [
    "informal",
    "biological",
    "formal",
    "antiseptic",
    "aseptic",
    "sub-conscious",
    "consumerist",
    "transcendent",
    "uncreated",
    "subtle",
    "uncomfortable",
    "precarious",
    "multifaceted",
    "multi-layered",
    "mundane",
    "implicit",
    "explicit",
    "intense",
  ],
  pluralNoun2: [
    "unreality",
    "assemblages",
    "associations",
    "derivatives",
    "dialogues",
    "relationships",
    "transformations",
    "synthesis",
    "parallels",
    "confrontations",
    "narratives",
  ],
  adverb1: [
    "obliquely",
    "acutely",
    "systematically",
    "obtusely",
    "robustly",
    "unapologetically",
    "uncompromisingly",
  ],
  verb2: [
    "underpinning",
    "juxtaposing",
    "intensifying",
    "forging",
    "provoking",
    "pivoting",
    "deafening",
    "stifling",
    "engulfing",
    "devouring",
  ],
  artTypeNoun1: [
    "modernist",
    "impressionist",
    "cubist",
    "expressionist",
    "surrealist",
    "post-modernist",
    "deconstructionist",
    "gothic",
    "hyper-realist",
    "naive",
    "minimalist",
    "neoclassical",
    "neo-figurative",
    "primitive",
    "psychedelic",
    "purist",
    "symbolic",
    "sculptural",
  ],
  pluralNoun3: [
    "corruptions",
    "abstractions",
    "inevitability",
    "mundanity",
    "voids",
    "suggestion",
    "responses",
    "phenomena",
    "hesitations",
  ],
};
