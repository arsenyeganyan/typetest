import { apiSlice } from '../../app/api/apiSlice';

interface Test {
    wordsPerMinute: number;
    accuracy: number;
    date: Date;  
}

export const statsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllTests: builder.query<Test[], string>({
            query: (userId) => `stats/get-all/${userId}`,
            transformResponse: (response: { tests: Test[] }) => response.tests,
        }),
        addTest: builder.mutation({
            query: credentials => ({
                url: 'stats/new',
                method: 'POST',
                body: { ...credentials },
            })
        }),
    })
})

export const {
    useGetAllTestsQuery,
    useAddTestMutation,
} = statsApiSlice;