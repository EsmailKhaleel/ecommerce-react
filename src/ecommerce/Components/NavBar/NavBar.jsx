import React from 'react';
import UpperNanBar from './UpperNanBar';
import LowerNavBar from './LowerNavBar';


export const menu = [
  {
    id: 1,
    name: "Explore",
    link: "/",
  },
  {
    id: 6,
    name: "Products",
    link: "/products",
  },
  {
    id: 2,
    name: "Top Rated",
    link: "/services",
  },
  {
    id: 3,
    name: "Kids Wear",
    link: "/kidswear",
  },
  {
    id: 4,
    name: "Mens Wear",
    link: "/menswear",
  },
  {
    id: 5,
    name: "Electronics",
    link: "/electronics",
  },
  {
    id: 7,
    name: "Add Product",
    link: "/addProduct",
  },
];
export const dropDownLinks = [
  {
    id: 1,
    name: "Trending Products",
    link: "/trendigproducts",
  },
  {
    id: 2,
    name: "Best Selling",
    link: "/bestselling",
  },
  {
    id: 3,
    name: "Top Rated",
    link: "/toprated",
  },
];
function NavBar() {

  return (
    <div className='shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40'>
      <UpperNanBar />
      <LowerNavBar />
    </div>
  )
}

export default NavBar;