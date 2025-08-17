import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeAllDrawers } from "../../StateManagement/Slices/DrawerSlice";

export const useNavHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    navigate(path);
    dispatch(closeAllDrawers());
  };

  return { handleNavigation };
};
