import { useDispatch, useSelector } from "react-redux";
import { toggleMainDrawer } from "../../StateManagement/Slices/DrawerSlice";

function BurgerButton() {
  const { isMainDrawerOpen } = useSelector((state) => state.drawer);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleMainDrawer())}
      aria-label="Toggle menu"
      aria-expanded={isMainDrawerOpen}
      className="sm:hidden relative w-10 h-10"
    >
      {/* Top bar */}
      <span
        className={[
          "absolute left-1/2 w-6 h-[3px] rounded-sm bg-gray-800 dark:bg-white",
          "origin-center transition-all duration-300 ease-in-out",
          isMainDrawerOpen
            ? "top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"
            : "top-3 -translate-x-1/2"
        ].join(" ")}
      />
      {/* Middle bar */}
      <span
        className={[
          "absolute left-1/2 w-6 h-[3px] rounded-sm bg-gray-800 dark:bg-white",
          "origin-center transition-all duration-200 ease-in-out",
          isMainDrawerOpen
            ? "top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
            : "top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"
        ].join(" ")}
      />
      {/* Bottom bar */}
      <span
        className={[
          "absolute left-1/2 w-6 h-[3px] rounded-sm bg-gray-800 dark:bg-white",
          "origin-center transition-all duration-300 ease-in-out",
          isMainDrawerOpen
            ? "top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"
            : "bottom-3 -translate-x-1/2"
        ].join(" ")}
      />
    </button>
  );
}

export default BurgerButton;
