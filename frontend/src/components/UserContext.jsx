import { createContext, useEffect, useState } from "react";


export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("awesomeCaptainToken"));

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response = await fetch("http://localhost:8000/api/show_user/me", requestOptions);

            if (!response.ok) {
                setToken(null);
            }

                localStorage.setItem("awesomeCaptainToken", token);
        };
        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value = {[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
};

export const UserContext = createContext();
