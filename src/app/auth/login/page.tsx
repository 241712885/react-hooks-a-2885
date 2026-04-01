'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '@/src/components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi';
import "react-toastify/dist/ReactToastify.css";

interface LoginFormData {
    email: string;
    password: string;
    captchaInput: string;
    rememberMe?: boolean;
}

interface ErrorObject {
    email?: string;
    password?: string;
    captcha?: string;
}

const KEY_EMAIL = '2885@gmail.com';
const KEY_PASSWORD = '241712885';

const GenerateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        captchaInput: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState<ErrorObject>({});
    const [attempts, setAttempts] = useState(3); 
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState(() => GenerateCaptcha());

    useEffect(() => {
        setCaptcha(GenerateCaptcha());
    }, []);

    // useEffect(() => {
    //     if (searchParams.get('success') === '1') {
    //         toast.success('Register berhasil!', {
    //             theme: 'dark',
    //             position: 'top-right',
    //         });
    //     }
    // }, [searchParams]); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };
    
    const handleRefreshCaptcha = () => {
        setCaptcha(GenerateCaptcha());
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ErrorObject = {};
        if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
            else if (formData.email.trim() !== KEY_EMAIL) newErrors.email = 'Email harus sesuai dengan format npm kalian (cth. 2885@gmail.com)';
        if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
            else if (formData.password.trim() !== KEY_PASSWORD) newErrors.password = 'Password harus sesuai dengan format npm kalian (cth. 241712885)';
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha tidak valid';
        }

        if (Object.keys(newErrors).length > 0) {    
            setErrors(newErrors);
        
            const newAttempts = Math.max(attempts - 1, 0);
            setAttempts(newAttempts);
            
            if (newAttempts === 0) {
                toast.error('Kesempatan login habis!', {theme: 'dark', position: 'top-right'});
            } else {
                toast.error(`Login gagal! Sisa kesempatan: ${newAttempts}`, {theme: 'dark', position: 'top-right'});
            }

            return;
        }

        toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
        localStorage.setItem('isLogin', 'true');
        router.push('/home');
    };

    return (
        <AuthFormWrapper title="Login">
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
                <p className="text-center text-gray-700 font-semibold">
                    Sisa Kesempatan: {attempts}
                </p> 

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-500 text-sm italic mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    
                    {errors.password && (
                        <p className="text-red-600 text-sm italic mt-1">
                            {errors.password}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange} 
                                className="mr-2"
                            />
                            Ingat Saya
                        </label>
                        <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span>Captcha:</span>
                        <span className="bg-gray-100 px-3 py-1.5 font-bold rounded">{captcha}</span>

                        <button
                            type="button"
                            onClick={handleRefreshCaptcha}
                            className="text-blue-600"
                            >
                            <FiRefreshCw size={20} />
                        </button>
                    </div>

                    <input
                        name="captchaInput"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border`} 
                        placeholder="Masukkan captcha"
                    />
                    {errors.captcha && <p className="text-red-500 text-sm italic mt-1">{errors.captcha}</p>}
                </div>             

                <button
                    type="submit"
                    disabled={attempts === 0}
                    className={`w-full font-semibold py-2.5 px-4 rounded-lg ${attempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    Sign In
                </button>

                <button
                    type="button"
                    disabled={attempts !== 0}
                    onClick={() => {
                        setAttempts(3);
                        toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
                    }}
                    className={`w-full font-semibold py-2.5 px-4 rounded-lg ${attempts === 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}                
                >
                    Reset Kesempatan
                </button>                

                <SocialAuth />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Tidak punya akun?{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Daftar
                    </Link>
                </p>
            </form>
        </AuthFormWrapper>
    );
}

export default LoginPage;