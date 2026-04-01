'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '@/src/components/Game1';

export default function Home() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const isLogin = localStorage.getItem('isLogin');

        if (isLogin === 'true') {
            setAllowed(true);
        } else {
            router.replace('/auth/not-authorized');
        }
    }, [router]);

    if (!allowed) return null;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Game1 />
        </div>
    );
}