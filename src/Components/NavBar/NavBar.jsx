import UpperNanBar from './UpperNanBar';
import LowerNavBar from './LowerNavBar';

function NavBar() {
  return (
    <div className='shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40'>
      <UpperNanBar />
      <LowerNavBar />
    </div>
  )
}

export default NavBar;

export const menu = [
  // {
  //   id: 1,
  //   name: "Home",
  //   link: "/",
  // }, 
  {
    id: 2,
    name: "Explore",
    link: "/",
  }, {
    id: 3,
    name: "Products",
    link: "/products",
  }, {
    id: 4,
    name: "Add Product",
    link: "/addProduct",
  }, {
    id: 5,
    name: "My Wishlist",
    link: "/wishlist",
  }];