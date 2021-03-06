import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import styles from "./MessagesContainer.module.scss";
import Message from "./Message";
import Input from "./Input";
import Send from "icons/Send";
import Button from "components/Button";
import Typography from "components/Typography";
import { Indicator } from "../Chats/ChatCard";
import { SearchInput } from "components/Header";
import ContextAlt from "icons/ContextAlt";
import IconButton from "components/IconButton";
import Gear from "icons/Gear";

const MessagesContainer = ({
  chatList,
  selectedChat,
  handleSubmit,
  sendMessage,
  handleSendMessage,
}) => {
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  useEffect(() => {
    const msgList = chatList?.filter((chat) => {
      return (
        chat?.data?.senderId == selectedChat?.senderId ||
        (chat?.data?.senderId === "Diet Coach" &&
          chat?.data?.recieverId == selectedChat?.senderId)
      );
    });
    setMessages([...msgList]);
  }, [chatList, selectedChat]);

  return (
    <div>
      <div className={styles.top}>
        <div>
          <Typography className="mb-sm" variant="body_bold" block>
            Henry Smith
          </Typography>
          <Indicator /> <Typography variant="label">Active Now</Typography>
        </div>
        <div>
          <SearchInput />
          <IconButton>
            <ContextAlt />
          </IconButton>
          <IconButton>
            <Gear />
          </IconButton>
        </div>
      </div>
      <div className={styles.container_messages} ref={containerRef}>
        {messages?.map((msg) => {
          return msg.data.senderId === "Diet Coach" ? (
            <Message text={msg.data.msg} user={msg.data.senderId} reversed />
          ) : (
            <Message text={msg.data.msg} user={msg.data.senderId} />
          );
        })}
      </div>
      <div className={styles.bottom}>
        <Input value={sendMessage} handleInput={handleSendMessage} />{" "}
        <Button type="submit" onClick={handleSubmit}>
          Send <Send />{" "}
        </Button>
      </div>
    </div>
  );
};

export default MessagesContainer;
