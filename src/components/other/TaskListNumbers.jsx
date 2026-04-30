import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const TaskListNumbers = () => {
    const { user, tasks } = useContext(AuthContext);

    // Calculate stats from tasks array
    const stats = {
        newTask: tasks.filter(t => t.status === 'new').length,
        active: tasks.filter(t => t.status === 'active').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        failed: tasks.filter(t => t.status === 'failed').length,
    };

    // Use user's taskCounts from context or calculated stats
    const taskCounts = user?.taskCounts || stats;

    return (
        <div className='flex mt-10 justify-between gap-5 screen'>
            <div className='rounded-xl w-[45%] py-6 px-9 bg-blue-400'>
                <h2 className='text-3xl font-bold'>{taskCounts.newTask || 0}</h2>
                <h3 className='text-xl mt-0.5 font-medium'>New Task</h3>
            </div>
            <div className='rounded-xl w-[45%] py-6 px-9 bg-green-400'>
                <h2 className='text-3xl font-bold'>{taskCounts.completed || 0}</h2>
                <h3 className='text-xl mt-0.5 font-medium'>Completed Task</h3>
            </div>
            <div className='rounded-xl w-[45%] py-6 px-9 bg-yellow-400 '>
                <h2 className='text-3xl text-black font-bold'>{taskCounts.active || 0}</h2>
                <h3 className='text-xl mt-0.5 text-black font-medium'>Accepted Task</h3>
            </div>
            <div className='rounded-xl w-[45%] py-6 px-9 bg-red-400'>
                <h2 className='text-3xl font-bold'>{taskCounts.failed || 0}</h2>
                <h3 className='text-xl mt-0.5 font-medium'>Failed Task</h3>
            </div>
        </div>
    );
};

export default TaskListNumbers;