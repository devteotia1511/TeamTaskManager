import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { taskAPI, projectAPI } from '../../services/api';

const CreateTask = () => {
  const { users, fetchTasks } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [category, setCategory] = useState('Development');
  const [priority, setPriority] = useState('medium');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await projectAPI.getAll();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProjects();
  }, []);

  const categories = ['Design', 'Development', 'Testing', 'Documentation', 'Meeting', 'Research', 'DevOps', 'QA', 'Support', 'Other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const taskData = {
        title,
        description,
        dueDate,
        assignedTo,
        project,
        category,
        priority,
      };

      const { data } = await taskAPI.create(taskData);

      if (data.success) {
        setMessage('Task created successfully!');
        // Refresh tasks list
        fetchTasks();
        // Clear form
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignedTo('');
        setProject('');
        setCategory('Development');
        setPriority('medium');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-5 bg-[#1c1c1c] mt-5 rounded'>
      <h2 className='text-xl font-bold mb-4 text-white'>Create New Task</h2>

      {message && (
        <div className={`mb-4 p-2 rounded text-sm ${message.includes('success') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={submitHandler} className='flex flex-wrap w-full items-start justify-between'>
        <div className='w-1/2 pr-4'>
          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              type='text'
              placeholder='Enter task title'
              required
            />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Due Date</h3>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              type='date'
              required
            />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Assign to</h3>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              required
            >
              <option value='' className='bg-[#1c1c1c]'>Select Employee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id} className='bg-[#1c1c1c]'>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Project</h3>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              required
            >
              <option value='' className='bg-[#1c1c1c]'>Select Project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id} className='bg-[#1c1c1c]'>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className='bg-[#1c1c1c]'>{cat}</option>
                ))}
              </select>
            </div>

            <div className='flex-1'>
              <h3 className='text-sm text-gray-300 mb-0.5'>Priority</h3>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4 text-white'
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri} className='bg-[#1c1c1c]'>
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='w-1/2 flex flex-col items-start'>
          <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-gray-400 text-white'
            placeholder='Describe the task in detail...'
            required
          ></textarea>
          <button
            type='submit'
            disabled={isLoading}
            className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full disabled:opacity-50'
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;