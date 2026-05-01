import { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaUserTag } from 'react-icons/fa';
import Spline from '@splinetool/react-spline';
import PropTypes from 'prop-types';

const Signup = ({ onSignup, onToggleLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onSignup({ firstName, lastName, email, password, role });
            // Reset form on success
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setRole('member');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex h-screen w-screen bg-[#000000] text-white'>
            <div className='flex-1 flex items-center justify-center'>
                <Spline
                    scene="https://prod.spline.design/dfu0Yl11AJ-t70ae/scene.splinecode"
                />
            </div>

            <div className='flex-1 flex items-center justify-center bg-black h-screen'>
                <div className='border-2 rounded-xl border-emerald-600 p-10 w-[400px] shadow-lg'>
                    <h1 className='text-3xl font-extrabold text-center font-serif mb-8 tracking-wide'>
                        Team Task Manager
                    </h1>
                    <p className='text-center text-gray-400 mb-6'>Create your account</p>

                    {error && (
                        <div className='mb-4 p-2 bg-red-600/20 border border-red-600 rounded text-red-400 text-sm text-center'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                        <div className='flex gap-2'>
                            <div className='flex-1 flex items-center border-2 border-emerald-600 rounded-full px-4 py-2 bg-transparent'>
                                <FaUser className='text-emerald-400 mr-3' />
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className='bg-transparent outline-none w-full text-white placeholder:text-gray-400'
                                    type='text'
                                    placeholder='First Name'
                                />
                            </div>
                            <div className='flex-1 flex items-center border-2 border-emerald-600 rounded-full px-4 py-2 bg-transparent'>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className='bg-transparent outline-none w-full text-white placeholder:text-gray-400'
                                    type='text'
                                    placeholder='Last Name'
                                />
                            </div>
                        </div>

                        <div className='flex items-center border-2 border-emerald-600 rounded-full px-4 py-2 bg-transparent'>
                            <FaEnvelope className='text-emerald-400 mr-3' />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='bg-transparent outline-none w-full text-white placeholder:text-gray-400'
                                type='email'
                                placeholder='Enter your email'
                            />
                        </div>

                        <div className='flex items-center border-2 border-emerald-600 rounded-full px-4 py-2 bg-transparent'>
                            <FaLock className='text-emerald-400 mr-3' />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={3}
                                className='bg-transparent outline-none w-full text-white placeholder:text-gray-400'
                                type='password'
                                placeholder='Enter password (min 3 chars)'
                            />
                        </div>

                        <div className='flex items-center border-2 border-emerald-600 rounded-full px-4 py-2 bg-transparent'>
                            <FaUserTag className='text-emerald-400 mr-3' />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className='bg-transparent outline-none w-full text-white'
                            >
                                <option value='member' className='bg-black'>Member</option>
                                <option value='admin' className='bg-black'>Admin</option>
                            </select>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 text-white font-semibold bg-emerald-600 hover:bg-emerald-700 py-2 rounded-full w-full disabled:opacity-50'
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className='mt-6 text-center text-gray-400 text-sm'>
                        Already have an account?{' '}
                        <button
                            onClick={onToggleLogin}
                            className='text-emerald-400 hover:underline'
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

Signup.propTypes = {
    onSignup: PropTypes.func.isRequired,
    onToggleLogin: PropTypes.func.isRequired,
};

export default Signup;
