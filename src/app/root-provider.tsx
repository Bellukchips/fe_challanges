import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
export default async function RootProvider({children}: Readonly<PropsWithChildren>){
    return (
        <>
            <div className='__root'>{children}</div>
            <Toaster />
        </>
    );
}