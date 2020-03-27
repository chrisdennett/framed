import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";

export const PiffleControl = ({ piffle, setPiffle }) => {
  const { name, media, text } = piffle;

  const onArtistNameChange = e => {
    const name = e.target.value;
    const text = generatePiffle({ name, media });
    console.log("text: ", text);
    setPiffle({ ...piffle, name, text });
  };

  const onMediaTypeChange = e => {
    const media = e.target.value;
    const text = generatePiffle({ name, media });
    console.log("text: ", text);
    setPiffle({ ...piffle, media, text });
  };

  if (text && text === "xxx") {
    const text = generatePiffle({ name, media });
    console.log("text: ", text);
    setPiffle({ ...piffle, text });
  }

  return (
    <Container>
      <InputHolder>
        <InputLabel>Artist's Name: </InputLabel>
        <input type="text" value={name} onChange={onArtistNameChange} />
      </InputHolder>
      <div>
        <InputLabel>Media Type: </InputLabel>
        <input type="text" value={media} onChange={onMediaTypeChange} />
      </div>
      <ButtHolder>
        <Button label="RE-PIFFLE" raised />
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
  color: rgba(255, 255, 255, 0.5);

  span {
    color: white;
  }
`;

const ButtHolder = styled.div`
  margin: 5px 5px 15px 0;
`;

//
const generatePiffle = ({ name, media }) => {
  const starterElements = starter.split("#");
  let phrase = "";

  for (let el of starterElements) {
    phrase += getElement(el);
  }

  let personalisedPhrase = phrase.replace("artistName", name);
  personalisedPhrase = personalisedPhrase.replace("mediaType", media);

  return personalisedPhrase;
};

const starter =
  "#artistName# #pluralVerb1# the #adjective1# #noun1# of #mediaType#, #verb1# #pluralNoun1# #preposition1# #adjective2# #pluralNoun2#, #adverb1# #verb2# #artTypeNoun1# #pluralNoun3#.";

const getElement = el => {
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
    "examines"
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
    "instinctive"
  ],
  noun1: [
    "non-being",
    "universality",
    "unreality",
    "violence",
    "passivity",
    "aggression",
    "testament",
    "robustness",
    "significance",
    "landscape",
    "humanity"
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
    "hooking"
  ],
  pluralNoun1: [
    "viewers",
    "observers",
    "onlookers",
    "spectators",
    "witnesses",
    "bystanders"
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
    "to shun"
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
    "intense"
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
    "narratives"
  ],
  adverb1: [
    "obliquely",
    "acutely",
    "systematically",
    "obtusely",
    "robustly",
    "unapologetically",
    "uncompromisingly"
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
    "devouring"
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
    "hyper realist",
    "naive",
    "minimalist",
    "neoclassical",
    "neo-figurative",
    "primitive",
    "psychedelic",
    "purist",
    "symbolic",
    "sculptural"
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
    "hesitations"
  ]
};
