import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { LOGOUT } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();

  const removeCookie = async () => {
    try {
      const res = await axios.post(LOGOUT,{
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });

      console.log(res.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.current.emit("signout", userInfo.id);
    dispatch({ type: reducerCases.LOGOUT });
    signOut(firebaseAuth);
    removeCookie();
    router.push("/login");
  }, [socket]);
  return <div className="bg-conversation-panel-background w-full h-full"></div>;
}

export default logout;
