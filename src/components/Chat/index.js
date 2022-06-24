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

    // let dummy = {
    //   msg: "Ameen Testimg",
    //   isMedia: false,
    //   senderId: 1,
    //   recieverId: 3,
    // };
    // addDoc(chatRef, {
    //   msg: dummy.msg,
    //   isMedia: dummy.isMedia,
    //   senderId: dummy.senderId,
    //   recieverId: dummy.recieverId,
    // }).then((res) => {
    //   console.log("ADD RES", res).catch((e) => console.log("err", e));
    // });
  }, []);

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
          <MessagesContainer chatList={chatList} selectedChat={selectedChat} />
        </div>
      </div>
    </>
  );
};

export default Chat;
