"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    useVerifyStripeMutation
} from '@/store/services/SubscribeApi';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const { refetch } = useAuth();

    const [verifyStripe] =
        useVerifyStripeMutation();
    useEffect(() => {
        verify();
    }, []);
    const verify = async () => {
        const session_id =
            params.get('session_id');
        if (!session_id) return;
        try {
            const res =
                await verifyStripe(
                    session_id
                ).unwrap();
            if (res.success) {
                toast.success(
                    'Payment Successful'
                );
                await refetch();
                router.push(
                    `/agents/${res.agentProfileId}/dashboard`
                );
            }
        }
        catch {

            toast.error(
                'Verification Failed'
            );
        }
    };
    return (
        <div className='min-h-screen flex items-center justify-center'>
            Verifying Payment...
        </div>
    )
}
