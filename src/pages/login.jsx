import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { document } from "postcss";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function login() {
  const router = useRouter(); // similar to useNavigate

  const [{ userInfo, newUser }, dispatch] = useStateProvider(); // equivalent to useReducer(reducer,initialState) = [state, dispatch]

  // if userInfo exists and user is not new redirect to homepage
  useEffect(() => {
    console.log(userInfo);
    if (userInfo?.id && !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    try {
      // from firebase
      const provider = new GoogleAuthProvider();
      const {
        user: { displayName: name, email, photoURL: profileImage },
      } = await signInWithPopup(firebaseAuth, provider);

      if (email) {
        // get user data from backend
        const { data } = await axios.post(
          CHECK_USER_ROUTE,
          { email },
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
        
        

        console.log(data.token);
        // if user is not registered, save the email id and redirect to onboarding
        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });

          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "",
            },
          });
          router.push("/onboarding");
        }
        // user is registered
        else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            status,
          } = data.data;

          console.log(data.data);

          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status,
            },
          });
        }
      }
    } catch (error) {
      router.push("/onboarding");
      console.log(error);
    }

    //console.log(user);
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-0">
      <div className="flex flex-col items-center justify-center gap-2 text-white mt-[1rem]">
        {/* <Image src="/whatsapp.gif" alt="Whatsapp" height={100} width={300} /> */}
        <span className="text-7xl">Whatsapp</span>
      </div>

      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-[50%] mt-[50px] hover:bg-[#f0f0f0] animate-pulse"
        onClick={handleLogin}
        title="Login with Google"
      >
        <FcGoogle className="text-7xl" />
        {/* <span className="text-white text-2xl"> Login with Google</span> */}
      </button>

      <a
        href="https://sandesh-yele-win2000.netlify.app/"
        className="opacity-80"
      >
        <Image
          className="mt-[5rem]"
          src="/chibiME.png"
          alt=""
          height={100}
          width={100}
        />
        Sandesh Yele
      </a>
    </div>
  );
}

export default login;
