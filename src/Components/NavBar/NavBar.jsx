import DesktopNavBar from './DesktopNavBar'
import MobileNavBar from './MobileNavBar';
import { useDispatch, useSelector } from 'react-redux';
import { closeAllDrawers } from '../../StateManagement/Slices/DrawerSlice';

function NanBar() {
  const { isMainDrawerOpen } = useSelector((state) => state.drawer);
  const dispatch = useDispatch();

  return (
    <>
      <div className="sticky top-0 z-[1000]">
        <DesktopNavBar />
      </div>
      <div
        className={`fixed top-0 left-0 right-0 sm:w-80 w-[280px] h-full z-[999] bg-white dark:bg-gray-900 transform transition-transform duration-500
          ${isMainDrawerOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <MobileNavBar />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/10 z-[998] backdrop-blur transition-all duration-500 ${isMainDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => dispatch(closeAllDrawers())}
      ></div>
    </>
  );
}

export default NanBar