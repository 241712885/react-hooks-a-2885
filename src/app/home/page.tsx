'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '@/src/components/Game1';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');

        if (isLogin) {
            router.push('/auth/not-authorized');
        }         
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
            <h1 className="text-4xl font-bold mb-8 text-primary">Selamat Datang!</h1>
            <Game1 />
        </div>
    );
}