import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BiShoppingBag, BiUser } from "react-icons/bi";
import DarkMode from "./DarkMode";
import { useAuth } from "../../Context/useAuth";
import MenuList from "./MenuList";
import LanguageButton from "./LanguageButton";
import { useNavHandler } from "./useNavHandler";
import BurgerButton from "./BurgerButton";

function DesktopNavBar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const cart = useSelector((state) => state.cart.items);
  const { handleNavigation } = useNavHandler();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initials = (user?.name || user?.displayName || user?.email || "U").charAt(0).toUpperCase();

  useEffect(() => setAvatarFailed(false), [user?.image]);

  return (
    <header className="shop-header">
      <BurgerButton />
      <button className="shop-wordmark" onClick={() => handleNavigation("/")} aria-label={t("brand.name")}>
        <span>S</span><strong>ShopSphere</strong>
      </button>
      <nav aria-label="Primary navigation"><MenuList inDrawer={false} /></nav>
      <div className="shop-header-actions">
        <div className="shop-desktop-tools"><DarkMode /><LanguageButton /></div>
        <button className="shop-icon-button" onClick={() => handleNavigation("/account")} aria-label={t("navigation.account")}>
          {user?.image && !avatarFailed
            ? <img src={user.image} alt="" onError={() => setAvatarFailed(true)} />
            : user ? <span className="shop-avatar-initials">{initials}</span> : <BiUser />}
        </button>
        <button className="shop-icon-button" onClick={() => handleNavigation("/cart")} aria-label={`${t("navigation.cart")}${cart?.length ? `, ${cart.length} items` : ""}`}>
          <BiShoppingBag />
          {cart?.length > 0 && <span className="shop-cart-count">{cart.length}</span>}
        </button>
      </div>
    </header>
  );
}

export default DesktopNavBar;
