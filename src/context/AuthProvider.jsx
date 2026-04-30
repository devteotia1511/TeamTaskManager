import React, { createContext, useEffect, useState } from 'react';
import { userAPI, taskAPI } from '../services/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Fetch all users (for admin)
    const fetchUsers = async () => {
        try {
            const { data } = await userAPI.getAll();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            if (user?.role === 'admin') {
                const { data } = await taskAPI.getAll();
                if (data.success) {
                    setTasks(data.tasks);
                }
            } else {
                const { data } = await taskAPI.getMyTasks();
                if (data.success) {
                    setTasks(data.tasks);
                }
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    // Login user
    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setUsers([]);
        setTasks([]);
    };

    const value = {
        user,
        users,
        tasks,
        loading,
        login,
        logout,
        fetchUsers,
        fetchTasks,
        setTasks,
        setUsers,
        isAdmin: user?.role === 'admin',
        isMember: user?.role === 'member'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;