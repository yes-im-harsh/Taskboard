// /* eslint-disable react/prop-types */
// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase';
// import Loader from '../Loader/Loader';
// import Task from '../Task/Task';
// import TaskInput from '../TaskInput/TaskInput';
// import './TaskList.css';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import Popup from 'reactjs-popup';
// import { MdDelete } from 'react-icons/md';
// import { deleteDoc, doc } from 'firebase/firestore';

// const TaskList = (props) => {
//     const [task, setTask] = useState([]);
//     const [isTask, setIsTask] = useState(false);
//     const [isTaskLoading, setTaskLoading] = useState(true);

    

//     useEffect(() => {
//         const list = [];
//         const GetAllTask = async () => {
//             const q = query(collection(db, 'Task'), where('tasklist_id', '==', props.taskList.id));
//             onSnapshot(q, (querySnapshot) => {
//                 querySnapshot.docs.map((doc) => (
//                     list.push({ id: doc.id, ...doc.data() })
//                 ));
                
//                 setTask(list.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1));
//                 console.log(task);
//                 setTaskLoading(false);
//             });
            
//             setIsTask(true);
//         };
        
//         if(isTask === false) GetAllTask();
//     }, [setTask, setTaskLoading, setIsTask]);

//     const DeleteTask = async (id) => {
//         await deleteDoc(doc(db, 'TaskList', id));
//         console.log(task);
//         const updatedTask = await task.filter((task) => task.id !== id);
//         console.log('Before setTask:'  ,updatedTask);
//         setTask(updatedTask);
//         console.log('After setTask: ' ,updatedTask);
//     };

//     return (
//         <div className='tasklist__container'>
//             {/* TODO: tasklist header */}
//             <div className="tasklist__header">
//                 <div className='tasklist__header__name'>
//                     <span>{props.taskList.tasklist_name}</span>
//                     <Popup
//                         trigger={
//                             <div className="task__options">
//                                 <BsThreeDotsVertical />
//                             </div>
//                         }
//                         position="right top"
//                         on="click"
//                         closeOnDocumentClick
//                         mouseLeaveDelay={300}
//                         mouseEnterDelay={0}
//                         contentStyle={{ padding: '0px', border: 'none' }}
//                         arrowStyle={{ color: '#3A3C45' }}
//                         arrow={true}
//                     >
//                         <MenuOptions id = {props.taskList.id} setTask={setTask}  task={task} onDelete={() => DeleteTask(props.taskList.id)}/>
//                     </Popup>
//                 </div>
//             </div>

//             {/* add task here */}
//             <div className="tasklist__tasks">
//                 { isTaskLoading ? <Loader /> : <>
//                     <TaskInput tasklist_id={props.taskList.id} />
//                     {
//                         task?.map((item, index) => {
//                             return <div key={index}>
//                                 <Task task={item} />
//                             </div>;
//                         })
//                     }
//                 </>}
//             </div>

//         </div>
//     );
// };

// const MenuOptions = ({ onDelete}) => {
    
//     return (
//         <div className="menu">
//             <div className="menu-item"
//                 onClick={() => onDelete()}
//             > 
//                 <MdDelete className='menu-icon'  />
//                 Delete 
//             </div>
//         </div>
//     );
// };

// export default TaskList;

/* eslint-disable react/prop-types */
import { collection,  query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import Loader from '../Loader/Loader';
import Task from '../Task/Task';
import TaskInput from '../TaskInput/TaskInput';
import './TaskList.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { MdDelete } from 'react-icons/md';
import { deleteDoc, doc, getDocs } from 'firebase/firestore';

const TaskList = (props) => {
    const auth = getAuth();
    const [task, setTask] = useState(null);
    // const [isTask, setIsTask] = useState(false);
    const [isTaskLoading, setTaskLoading] = useState(true);


    
    useEffect(() => {
        // const GetAllTask = async () => {
        //     const q = query(collection(db, 'Task'), where('tasklist_id', '==', props.taskList.id));
            
        //     onSnapshot(q, (querySnapshot) => {
        //         const list = [];
        //         querySnapshot.docs.map((doc) => (
        //             list.push({ id: doc.id, ...doc.data() })
        //         ));
        //         list.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1);
        //         console.log(list);
        //         setTask(Array.from(list));
        //         console.log(task);
        //     });
        //     setTaskLoading(false);
        //     setIsTask(true);
        // };
        const GetAllTask = async () => {
            const taskRef = collection(db, 'Task');

            const q= query(
                taskRef,
                where('tasklist_id', '==', props.taskList.id)
            );

            const querySnap = await getDocs(q);

            let task =[];

            querySnap.forEach((doc) => {
                return task.push({ id: doc.id, ...doc.data() });
            });

            setTask(task);
            console.log(task.sort((a, b) => a.createdOn > b.createdOn ? -1 : 1));
            setTaskLoading(false);
            // setIsTask(true);
        };
 
        // if (!isTask) 
        GetAllTask();
        console.log(task);
    }, [auth.currentUser.uid]);

    const onDelete = async (id) => {
        console.log(task);
        await deleteDoc(doc(db, 'TaskList', id));
        const updatedTask = task.filter((task) => task.id !== id);
        
        setTask(updatedTask);
    };

    console.log(task);
    

    return (
        <div className='tasklist__container'>
            {/* TODO: tasklist header */}
            <div className="tasklist__header">
                <div className='tasklist__header__name'>
                    <span>{props.taskList.tasklist_name}</span>
                    <Popup
                        trigger={
                            <div className="task__options">
                                <BsThreeDotsVertical />
                            </div>
                        }
                        position="right top"
                        on="click"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: '0px', border: 'none' }}
                        arrowStyle={{ color: '#3A3C45' }}
                        arrow={true}
                    >
                        <MenuOptions id = {props.taskList.id} onDelete={() => onDelete(props.taskList.id)} />
                    </Popup>
                </div>
            </div>

            {/* add task here */}
            <div className="tasklist__tasks">
                { isTaskLoading ? <Loader /> : <>
                    <TaskInput tasklist_id={props.taskList.id} />
                    {
                        task?.map((item, index) => {
                            return <div key={index}>
                                <Task task={item} />
                            </div>;
                        })
                    }
                </>}
            </div>

        </div>
    );
};

const MenuOptions = ({ onDelete}) => {
    // const DeleteTask = async (id) => {
    //     await deleteDoc(doc(db, 'TaskList', id));
    // };
    return (
        <div className="menu">
            <div className="menu-item"
                onClick={onDelete}
            > 
                <MdDelete className='menu-icon' />
                Delete 
            </div>
        </div>
    );
};

export default TaskList;