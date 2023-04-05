import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import Close from "icons/Close";
import { NAV_ITEMS } from "./navItems";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Notifications from "../Notifications";

const NavItem = ({ icon, text, href, active, ...rest }) => {
  return (
    <Link to={href || "#"}>
      <div
        {...rest}
        className={classNames(
          styles.nav_item,
          `${active ? styles.active : ""}`
        )}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.text}>{text}</span>
      </div>
    </Link>
  );
};

const alias= {
  Email: "Send Email",
  Notification: "Send Push",
}
let notificationType = ""
const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  onSheduleOpen = () => {},
}) => {
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user) {
      try {
        let roles = user.Roles ? JSON.parse(user.Roles) : {};
        roles = [...Object.keys(roles), 'Email', 'Notification'];
        setItems(NAV_ITEMS.filter((m) => m.public || roles.includes(m.title)));
      } catch (ex) {}
    }
  }, [user, navigate]);

  useEffect(() => {
    const {hash} = location;
    notificationType = hash.substring(1);
    ["email", "push"].includes(notificationType) ? setIsOpen(true) : setIsOpen(false)
  }, [location])

  const closeHandler = () => {
    setIsOpen(!isOpen);
    navigate(location.pathname)
  }

  return (
    <div
      className={classNames(
        styles.container_main,
        `${isSidebarOpen ? styles.open : styles.closed}`
      )}
    >
      <Close className={styles.icon_close} clickable onClick={toggleSidebar} />
      <div className={styles.menu_header}>MENU</div>
      <div className={styles.menu}>
        {/* <div className={styles.for_mobile}>
          <div className={styles.search}>
            <SearchInput />
          </div>
        </div> */}
        {items.map((m) => (
          <NavItem
            key={m.title}
            text={alias[m.title] || m.title}
            href={m.href}
            active={m.href && m.href === location.pathname}
            icon={m.icon}
          />
        ))}
        {/* <div className={styles.for_mobile}>
          <NavItem href="#" text="Settings" onClick={onSheduleOpen} />
          <NavItem href="#" text="Logout" />
        </div> */}
      </div>
      <Notifications isOpen={isOpen} setIsOpen={closeHandler} type={notificationType} />
    </div>
  );
};

export default Sidebar;
