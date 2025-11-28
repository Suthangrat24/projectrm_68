import { useState } from "react";
import { Link } from "react-router-dom";
export default function Dashboard() {
    const [number,setnumber] = useState(0)

    return (
        <>
        <div> hello jaa </div>
        <table>
            <th>h</th>
            <tr>
                <td>fkffhdjfhd</td>
            </tr>

        </table>
        <Link to="/muk">to muk</Link>
</>
    );
}
