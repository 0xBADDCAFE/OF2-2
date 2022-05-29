import { useState } from "react";
import StyledButton from "../shared/StyledButton";
import * as doc from "../firebase/firestore";
import { useToast } from "@chakra-ui/react";

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
  const toast = useToast();
  return score ? (
    <StyledButton
      bg="#fff"
      _disabled={{ opacity: 1, color: "gray.400", bg: "gray.100" }}
      isLoading={submitState === "submitting"}
      disabled={submitState === "complete"}
      onClick={async () => {
        setSubmitState("submitting");
        console.log("Submit");
        try {
          const docRef = await doc.addScore(score);
        } catch {
          toast({
            title: "Submit error.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        setSubmitState("complete");
        onComplete();
      }}
    >
      {ButtonLabel.get(submitState)}
    </StyledButton>
  ) : null;
};

export default ResultSubmitButton;
