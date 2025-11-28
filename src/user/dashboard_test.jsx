import { useState } from "react"; // อันดับแรกต้อง
import { Link } from "react-router-dom";
// เขียน func ต่อ 1 หน้า
export default function Dashboard(){
    const [number , setnumber] = useState(0)
    // [เรียกใช้ , set ค่า] set ตัวแปร แล้วส่งไป

    return (
        // return HTML ออกมา
        // root component
        <> 
            <div> hello kai </div>
            <table>
                <th>kai</th>
                <tr>
                    <td> kaiza </td>
                </tr>
            </table>
            <Link to="/kai"> to kai </Link>
        </>
    );
}