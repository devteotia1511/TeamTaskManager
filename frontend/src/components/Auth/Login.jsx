import { useState } from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import Spline from '@splinetool/react-spline';
import PropTypes from 'prop-types';

const Login = ({ onLogin, onToggleSignup }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await onLogin(email, password)
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex h-screen w-screen bg-[#000000] text-white'>
            <div className='flex-1 flex items-center justify-center'>
                <Spline
                    scene="https://prod.spline.design/dfu0Yl11AJ-t70ae/scene.splinecode"
                />
            </div>

            <div className='flex-1 flex items-center justify-center bg-black h-screen'>
                <div className='border-2 rounded-xl border-emerald-600 p-10 w-[400px] shadow-lg'>
                    <h1 className='text-3xl font-extrabold text-center font-serif mb-4 tracking-wide'>
                        Team Task Manager
                    </h1>
                    <p className='text-center text-gray-400 mb-6'>Login to your account</p>

                    {error && (
                        <div className='mb-4 p-2 bg-red-600/20 border border-red-600 rounded text-red-400 text-sm text-center'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
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
                                className='bg-transparent outline-none w-full text-white placeholder:text-gray-400'
                                type='password'
                                placeholder='Enter password'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 text-white font-semibold bg-emerald-600 hover:bg-emerald-700 py-2 rounded-full w-full disabled:opacity-50'
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className='mt-6 text-center text-gray-400 text-sm'>
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={onToggleSignup}
                            className='text-emerald-400 hover:underline'
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onToggleSignup: PropTypes.func.isRequired,
}

export default Login