import React from 'react'
import Img1 from '../../assets/sale.png'
import Img2 from '../../assets/shopping.png'
import Img3 from '../../assets/women.png'
const ImageList = [
    {
        id:1,
        img:Img1,
        title:"50% off on all products sale",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
    {
        id:2,
        img:Img2,
        title:"70% off on all products sale",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
    {
        id:3,
        img:Img3,
        title:"30% off on all women wear",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
];

function Hero() {
    return (
      <div className="relative w-full max-w-[100vw] min-h-[400px] sm:min-h-[650px] bg-gray-300 overflow-hidden">
        <div className="h-[500px] w-[500px] bg-primary/40 absolute rotate-45 top-1 right-1 rounded-3xl z-9"></div>
      </div>
    );
  }
  

export default Hero