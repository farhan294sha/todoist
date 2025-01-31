import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Welcome from "@/components/Welcome";
import PasswordInput from "@/components/PasswordInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema, TsignupSchema } from "@shared/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atom";
import CenterSpinner from "@/components/Spinner";
import { safeAwait } from "@/lib/utils";

interface CustomErrorData {
  message: string;
  errorCode: number;
  error: any;
}

export interface ApiAuthResponse {
  messaeg: string;
  accessToken: string;
}

export interface AxiosErrorData extends AxiosError<CustomErrorData> {}

const Signup: FC = () => {
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userState);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TsignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();

  if (user) {
    navigate("/today", { replace: true });
  }

  const onSubmit: SubmitHandler<TsignupSchema> = async (data) => {
    const [err, response] = await safeAwait(
      apiClient.post<ApiAuthResponse>("api/auth/signup", data)
    );
    if (err) {
      if (err instanceof AxiosError && err.response) {
        const error: AxiosErrorData = err;
        if (error.response?.data.errorCode === 1002) {
          setError("email", { message: "This email is already taken" });
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      return;
    }
    console.log("reched navigate");
    location.reload()
    navigate("/today");
  };

  const handleOnclick = () => {
    setLoading(true);
    window.open("http://localhost:3000/api/auth/google", "_self");
  };

  if (loading) {
    return <CenterSpinner />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col mt-3">
      <section>
        <div className="mt-2 absolute flex items-center gap-3 top-2">
          <img src="./logo.svg" alt="logo" />
          <h2 className="font-bold text-lg">FocusFlow</h2>
        </div>
        <div className=" flex justify-center items-center gap-52">
          <div className="w-96 flex justify-around flex-col h-full">
            <Card className="border-none shadow-none">
              <CardHeader className="flex w-full items-center">
                <CardTitle className="font-bold text-3xl">
                  Create an account
                </CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent className=" flex flex-col gap-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        {...register("name")}
                        id="name"
                        placeholder="Enter your name"
                        type="text"
                      />
                      {errors.name && (
                        <div className="text-red-500">
                          {errors.name.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        {...register("email")}
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        className={`${
                          errors.email ? "border-red-500 text-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <div className="text-red-500">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <PasswordInput {...register("password")} />
                      {errors.password && (
                        <div className="text-red-500">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        "Signup"
                      )}
                    </Button>
                  </div>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleOnclick}
                  type="submit"
                  className="flex gap-2"
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    <>
                      <img
                        src="./google.svg"
                        width={24}
                        height={24}
                        alt="google"
                      />
                      <span>Google</span>{" "}
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <p>Already have an account?</p>
                <Button variant="link" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
              </CardFooter>
            </Card>
          </div>
          <Welcome />
        </div>
      </section>
    </div>
  );
};
export default Signup;
