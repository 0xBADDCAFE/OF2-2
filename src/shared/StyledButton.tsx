import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { VFC } from "react";

const StyledButton: VFC<ButtonProps> = forwardRef<ButtonProps, "button">(
  (props, ref) => (
    <Button
      transition="all 0.1s"
      _focus={{ outline: "none" }}
      ref={ref}
      {...(props.variant !== "outline"
        ? {
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
            _active: {
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            },
          }
        : null)}
      {...props}
    />
  )
);

export default StyledButton;
