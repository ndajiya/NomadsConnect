import { useEffect, useState ,useContext} from "react";
import {Moralis,user} from "moralis"
import {NomadsContext} from "../context/NomadsContext";
export default function Chat(props){
    const [chatId,setChatId] = useState(null);
    const {currentUser} = useContext(NomadsContext);
    useEffect(()=>{
      Moralis.initialize("pzWwcygf5CVZ2MA3XEgqxq8snizI54n4pyozkwHU");
      Moralis.serverURL = "https://g7ywhu8ocsfc.usemoralis.com:2053/server";
        setChatId(props.chatId)
        init()
        getHistory()
    },[chatId])
    async function init(){
        let query = new Moralis.Query('Message');
        let subscription = await query.subscribe();

        const historyList = document.getElementById("historyList");

        subscription.on('create', (object) => {
          if(object.get("group") == chatId){
            var listItem = document.createElement('li');
            listItem.innerHTML = currentUser.name + " says:<br>"+object.get("text")+"<br>"
            historyList.appendChild(listItem);
          }
        });
      }

    async function getHistory(){
        
        const Message = Moralis.Object.extend("Message");
        const query = new Moralis.Query(Message);

        query.equalTo("group",chatId)
        const results = await query.find();

        const historyList = document.getElementById("historyList");


        for (let i = 0; i < results.length; i++) {
          const object = results[i];
          var listItem = document.createElement('li');
          console.log(object.get("sender"))
          listItem.innerHTML = object.get("sender") + " says: <br>"+object.get("text")+"<br>"
          historyList.appendChild(listItem);
        }

    }

      

    async function sendMessage(){
        let user = Moralis.User.current();
        let message =  document.getElementById("chatInput").value;
        if(message && message.length>0){
          const Message = Moralis.Object.extend("Message");
          const m = new Message();
          m.set("sender",currentUser.name)
          m.set("text",message)
          m.set("group",chatId)
          m.save()
        }
    }

    return (
        <div> 
            <p className="ml-2 font-bold mt-2">CHAT</p>
            <div id="chatHistory" className="mt-2 ml-2">
            <ul id="historyList"></ul>
            </div>
            <div className="absolute bottom-4 ">
              <input type="text" id="chatInput" className="border-solid h-10 w-72 ml-2 rounded" placeholder="Enter text"/>
              <input type="button" className = "bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded" value="Send Message" id="sendButton" onClick={sendMessage}/>
            </div>

        </div>
    )
}