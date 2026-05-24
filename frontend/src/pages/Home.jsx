import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/")
            .then((res) => {
                console.log(res.data);
                setMessage(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <h1>Stock Trading Simulator</h1>
            <p>{message}</p>
        </div>
    );
};

export default Home;