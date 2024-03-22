import Image from "next/image";
import React from "react";
import {IoClose, IoMdClose} from 'react-icons/io'


const images = [
  '/avatars/1.png',
  '/avatars/2.png',
  '/avatars/3.png',
  '/avatars/4.png',
  '/avatars/5.png',
  '/avatars/6.png',
  '/avatars/7.png',
  '/avatars/8.png',
  '/avatars/9.png',
]

function PhotoLibrary({setPhoto, hidePhotoLibrary}) {

  return <div className="fixed flex top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full justify-center items-center">
     <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
      <div className="pt-2 pe-2 cursor-pointer flex items-end justify-end" onClick={()=>hidePhotoLibrary(false)}>
         <IoMdClose className="h-10 w-10 cursor-pointer" />
      </div>
      <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 w-full">
          {
            images.map((image, index)=>
            <div 
              onClick={()=>{
                setPhoto(images[index]); 
                hidePhotoLibrary(false)
              }}
            >
              <div className="h-13 w-13 cursor-pointer relative">
                <Image src={image} alt="avatar" width={100} height={100}/>
              </div>
            </div>)
          }
      </div>
     </div>
  </div>
}

export default PhotoLibrary;
