import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function Landing(){
    const navigate=useNavigate();
    return <div className="flex justify-center">
        <div className="pt-8 max-w-2xl ">
            <div className="grid grid-cols-1  md:grid-cols-2 gap-10">
                <div className="flex justify-center">
                    <img src={"../../../public/chessboard.jpeg"} className="rounded-lg max-w-96"/>
                </div>
                <div className="mt-10">
                    <div className="text-4xl font-bold mb-4 text-white flex justify-center">Play Chess Online</div>
                    <div className="flex justify-center ">
                        <Button onClick={()=>navigate("/game")} main="Play Online" low="Lets get started" color="#78ac4c"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}