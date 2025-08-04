import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ToDoList = () => {
    const url = 'https://to-do-list-backend-yoq7.onrender.com'
    const [title, setTitle] = useState("");
    const [descrition, setDescription] = useState("");
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [EditDescrition, setEditDescription] = useState("");

 let count = data.length;
    const submitHandling = async (e) => {
        e.preventDefault();
        if (title.trim() != '' && descrition.trim() != '') {
            try {
                const response = await axios.post(`${url}/todos`, {
                    "title": title,
                    "description": descrition
                })
                console.log(response.data);
                setTitle("");
                setDescription("");
                toast.success("To Do Added Successfully");

                listToDo();
            } catch (error) {
                console.log(error);
            }

        }


    }

    const listToDo = async () => {
        try {
            const response = await axios.get(`${url}/todos`)
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        listToDo();
    }, [])


    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }
    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`${url}/update-todo/${id}`,{
                "title":editTitle,
                "description":EditDescrition
            })
             console.log(response.data);
             toast.success("To Do Update Successfully");
              listToDo();
              setEditId(-1);
        } catch (error) {
            
        }
    }
    const handleUpdateStatus = async (id) => {
        try {
            const response = await axios.put(`${url}/update-status-todo/${id}`,{
                "complete":true
            })
             toast.success("Task Completed Successfully");
              listToDo();
              setEditId(-1);
           
        } catch (error) {
            
        }
    }

        const handleUpdateStatusreverse = async (id) => {
        try {
            const response = await axios.put(`${url}/update-status-todo/${id}`,{
                "complete":false
            })
             toast.success("Task Not Complet");
              listToDo();
              setEditId(-1);
   
        } catch (error) {
            
        }
    }



    const handleEditCancel = () => {
        setEditId(-1);
    }
    const handleDelete = async (id)=>{
        try {
            const response = await axios.delete(`${url}/delete-todo/${id}`)
             toast.success("To Do delete Successfully");
              listToDo();
        } catch (error) {
            
        }
    }
   
    return (
        <>

            <div className=' mt-5'>
                <form action="" className=' flex flex-col md:flex-row gap-2 justify-between '>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" id="title" className=' w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Title ' />
                    <input value={descrition} onChange={(e) => setDescription(e.target.value)} type="text" name="description" id="description" className='w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Description' />
                    <button onClick={submitHandling} className=' bg-black px-5 py-1 rounded cursor-pointer'>Add</button>
                </form>
            </div>
            <div className=' mt-5  '>
                <div className=' flex justify-between px-2'>
                     <h1 className='mb-3'>Today Task</h1>
                     <p>count : {data.filter((item) => !item.complete).length}</p>
                </div>
                <div className=''>
                    {
                    data.map((item, index) =>  (
                        !item.complete && <div key={index} className='bg-black mb-2 px-5 py-1 flex flex-col md:flex-row justify-between md:items-center rounded'>
                            <div>
                                {
                                    editId == -1 || editId !== item._id ? <>
                                        <p>{item.title}</p>
                                        <p className=' text-gray-500 text-sm font-light'>{item.description}</p>
                                    </> :
                                        <>
                                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} type="text" className=' w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Title ' />
                                            <input value={EditDescrition} onChange={(e) => setEditDescription(e.target.value)} type="text" className='w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Description' />
                                        </>
                                }

                            </div>
                            <div className='flex my-2 md:mt-0 gap-2 md:items-center'>
                              
                                <div className='flex   gap-2 items-center'>
                                    {editId == -1 || editId !== item._id ? <i onClick={() => handleEdit(item)} className='bx bxs-edit cursor-pointer' ></i> : <i onClick={()=>handleUpdate(item._id)} className='bx bxs-save' ></i>}
                                    {editId == -1 || editId !== item._id ? <i onClick={()=> handleDelete(item._id)} className='bx bxs-trash-alt cursor-pointer'></i> :
                                        <i onClick={handleEditCancel} className='bx bx-x cursor-pointer'></i>}
                                        </div>
                                <button onClick={()=>handleUpdateStatus(item._id)} className=' cursor-pointer bg-green-600 px-5 py-1 h-fit rounded'>complete</button>
                            </div>

                        </div>
                    ))
                }
                </div>
                
            </div>

            <div className='mt-5'>
                <h1 className=' mb-3 px-2'>Completed tasks</h1>
                <div className=''>
                    {
                    data.map((item, index) =>  (
                        item.complete && <div key={index} className='bg-black mb-2 px-5 py-1 flex flex-col md:flex-row justify-between  md:items-center rounded'>
                            <div>
                                {
                                    editId == -1 || editId !== item._id ? <>
                                        <p>{item.title}</p>
                                        <p className=' text-gray-500 text-sm font-light'>{item.description}</p>
                                    </> :
                                        <>
                                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} type="text" className=' w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Title ' />
                                            <input value={EditDescrition} onChange={(e) => setEditDescription(e.target.value)} type="text" className='w-full py-1 px-5 rounded border border-black/45 outline-0' placeholder='Description' />
                                        </>
                                }

                            </div>
                            <div className='flex   gap-2 items-center'>
                                
                                <button onClick={()=>handleUpdateStatusreverse(item._id)} className=' cursor-pointer bg-gray-600 px-5 my-1 py-1 h-fit rounded'>Done 👍</button>
                            </div>

                        </div>
                    ))
                }
                </div>
                
            </div>

        </>
    )
}

export default ToDoList
