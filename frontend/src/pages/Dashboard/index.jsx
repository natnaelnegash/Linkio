import { IoIosMore } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { useUserStore } from "../../lib/userStore";
import { auth, db } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
const Dashboard = () => {
  const [isUserAdded, setIsUserAdded] = useState();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState();
  const [chats, setChats] = useState([]);
  const [addmode, setAddmode] = useState(false);
  const chatRef = collection(db, "chats");
  const { currentUser, fetchUserData } = useUserStore();
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id)
      // async (res) => {
      //   const items = res.data().chats;
      //   const promisses = items.map(async (item) => {
      //     const userDocRef = doc(db, "users", item.recieverId);
      //     const userDocSnap = await getDocs(userDocRef);
      //     const user = userDocSnap.data();
      //     console.log(...item, user);
      //     return { ...item, user };
      //   });
      //   const chatData = await Promise.all(promisses);
      //   setChats(chatData);
      // }
    );
    return () => unSub();
  }, []);
  const handleLogout = () => {
    signOut(auth);
    fetchUserData();
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <div className="h-screen w-screen">
        <div className="grid-cols-3 flex h-full ">
          {/* Contacts */}
          <div className="flex flex-1/4 ">
            <div className="m-4 flex flex-col justify-between w-full">
              <div className="flex flex-col gap-6 flex-2/10 border-b-1 border-b-gray-500">
                <div className="flex">
                  <div className="flex w-full gap-5 justify-between items-center">
                    <div className="avatar avatar-online">
                      <div className="w-10 h-10 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                    <div className="text-2xl">{currentUser.username}</div>
                    <div className="flex justify-between gap-3">
                      <IoIosMore /> <IoVideocam /> <FaEdit />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full gap-5">
                  <label className="input">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </g>
                    </svg>
                    <input
                      type="search"
                      className="grow"
                      placeholder="Search"
                    />
                  </label>
                  {/* Open the modal using document.getElementById('ID').showModal() method */}
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    <FaPlusSquare />
                  </button>
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box w-2/4 h-2/5 flex">
                      <div className="modal-action w-full justify-normal items-center">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <div className="flex w-full h-full">
                          <form
                            onSubmit={handleSearch}
                            className="flex flex-col justify-between h-full w-full"
                          >
                            <div className="flex items-center flex-1/2 justify-between gap-3 w-full">
                              <label className="input flex w-full ">
                                <svg
                                  className="h-[1em] opacity-50"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                  </g>
                                </svg>
                                <input
                                  type="search"
                                  required
                                  placeholder="Search User"
                                  name="username"
                                />
                              </label>
                              <button className="btn">Search User</button>
                            </div>
                            {user && (
                              <div className="flex justify-between items-center flex-1/2">
                                <div className="flex items-center gap-5 flex-1">
                                  <div className="avatar">
                                    <div className="w-12 h-12 rounded-full">
                                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                  </div>
                                  {user.username}
                                </div>
                                <button onClick={handleAdd} className="btn">
                                  Add User
                                </button>
                              </div>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
              {/* Chats/Contacts */}
              <div className="flex-8/10 overflow-auto">
                {chats?.chats?.map((chat, index) => (
                  <div
                    key={index}
                    className="p-2 border-b-1 border-b-gray-500 flex gap-5 items-center"
                  >
                    <div className="avatar avatar-online">
                      <div className="w-10 h-10 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                    <div className="flex-col">
                      <div className="text-1xl">{user?.username}</div>
                      <p className="text-1xl text-gray-400">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
                {/* <div className="p-2 border-b-1 border-b-gray-500 flex gap-5 items-center">
                  <div className="avatar avatar-online">
                    <div className="w-10 h-10 rounded-full">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="text-1xl">John Doe</div>
                    <p className="text-1xl text-gray-400">Lorem ipsum</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {/* Chat */}
          <div className="flex flex-2/4 border-r-1 border-l-1 border-x-gray-500">
            <div className="m-4  flex flex-col justify-between w-full">
              <div className="flex border-b-1 border-b-gray-500 flex-1/10 pb-4">
                <div className="flex gap-5 items-center w-full">
                  <div className="flex justify-between w-full ">
                    <div className="flex-1/8">
                      <div className="avatar avatar-online">
                        <div className="w-14 h-14 rounded-full">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-6/8 flex-col">
                      <div className="text-2xl">John Doe</div>
                      <p className="text-1xl text-gray-400">
                        Lorem ipsum dolor sit, amet
                      </p>
                    </div>
                    <div className=" flex-1/8 items-center flex gap-3">
                      <IoMdCall />
                      <FaInfoCircle />
                      <IoVideocam />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-8/10 overflow-auto">
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    Obi-Wan Kenobi
                    <time className="text-xs opacity-50">12:45</time>
                  </div>
                  <div className="chat-bubble">You were the Chosen One!</div>
                  <div className="chat-footer opacity-50">Delivered</div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    Anakin
                    <time className="text-xs opacity-50">12:46</time>
                  </div>
                  <div className="chat-bubble">I hate you!</div>
                  <div className="chat-footer opacity-50">Seen at 12:46</div>
                </div>
              </div>
              <div className="flex flex-1/10 border-t-1 border-t-gray-500 pt-4">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex flex-1/8 gap-3">
                    <FaCamera />
                    <FaMicrophone />
                    <FaImage />
                  </div>
                  <input
                    type="text"
                    placeholder="Medium"
                    className="input input-md flex-6/8 "
                  />
                  <div className="flex items-center gap-3 flex-1/8">
                    <MdEmojiEmotions />
                    <button className="btn bg-blue-500">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Detail */}
          <div className="flex flex-1/4">
            <div className="m-4 flex flex-col w-full">
              <div className="items-center flex flex-1/6 justify-between gap-2 flex-col">
                <div className="avatar avatar-placeholder flex justify-center">
                  <div className="bg-neutral border-1 text-neutral-content w-34 rounded-full">
                    <span className="text-4xl">D</span>
                  </div>
                </div>
                <h2 className="text-2xl">John Doe</h2>
                <h2 className="text-1xl ">Lorem, ipsum dolor</h2>
              </div>
              <div className="flex flex-4/6 flex-col overflow-auto">
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title font-semibold">
                    Chat Settings
                  </div>
                  <div className="collapse-content text-sm">Details</div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title font-semibold">
                    Privacy & Help
                  </div>
                  <div className="collapse-content text-sm">Details</div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title font-semibold">
                    Shared Photos
                  </div>
                  <div className="collapse-content text-sm">Details</div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title font-semibold">
                    Shared Files
                  </div>
                  <div className="collapse-content text-sm">Details</div>
                </div>
              </div>
              <div className="flex flex-1/6 flex-col py-2 border-t-1 border-t-gray-500 gap-2">
                <button className="btn btn-error">Error</button>
                <button onClick={handleLogout} className="btn btn-info">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
