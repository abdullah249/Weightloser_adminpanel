import React, { useState } from "react";
import styles from "./Chats.module.scss";
import Typography from "components/Typography";
import ChatCard from "./ChatCard";

const Chats = ({ chatList, setSelectedChat }) => {
  const [active, setActive] = useState(1);

  const handleChat = (index, data) => {
    setActive(index + 1);
    setSelectedChat(data);
  };

  return (
    <>
      <Typography variant="body_bold" block className="text-dark">
        Recent
      </Typography>
      <div className={styles.list}>
        {chatList?.map((m, index) => (
          <ChatCard
            onClick={() => handleChat(index, m.data)}
            active={active === index + 1}
            name={m.data.senderId}
            msg={m.data.msg}
          />
        ))}
      </div>
    </>
  );
};

export default Chats;
