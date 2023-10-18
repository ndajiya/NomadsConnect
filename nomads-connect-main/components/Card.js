import { useContext, useState } from 'react'
import { NomadsContext } from '../context/NomadsContext'
import { SiTinder } from 'react-icons/si'
import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import NomadsCardItem from './NomadsCardItem'
import { useEffect } from 'react'
import {Moralis} from 'moralis'
import Chat from './Chat'
import { useMemo } from 'react'
import { useMoralis } from 'react-moralis'
import { client } from "../lib/sanity"

const style = {
  wrapper: `h-[45rem] w-[27rem] flex flex-col rounded-lg overflow-hidden`,
  cardMain: `w-full flex-1 relative flex flex-col justify-center items-center bg-blue-100`,
  noMoreWrapper: `flex flex-col justify-center items-center absolute`,
  tinderLogo: `text-5xl text-red-500 mb-4`,
  noMoreText: `text-xl text-white`,
  swipesContainer: `w-full h-full overflow-hidden`,
  chatMain:`w-full flex-1 relative flex flex-col bg-blue-100`,
  userRegister : `w-full flex-1 relative flex flex-col bg-blue-100`,
  btn: `bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 mt-5`
}

const Card = () => {
  const {user,isAuthenticated} = useMoralis()
  const { currentAccount, cardsData ,userRegister,requestToCreateUserProfile} = useContext(NomadsContext)
  const [chat,setChat] = useState(false);
  const [group,setGroup] =useState(true);
  const [chatId,setChatId] = useState(null);
  const [imageAsset, setImageAsset] = useState();

  
  useEffect(()=>{
      Moralis.initialize("pzWwcygf5CVZ2MA3XEgqxq8snizI54n4pyozkwHU");
      Moralis.serverURL = "https://g7ywhu8ocsfc.usemoralis.com:2053/server";
      if(chat && group){
        getGroupChats();
      }
  },[chat])
  
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0]
    client.assets
      .upload("image", selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name,
      })
      .then((document) => {
        setImageAsset(document)
      })
      .catch((error) => {
        console.log("Upload failed:", error.message)
      })
  }
  
  function displayChat(){
    if(chat && !group){
      return(
        <div className={style.chatMain}>
          <Chat chatId={chatId}/>
        </div>
      )
    }
    else if(chat && group){
      return (
        <div className={style.chatMain}>
          <h1 className='mt-5 ml-5 text-2xl'>Chat groups : </h1>
          <div className="pl-12 pt-2" id="chatRooms">
            <ul className="list-disc" id="roomList">
            </ul>
          </div>
        </div>
      )
    }
    else if(!isAuthenticated){
      return(
        <div className={style.cardMain}>
          Connect your wallet
        </div>
      )
    }
    else if(!userRegister && isAuthenticated){
      return(
        <div className={style.userRegister}>
        <form className='flex flex-col p-10 space-y-2'>
          <label htmlFor="name">Name :</label>
          <input type="text" id="name" className="name w-3/4 rounded"/>
          <label>
          <div >
              <p className="text-lg">Click to upload</p>
          </div>
          <input
            type="file"
            name="upload-image"
            onChange={uploadImage}
          />
          </label>
          <input className={style.btn} type="button" value="Submit" onClick={()=>{requestToCreateUserProfile(currentAccount,document.getElementById("name").value,imageAsset)}}/>
        </form>
      </div>
      )
    }
    else{
      return (<div className={style.cardMain}>
          <div className={style.noMoreWrapper}>
            <SiTinder className={style.tinderLogo} />
            <div className={style.noMoreText}>
              No More Profiles in your Location...
            </div>
          </div>
          <div className={style.swipesContainer}>
            {cardsData.map((card, index) => (
              <NomadsCardItem card={card} key={index} />
            ))}
          </div>
      </div>)
    }
  }
  function openChat(id){
    console.log("hii")
    setChatId(id);
    setGroup(false)
  }
  async function getGroupChats(){
    const Chats = Moralis.Object.extend("Chats");
    const ownerquery = new Moralis.Query(Chats);
    ownerquery.equalTo("owner",user.get("ethAddress"));
    const matcherquery = new Moralis.Query(Chats);
    matcherquery.equalTo("matcher",user.get("ethAddress"));
    const query = Moralis.Query.or(ownerquery,matcherquery)
    const results = await query.find();
    console.log(results.length)
    const roomList = document.getElementById("roomList");

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var ele =  document.createElement('input');
      ele.type="button";
      ele.value=object.get('title')
      ele.onclick= function(){
        openChat(object.id);
      }
      var listItem = document.createElement('li');
      listItem.append(ele);
      roomList.appendChild(listItem);
    }

}
  return (
    <div className={style.wrapper}>
      <CardHeader />
      {
        displayChat()
      }
      <CardFooter setChat={setChat}/>
    </div>
  )
}

export default Card
