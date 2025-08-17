import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleProfileDrawer } from "../../StateManagement/Slices/DrawerSlice";
import { mainNavItemsStyle } from "./navStyles";
import { useTranslation } from "react-i18next";
import getMenuItems from "./getMenuItems";
import { useNavHandler } from "./useNavHandler";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function MenuList({ inDrawer = false }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const menu = getMenuItems(t);
    const { handleNavigation } = useNavHandler();

    const handleLinkClick = (event, link) => {
        event.preventDefault();
        handleNavigation(link);
    };

    return (
        <ul className={inDrawer ? "mt-12 space-y-6" : "sm:flex hidden items-center gap-4"}>
            {menu.map(data => {
                if (!inDrawer && data.link === '/account') return null;
                return (<li
                    key={data.id}
                    className={` ${inDrawer ? "w-full" : "flex items-center"}`}
                >
                    {data.link === '/account' ?
                        <button
                            className="group flex items-center justify-between text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white w-full text-left text-gray-700 dark:text-gray-200 cursor-pointer"
                            onClick={() => dispatch(toggleProfileDrawer())}
                        >
                            {data.name}
                            <MdOutlineKeyboardArrowRight className="inline-block ml-2 text-lg transition-all duration-200 group-hover:bg-primary group-hover:text-white text-primary bg-white" />
                        </button>
                        :
                        <NavLink
                            to={data.link}
                            className={({ isActive }) => inDrawer ?
                                `block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ${mainNavItemsStyle(isActive, true)}` :
                                `${mainNavItemsStyle(isActive)}`}
                            onClick={(event) => handleLinkClick(event, data.link)}
                        >
                            {data.name}
                        </NavLink>
                    }
                </li>)
            })}
        </ul>
    )
}

export default MenuList