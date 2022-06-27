import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Typography from "components/Typography";
import styles from "./Chat.module.scss";
import Status from "./Status";
import Search from "./Search";
import Tabs from "./Tabs";
import Chats from "./Chats";
import classNames from "classnames";
import MessagesContainer from "./MessagesContainer";
import { db } from "../../firebase";

const Chat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [sendMessage, setSendMessage] = useState("");

  useEffect(() => {
    const chatRef = collection(db, "Chats");
    getDocs(chatRef)
      .then((res) => {
        const chats = res.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setChatList(chats);
      })
      .catch((e) => console.log("err", e));
  }, []);

  const handleSubmit = () => {
    console.log(
      "YOYO",
      sendMessage,
      JSON.parse(localStorage.getItem("WEIGH_T_CHOP__PER__USER"))
    );
    let currentUser = JSON.parse(
      localStorage.getItem("WEIGH_T_CHOP__PER__USER")
    );
    const chatRef = collection(db, "Chats");
    addDoc(chatRef, {
      msg: sendMessage,
      isMedia: false,
      senderId: currentUser.Id,
      recieverId: selectedChat?.senderId,
    }).then((res) => {
      console.log("ADD RES", res).catch((e) => console.log("err", e));
    });
  };

  const handleSendMessage = ({ target: { value } }) => {
    setSendMessage(value);
  };

  return (
    <>
      <Typography variant="body_bold" block className="mb-2">
        Chat
      </Typography>
      <div className={styles.content}>
        <div className={classNames(styles.left)}>
          <Status />
          <Search />
          <Tabs />
          <Chats chatList={chatList} setSelectedChat={setSelectedChat} />
        </div>
        <div className={styles.right}>
          <MessagesContainer
            chatList={chatList}
            selectedChat={selectedChat}
            sendMessage={sendMessage}
            handleSubmit={handleSubmit}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
