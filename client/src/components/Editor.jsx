import React from "react";
import { io } from "socket.io-client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Quill from "quill";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  
  const {id} = useParams() ;


  // initialise quill editor
  useEffect(() => {
    const quillServer = new Quill("#container", {theme: "snow", modules: { toolbar: toolbarOptions} });
    quillServer.disable() ;
    quillServer.setText(`Loading the document with id : ${id}`)
    setQuill(quillServer);
  }, []);

  // initialise socket server
  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    setSocket(socketServer);
    return () => {
      socketServer.disconnect();
    };
  }, []);

  // handling and sending changes to backend/server made by user
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;
      socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", handleChange);

    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [socket, quill]);

  // handling changes send by backend/server 
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta) => {
      quill.updateContents(delta) ;
    };

    socket && socket.on("receive-changes", handleChange);

    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [socket, quill]);


  useEffect(()=>{
    if(quill === null || socket === null) return ;

    socket && socket.once('load-document' ,(document) =>{
      quill && quill.setContents(document) ;
      quill && quill.enable() ;
    })

    socket && socket.emit('get-document' ,id) ; 

  },[socket ,quill ,id])



  return (
    <div style={{ background: "#f5f5f5" }}>
      <div
        style={{
          minHeight: "100vh",
          width: "70%",
          background: "#FFF",
          margin: "10px auto 10px auto",
          border: "1px #999999 solid",
          borderRadius: "5px",
        }}
        id="container"
      ></div>
    </div>
  );
};

export default Editor;
