import { useState } from "react";
import axios from "axios";
import Link from 'next/link';
import styles from "@/styles/Home.module.css";
import Channels from "../../index"
import { getAllChannels, getAllMessages } from "@/database";

function wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, seconds * 1000)
    })
}

export default function Channel({channels, channelId, messages: initialMessages}) {

    const [userName, setUserName] = useState('')
    const [text, setText] = useState('')
    const [messages, setMessages] = useState(initialMessages)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('submit', userName, text)
        // Send to the database (POST)

        const result = await axios.post(`/api/channels/${channelId}/messages`, {
            userName, text
        })
        const newMessage = result.data

        setMessages([...messages, newMessage])
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.section_iconBar}></div>

        <div  className={styles.section_server_channel}>
          <div  className={styles.server}>
            <h2 className={styles.server_header}>
              Sever header Here
            </h2>
            <div className={styles.server_content}>

            <div>
              <ul>
                  {channels.map((channel) => (
                      <li key={channel.id}>
                        <Link href={`/channels/${channel.id}`}>{channel.name}</Link>
                      </li>
                  ))}
              </ul>
            </div>

            </div>
          </div>

          <div className={styles.channel}>
            <h2 className={styles.channel_header}>
              Channel {channelId}
            </h2>

            <div className={styles.channel_content}>
              <div className={styles.channel_display}>
                {messages.map((message) => (
                  <div
                    className={styles.channel_outputBox}
                    key={message.id}>
                    <p>{message.text}</p>
                    <p>{message.userName}</p>
                  </div>
                ))}
              </div>
              <form
                className={styles.channel_form}
                onSubmit={handleSubmit}>
                  <input
                    className={styles.channel_input}
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                  <input
                    className={styles.channel_input}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    />
                  <button
                    className={styles.channel_btn}
                    type="submit">Send</button>
              </form>
            </div>

            <div className={styles.status_content}>
            </div>

          </div>{/* section_server_channel */}
        </div>
      </div>
    )
}

export async function getServerSideProps(context) {
    const channels = await getAllChannels();
    // This is always server side
    // From the server, we can connect to the database
    const channelId = context.query.channelId
    const messages = await getAllMessages(channelId)
    return {
        props: {
            channels: JSON.parse(JSON.stringify(channels)),
            channelId,
            messages: JSON.parse(JSON.stringify(messages))
        }
    }
}
