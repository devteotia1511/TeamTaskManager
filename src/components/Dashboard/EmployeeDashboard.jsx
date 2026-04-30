import React, { useEffect, useContext } from 'react';
import Header from '../other/Header';
import TaskListNumbers from '../other/TaskListNumbers';
import TaskList from '../TaskList/TaskList';
import { AuthContext } from '../../context/AuthProvider';

const EmployeeDashboard = ({ onLogout }) => {
    const { fetchTasks, tasks } = useContext(AuthContext);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className='p-10 bg-[#1C1C1C] h-screen'>
            <Header onLogout={onLogout} />
            <TaskListNumbers />
            <TaskList tasks={tasks} />
        </div>
    );
};

export default EmployeeDashboard;