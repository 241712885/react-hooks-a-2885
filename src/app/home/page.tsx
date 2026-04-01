'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '@/src/components/Game1';

export default function Home() {
    const router = useRouter();
    // const [allowed, setAllowed] = useState(false);
    const [isLogin, setIsLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');

        if (isLogin === 'true') {
            setIsLogin(true);
        } else {
            setIsLogin(false);
            
            router.replace('/auth/not-authorized');
        }
    }, [router]);

    if (isLogin === null) return null;
    if (isLogin === false) return null;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Game1 />
        </div>
    );
}