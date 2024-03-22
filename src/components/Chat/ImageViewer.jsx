import { HOST } from "@/utils/ApiRoutes";
import Image from "next/image";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { GrNext, GrPrevious } from "react-icons/gr";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ImageViewer = ({ messages, setVI }) => {
  const arr = messages.filter((msg) => msg.type === "image");

  console.log(arr);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index + 1 <= arr.length - 1) {
      console.log(arr[index]);

      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index - 1 >= 0) {
      console.log(arr[index], index);
      setIndex(index - 1);
    }
  };

  return (
    <div className="flex items-center flex-col py-[5rem]">
      <div className="flex w-full">
        <button className="w-[50px] h-[50px] rounded-[50%] left-[93%] flex items-center justify-center relative hover:bg-slate-700" onClick={()=> setVI(false)}> <RxCross1 size={"1rem"} color={"white"}/> </button>
      </div>

      <div className="flex items-center">
        <button
          className="w-[50px] h-[100px]  hover:bg-slate-700 flex items-center justify-center" 
          onClick={handlePrev}
        >
        <GrPrevious size={"2rem"} color={"white"} />
        </button>
        <div className=" z-10 relative top-[30px] min-w-[700px] min-h-[400px] mr-2">
          <div className="">
            <Image
              src={`${HOST}/${arr[index].message}`}
              className="rounded-lg "
              alt="asset"
              fill
            />
          </div>
        </div>
        <button
          className="w-[50px] h-[100px]  hover:bg-slate-700 flex items-center justify-center"
          onClick={handleNext}
        >
          <GrNext size={"2rem"} color={"white"}/>
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
