import { CredentialResponse } from '@react-oauth/google';
import { useCreateMutation } from '../apiClient';

export const useAuthenticate = () => {
    const [create] = useCreateMutation();

    const authenticate = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await create({
                path: '/auth/google',       
                body: { token: credentialResponse.credential },
            }).unwrap();

            const token = (res as { data: string }).data;
            localStorage.setItem('token', token);
        } catch (err) {
            throw err;
        }
    };

    return { authenticate };
}

