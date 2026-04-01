'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '@/src/components/Game1';
import { routerServerGlobal } from 'next/dist/server/lib/router-utils/router-server-context';

export default function Home() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');

        if (isLogin === 'true') {
            setAllowed(true);
        } else {
            router.replace('/auth/login?redirect=/home');
        }

        setIsChecked(true);
    }, [router]);

    if (!isChecked) return null;
    if (!allowed) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
            <h1 className="text-4xl font-bold mb-8 text-primary">Selamat Datang!</h1>
            <Game1 />
        </div>
    );
}