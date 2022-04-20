import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { VFC } from "react";

const StyledButton: VFC<ButtonProps> = forwardRef<ButtonProps, "button">(
  (props, ref) => (
    <Button
      boxShadow="0 3px 5px rgba(0, 0, 0, 0.1)"
      transition="all 0.1s"
      _focus={{ outline: "none" }}
      _active={{
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      }}
      ref={ref}
      {...props}
    />
  )
);

export default StyledButton;
