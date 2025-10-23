'use client';

import { redirect } from 'next/navigation';

// This page is now unified in the main AuthPage at the root.
// We redirect any user trying to access this old route.
export default function SignUpPage() {
    redirect('/');
}
