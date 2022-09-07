import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import './Button.css';

const SOCKET_URL_ONE = 'wss://echo.websocket.events';
const SOCKET_URL_TWO = 'wss://demos.kaazing.com/echo';
const READY_STATE_OPEN = 1;

//Generates the click handler, which returns a promise that resovles to the provided url.
const generateAsyncUrlGetter =
  (url, timeout = 2000) =>
  () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, timeout);
    });
  };

export const UseWebSocket = ({}) => {
  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [inputtedMessage, setInputtedMessage] = useState('');
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    currentSocketUrl,
    {
      share: true,
      shouldReconnect: () => false,
    }
  );

  useEffect(() => {
    lastMessage && setMessageHistory((prev) => prev.concat(lastMessage.data));
  }, [lastMessage]);

  const readyStateString = {
    0: '接続中', // CONNECTING
    1: 'オープン（入力可能）', // OPEN
    2: '切断中', // CLOSING
    3: 'クローズ', // CLOSED
  }[readyState];

  return (
    <div
      style={{
        background: '#FFF',
        marginTop: 50,
        padding: 15,
        width: '80vw',
        margin: `0 auto`,
        borderRadius: 5,
      }}
    >
      <p>送信した内容は、サーバからエコー送信されます</p>
      <div>
        <input
          type={'text'}
          value={inputtedMessage}
          onChange={(e) => setInputtedMessage(e.target.value)}
        />
        <button
          onClick={() => sendMessage(inputtedMessage)}
          disabled={readyState !== READY_STATE_OPEN}
          style={{ marginLeft: 15, marginBottom: 20 }}
        >
          送信
        </button>
      </div>
      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>
        ソケットサーバを選択
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '50%',
          margin: '0 auto',
        }}
      >
        <button
          onClick={() =>
            setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))
          }
          disabled={currentSocketUrl === SOCKET_URL_ONE}
          className="SelectButton"
        >
          {SOCKET_URL_ONE}
        </button>
        <button
          onClick={() =>
            setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_TWO))
          }
          disabled={currentSocketUrl === SOCKET_URL_TWO}
          className="SelectButton"
        >
          {SOCKET_URL_TWO}
        </button>
      </div>
      <div style={{ marginTop: 35 }}>
        <span style={{ fontWeight: 'bold' }}>接続状態：</span>
        {readyStateString}
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontWeight: 'bold' }}>メッセージ</div>
        {messageHistory.join(' ')}
      </div>
    </div>
  );
};
