import React, { useState, useEffect } from "react";
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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const msgList = chatList?.filter((chat) => {
      return chat?.data?.senderId == selectedChat?.senderId;
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
      <div className={styles.container_messages}>
        {messages?.map((msg) => (
          <Message text={msg.data.msg} user={msg.data.senderId} />
        ))}
        {/* <Message text="Some text in the." user="Henry Smith" />
        <Message text="Some text in the chat lorum." user="Henry Smith" />
        <Message
          text="Lorum Ipsum some text in chat  that shows chat  going on"
          user="Steven Franklin"
          reversed
        />
        <Message text="Some text in the." user="Henry Smith" />
        <Message text="Some text in the chat lorum." user="Henry Smith" /> */}
      </div>
      <div className={styles.bottom}>
        <Input value={sendMessage} handleInput={handleSendMessage} />{" "}
        <Button type="submit" handleSubmit={handleSubmit}>
          Send <Send />{" "}
        </Button>
      </div>
    </div>
  );
};

export default MessagesContainer;
