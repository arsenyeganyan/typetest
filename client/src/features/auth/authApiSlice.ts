import { apiSlice } from '../../app/api/apiSlice';

interface AuthResponse {
    auth: boolean;
    userId?: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        checkAuth: builder.query<AuthResponse, void>({
            query: () => 'check-auth',
        }),
        login: builder.mutation({
            query: credentials => ({
                url: 'auth/login',
                method: 'POST',
                body: { ...credentials },
            })
        }),
        validate: builder.mutation({
            query: credentials => ({
                url: 'auth/validate',
                method: 'POST',
                body: { ...credentials },
            })
        }),
        signup: builder.mutation({
            query: credentials => ({
                url: 'auth/signup',
                method: 'POST',
                body: { ...credentials },
            })
        }),
        logout: builder.mutation({
            query: credentials => ({
                url: 'auth/logout',
                method: 'POST',
                body: { ...credentials },
            })
        }),
    })
})

export const {
    useCheckAuthQuery,
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useValidateMutation,
} = authApiSlice;