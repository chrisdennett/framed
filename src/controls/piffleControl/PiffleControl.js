import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
import rita from "rita";

export const PiffleControl = ({ piffleData, setPiffleData, inMobileMode }) => {
  const {
    name,
    birthYear,
    media,
    title = "Untitled",
    text = "...",
  } = piffleData;

  const onPiffleAttChange = (label, value) => {
    let newText = text;

    if (label === "name") {
      newText = replaceNameInDescription(value, text);
    }

    setPiffleData({ ...piffleData, [label]: value, text: newText });
  };

  const onGenerateTitle = () => {
    const newTitle = generateTitle(inMobileMode);
    setPiffleData({ ...piffleData, title: newTitle });
  };

  const onGenerateDescription = () => {
    const newDescription = generateDescription(piffleData);
    setPiffleData({ ...piffleData, text: newDescription });
  };

  return (
    <Container>
      <InputHolder>
        <InputLabel>Artist's Name: </InputLabel>
        <input
          type="text"
          size={12}
          value={name}
          onChange={(e) => onPiffleAttChange("name", e.target.value)}
        />
      </InputHolder>
      <InputHolder>
        <InputLabel>Birth Year: </InputLabel>
        <input
          type="text"
          value={birthYear}
          size={4}
          onChange={(e) => onPiffleAttChange("birthYear", e.target.value)}
        />
      </InputHolder>
      <InputHolder fullWidth>
        <InputLabel>
          Medium:
          <span style={{ marginLeft: 10, textTransform: "lowercase" }}>
            (e.g. oil on canvas)
          </span>
        </InputLabel>
        <input
          type="text"
          size={30}
          value={media}
          onChange={(e) => onPiffleAttChange("media", e.target.value)}
        />
      </InputHolder>
      <InputHolder fullWidth>
        <InputLabel>
          Title:{" "}
          <StyledGenerateButton
            label="Generate"
            dense
            onClick={onGenerateTitle}
          />
        </InputLabel>

        <input
          type="text"
          size={30}
          value={title}
          onChange={(e) => onPiffleAttChange("title", e.target.value)}
        />
      </InputHolder>
      <InputHolder fullWidth>
        <InputLabel>
          Description:{" "}
          <StyledGenerateButton
            label="Generate"
            dense
            onClick={onGenerateDescription}
          />
        </InputLabel>
        <textarea
          type="text"
          rows={7}
          value={text}
          onChange={(e) => onPiffleAttChange("text", e.target.value)}
        />
      </InputHolder>

      {/* <ButtHolder>
        <Button label="RE-PIFFLE" raised onClick={onRepiffleCountChange} />
      </ButtHolder> */}
    </Container>
  );
};

const Container = styled.div`
  padding-left: 7px;
  padding-right: 7px;
  display: flex;
  flex-wrap: wrap;
`;

const InputHolder = styled.div`
  margin-bottom: 15px;
  margin-right: 10px;
  width: ${(props) => (props.fullWidth ? "100%" : "inherit")};

  input {
    padding: 10px;
    border-radius: 3px;
    border: none;
    font-size: 14px;
    font-family: monospace;
    /* width: 95%; */
  }

  textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }
`;

const InputLabel = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, 0.7);
`;

const StyledGenerateButton = styled(Button)`
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-left: 10px;
`;

const replaceNameInDescription = (newName, description) => {
  const newFirstName = newName.split(" ")[0];
  const descriptionWithoutName = description.split(" ").slice(1).join(" ");
  return newFirstName + " " + descriptionWithoutName;
};

//
export const generateDescription = (currentData) => {
  const starterElements = starter.split("#");
  let phrase = "";

  for (let el of starterElements) {
    phrase += getElement(el);
  }

  const firstName = currentData.name.split(" ")[0];
  let personalisedPhrase = phrase.replace("artistName", firstName);
  personalisedPhrase = personalisedPhrase.replace(
    "mediaType",
    currentData.media
  );

  return personalisedPhrase;
};

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

export const generateTitle = (inMobileMode) => {
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
  "#artistName# #pluralVerb1# #adjective1# #noun1#, #verb1# #pluralNoun1# #preposition1# #adjective2# #pluralNoun2#, #adverb1# #verb2# #artTypeNoun1# #pluralNoun3#.";

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
    "forcing",
    "hooking",
    "pulling",
    "ambushing",
    "tempting",
    "drawing",
    "inducing",
    "seducing",
    "pushing",
    "provoking",
    "challenging",
  ],
  pluralNoun1: [
    "viewers",
    "observers",
    "onlookers",
    "spectators",
    "gawkers",
    "witnesses",
    "bystanders",
    "beholders",
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
