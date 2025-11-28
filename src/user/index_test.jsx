import { useState } from "react"; // อันดับแรกต้อง
// เขียน func ต่อ 1 หน้า
export default function Index() {
    const [number, setnumber] = useState(0)
    // [เรียกใช้ , set ค่า] set ตัวแปร แล้วส่งไป

    return (
        // return HTML ออกมา
        // root component
        <>
            <div> hello kai </div>
            <div> number {number} </div>
            <button onClick={() => {
                setnumber(number + 1)
            }} className="bg-amber-300 p-4 rounded-xl"> click Add </button>
            <div className="grid grid-cols-12 gap6">
                <div className="col-span-12 md:col-span-4 xl:col-span-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, natus!</div>
                <div className="col-span-12 md:col-span-4 xl:col-span-6">Eligendi natus sint magnam, a consequuntur tempore dolores atque repudiandae!</div>
                <div className="col-span-12 md:col-span-4 xl:col-span-6">Alias cumque iusto reiciendis, recusandae deserunt temporibus expedita itaque natus!</div>
            </div>
        </>
    );
}