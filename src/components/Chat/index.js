import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import Typography from "components/Typography";
import styles from "./Chat.module.scss";
import Status from "./Status";
import Search from "./Search";
import Tabs from "./Tabs";
import Chats from "./Chats";
import classNames from "classnames";
import MessagesContainer from "./MessagesContainer";
import { db } from "../../firebase";
import { onlyNumbers } from "utils/containOnlyNumber";
import { fetchMsgs } from "redux/reducers/firebase.reducer";

const Chat = (props) => {
  const chatRef = collection(db, "Chats");
  const dispatch = useDispatch();
  const getMsgs = useSelector((state) => state.fireB.allMsgs);
  const filterMsgs = useSelector((state) => state.fireB.filteredList);
  const [selectedChat, setSelectedChat] = useState();
  const [sendMessage, setSendMessage] = useState("");

  let prevMsgsRef = useRef();
  useEffect(() => {
    if (getMsgs) {
      console.log("chatsss", getMsgs);
      prevMsgsRef.current = getMsgs;
    }
  }, [getMsgs]);

  useEffect(() => {
    // if (prevMsgsRef.current == getMsgs)
    //   console.log("LOG", prevMsgsRef.current, getMsgs);
    // return () => {}
    dispatch(fetchMsgs());
  }, []);

  // const containOnlyNumbers = (arr) => {
  //   let output = arr.map((obj) => {
  //     let senderId = obj.data?.senderId;
  //     if (onlyNumbers(senderId)) {
  //       return (senderId = Number(senderId));
  //     }
  //   });
  //   return output;
  // };

  const handleSubmit = () => {
    const chatRef = collection(db, "Chats");
    addDoc(chatRef, {
      msg: sendMessage,
      isMedia: false,
      senderId: "Diet Coach",
      recieverId: selectedChat?.senderId,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log("err", e));
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
          <Chats chatList={filterMsgs} setSelectedChat={setSelectedChat} />
        </div>
        <div className={styles.right}>
          <MessagesContainer
            chatList={getMsgs}
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
