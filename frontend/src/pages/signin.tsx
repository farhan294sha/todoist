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
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Welcome from "@/components/Welcome";
import PasswordInput from "@/components/PasswordInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema, TloginSchema } from "@shared/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ApiAuthResponse, AxiosErrorData } from "./Signup";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atom";
import CenterSpinner from "@/components/Spinner";
import { safeAwait } from "@/lib/utils";

const Signin: FC = () => {
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userState);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TloginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/today", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<TloginSchema> = async (data) => {
    const [err, response] = await safeAwait(
      apiClient.post<ApiAuthResponse>("api/auth/login", data)
    );
    if (err) {
      if (err instanceof AxiosError && err.response) {
        const error: AxiosErrorData = err;
        if (error.response?.data.errorCode === 1001) {
          setError("root", { message: "User not found" });
        } else if (error.response?.data.errorCode === 1003) {
          setError("password", { message: "Incorrect password" });
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
    if (response.status === 200) {
      navigate("/today");
    }
  };

  if (loading) {
    return <CenterSpinner />;
  }

  const handleOnclick = () => {
    setLoading(true);
    window.open("http://localhost:3000/api/auth/google", "_self");
  };

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
                <CardTitle className="font-bold text-3xl">Login</CardTitle>
                <CardDescription>
                  Enter your information to login
                </CardDescription>
              </CardHeader>
              <CardContent className=" flex flex-col gap-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        {...register("email")}
                        id="email"
                        placeholder="Enter your email"
                        type="email"
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
                        "Login"
                      )}
                    </Button>
                  </div>
                  {errors.root && (
                    <div className="text-red-500">{errors.root.message}</div>
                  )}
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleOnclick}
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
                <p>Don't have an account?</p>
                <Button variant="link" onClick={() => navigate("/signup")}>
                  Sign up
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
export default Signin;
