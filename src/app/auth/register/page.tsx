'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi';


type RegisterFormData = {
    username: string;
    email: string;
    nomorTelp: string;
    password: string;
    confirmPassword: string;
    captcha: string;
};

const GenerateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }, setValue } = 
        useForm<RegisterFormData>({
            mode: 'onChange',
        });
    const [captcha, setCaptcha] = useState('');
    const [captchaError, setCaptchaError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [strength, setStrength] = useState(0);

    const password = watch('password', '');

    useEffect(() => {
        setCaptcha(GenerateCaptcha());
    }, []);

    useEffect(() => {
        const score = Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
        );
        setStrength(score);
    }, [password]);    

    const handleRefreshCaptcha = () => {
        setCaptcha(GenerateCaptcha());
        setCaptchaError(false);
        setValue('captcha', '');
    };

    const onSubmit = (data: RegisterFormData) => {       
        if (data.captcha !== captcha) {
            setCaptchaError(true);
            handleRefreshCaptcha();
            toast.error('Harus sesuai dengan captcha yang ditampilkan!', { theme: 'dark', position: 'top-right' });
            return;
        }  

        setCaptchaError(false);

        router.push('/auth/login?success=1');
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Username <span className="text-xs">(max 8 karakter)</span>
                    </label>
                    <input
                        {...register('username', { required: 'Username wajib diisi', minLength: { value: 3, message: 'Username minimal 3 karakter' }, maxLength: { value: 8, message: 'Username maksimal 8 karakter' } })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan username"
                    />
                    {errors.username && <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        {...register('email', { required: 'Email wajib diisi', pattern: { value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/, message: 'Format Email tidak valid' } })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        {...register('nomorTelp', { required: 'Nomor telepon wajib diisi', minLength: { value: 10, message: 'Nomor telepon minimal 10 digit' },
                        pattern: { value: /^[0-9]+$/, message: 'Hanya boleh berisi angka' } })}
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nomor telepon"
                    />
                    {errors.nomorTelp && <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            {...register('password', { required: 'Password wajib diisi', minLength: { value: 8, message: 'Minimal 8 karakter' } })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 flex top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-600 text-sm">
                            {errors.password.message}
                        </p>
                    )}

                    {password && (
                        <>
                            <div className="h-2 mt-1 rounded bg-gray-200">
                                <div
                                    className={`h-2 rounded ${strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-yellow-500' : strength < 75 ? 'bg-blue-500' : 'bg-green-500'}`}
                                    style={{ width: `${strength}%` }}
                                />
                            </div>
                            <p className="text-sm mt-1 text-gray-600">
                                Strength: <span className="font">{strength}%</span>
                            </p>
                        </>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            autoComplete="new-password"
                            {...register('confirmPassword', { required: 'Konfirmasi password wajib diisi', validate: value => value === password || 'Password tidak cocok' })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan ulang password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm italic mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold bg-gray-100 px-3 py-1 rounded">{captcha}</span>

                        <button
                            type="button"
                            onClick={handleRefreshCaptcha}
                        >
                            <FiRefreshCw />
                        </button>
                    </div>
                    
                    <input
                        {...register('captcha', { required: 'Captcha wajib diisi' })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                            captchaError
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : errors.captcha
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        placeholder="Masukkan captcha"
                    />
                    {errors.captcha && <p className="text-red-500 text-sm italic mt-1">{errors.captcha.message}</p>}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
                    Register
                </button>

                <SocialAuth />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '} <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
                </p>
            </form>
        </AuthFromWrapper>
    );
};

export default RegisterPage;