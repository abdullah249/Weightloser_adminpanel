import Calendar from "icons/Calendar";
import Home from "icons/Home";
import Chat from "icons/Chat";
import Person from "icons/Person";
import {Bell, Send} from 'react-feather'

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home />,
    public: true,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: <Chat />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Person />,
  },
  {
    title: "Diet",
    href: "/diets",
  },
  {
    title: "Restaurants",
    href: "/restaurants",
  },
  {
    title: "Exercise",
    href: "/exercises",
  },
  {
    title: "Mind",
    href: "/mind",
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
  {
    title: "Coupons",
    href: "/coupons",
  },
  {
    title: "Staff",
    href: "/staff",
  },
  {
    title: "Email",
    href: "#email",
    icon: <Send size="small" color="#797A7A" fontVariant="outlined" />
  },
  {
    title: "Notification",
    href: "#push",
    icon: <Bell size="small" color="#797A7A" fontVariant="outlined" />
  },
];
