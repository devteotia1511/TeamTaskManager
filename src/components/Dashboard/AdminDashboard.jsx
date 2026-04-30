import React, { useEffect, useContext } from 'react';
import Header from '../other/Header';
import CreateTask from '../other/CreateTask';
import AllTask from '../other/AllTask';
import { AuthContext } from '../../context/AuthProvider';

const AdminDashboard = ({ onLogout }) => {
    const { fetchUsers, fetchTasks } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, [fetchUsers, fetchTasks]);

    return (
        <div className='h-screen w-full p-7 bg-[#1C1C1C]'>
            <Header onLogout={onLogout} />
            <CreateTask />
            <AllTask />
        </div>
    );
};

export default AdminDashboard;