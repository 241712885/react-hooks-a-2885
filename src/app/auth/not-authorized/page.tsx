'use client';

import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function NotAuthorized() {
    const router = useRouter();
    // const searchParams = useSearchParams();

    // const redirect = searchParams.get("redirect") || "/home";

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-[360px]">

                <FiX className="text-red-500 text-3xl mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Anda belum login</h2>
                <p className="text-gray-500 mb-4">Silakan login terlebih dahulu</p>

                <button
                    onClick={() => router.push(`/auth/login`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    ← Kembali
                </button>
            </div>
        </div>
    );
}