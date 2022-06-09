import { useToast } from "@chakra-ui/react";
import { DocumentReference } from "firebase/firestore";
import { useState } from "react";
import * as doc from "../firebase/firestore";
import StyledButton from "../shared/StyledButton";

type Props = {
  score: Score | null;
  onSubmitted: (docRef: DocumentReference<doc.DBRow<Score>>) => void;
};

type SubmitState = "ready" | "submitting" | "complete";
const ButtonLabel = new Map<SubmitState, string>([
  ["ready", "Submit"],
  ["submitting", "Submitting.."],
  ["complete", "Complete"],
]);

const ResultSubmitButton: React.VFC<Props> = ({ score, onSubmitted }) => {
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
          onSubmitted(await doc.addScore(score));
        } catch {
          toast({
            title: "Submit error.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        setSubmitState("complete");
      }}
    >
      {ButtonLabel.get(submitState)}
    </StyledButton>
  ) : null;
};

export default ResultSubmitButton;
