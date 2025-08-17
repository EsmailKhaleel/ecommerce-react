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
        <div
          className={`absolute h-screen left-0 top-0 bg-white dark:bg-gray-900 transform transition-transform duration-500
          ${isMainDrawerOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <MobileNavBar />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/10 z-[999] backdrop-blur transition-all duration-500 ${isMainDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => dispatch(closeAllDrawers())}
      ></div>
    </>
  );
}

export default NanBar