import React from 'react';
import AcceptTask from './AcceptTask';
import NewTask from './NewTask';
import CompleteTask from './CompleteTask';
import FailedTask from './FailedTask';

const TaskList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className='h-[50%] flex items-center justify-center w-full mt-16 text-gray-400'>
                No tasks assigned yet
            </div>
        );
    }

    return (
        <div id='tasklist' className='h-[50%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1 mt-16'>
            {tasks.map((elem, idx) => {
                // Map API status to component
                if (elem.status === 'active') {
                    return <AcceptTask key={elem._id || idx} data={elem} />;
                }
                if (elem.status === 'new') {
                    return <NewTask key={elem._id || idx} data={elem} />;
                }
                if (elem.status === 'completed') {
                    return <CompleteTask key={elem._id || idx} data={elem} />;
                }
                if (elem.status === 'failed') {
                    return <FailedTask key={elem._id || idx} data={elem} />;
                }
                return null;
            })}
        </div>
    );
};

export default TaskList;