import { useState } from "react";
import StyledButton from "../shared/StyledButton";
import doc from "../firebase/firestore";

type Props = {
  score: Score | null;
  onComplete: () => void;
};

type SubmitState = "ready" | "submitting" | "complete";
const ButtonLabel = new Map<SubmitState, string>([
  ["ready", "Submit"],
  ["submitting", "Submitting.."],
  ["complete", "Complete"],
]);

const ResultSubmitButton: React.VFC<Props> = ({ score, onComplete }) => {
  // This state should initialized when unmount with playing new game
  const [submitState, setSubmitState] = useState<SubmitState>("ready");
  return score ? (
    <StyledButton
      bg="#fff"
      _disabled={{ opacity: 1, color: "gray.400", bg: "gray.100" }}
      disabled={submitState !== "ready"}
      onClick={async () => {
        setSubmitState("submitting");
        console.log("Submit");
        await doc.addScore(score);
        setSubmitState("complete");
        onComplete();
      }}
    >
      {ButtonLabel.get(submitState)}
    </StyledButton>
  ) : null;
};

export default ResultSubmitButton;
