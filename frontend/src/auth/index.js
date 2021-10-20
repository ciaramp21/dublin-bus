import {createAuthProvider} from "react-token-auth";

export const [useAuth, authFetch, login, logout] = createAuthProvider({
    accessTokenKey: "access",
    onUpdateToken: (token) => fetch(process.env.REACT_APP_API_URL + "/user/token/refresh", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: token.refresh
            }),
        })
        .then(r => {
            return new Promise((resolve) => {
               r.json().then(data => {
                   resolve({
                       refresh: token.refresh,
                       access: data.access
                   })
               })
            })
        })
});