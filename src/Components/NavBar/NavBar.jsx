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