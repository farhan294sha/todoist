import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";



interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    function togglePasswordVisibility() {
      setIsPasswordVisible((prevState) => !prevState);
    }

    return (
      <div className="relative">
        <Label htmlFor="password">Password</Label>
        <Input
          {...props}
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Enter your password"
          ref={ref}
        />
        <Button
          className="absolute right-0 top-6"
          type="button"
          variant="ghost"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    );
  }
);

export default PasswordInput