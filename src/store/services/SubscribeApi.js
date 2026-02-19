
import { api } from "../api";

export const subscribeApi = api.injectEndpoints({   
    endpoints: (builder) => ({
        subscribeAgent: builder.mutation({
            query: () => ({ url: "/agents/subscribe", method: "POST" }),
        }),
    }),
});

export const { useSubscribeAgentMutation } = subscribeApi;      
