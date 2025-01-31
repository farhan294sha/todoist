import { tokenState, userState } from "@/store/atom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "./ui/button";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "./ui/toast";
import apiClient from "@/lib/apiClient";
import { safeAwait } from "@/lib/utils";
import { getShortName } from "@/utils/utils";

const UserProfile = () => {
  const user = useRecoilValue(userState);
  const result = getShortName(user)


  return (
    <Button variant="ghost" size="sm" className="p-0" asChild>
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage className="w-5 h-5 rounded-full" src={user?.picture} />
          <AvatarFallback>{result?.shortName}</AvatarFallback>
        </Avatar>
        <div className="flex gap-1">
          <div>{result?.firstName}</div>
          <ChevronDown className="text-muted-foreground" size={16} />
        </div>
      </div>
    </Button>
  );
};

const Dropdownprofile = () => {
  const setToken = useSetRecoilState(tokenState);
  const setUser = useSetRecoilState(userState);
  const { toast } = useToast();
  const navigate = useNavigate();
  async function handleOnClick() {
    const [err, _] = await safeAwait(apiClient.get("api/auth/logout"));
    if (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-left ">
        <UserProfile />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleOnClick}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { Dropdownprofile, UserProfile };
