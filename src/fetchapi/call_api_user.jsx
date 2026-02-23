// let api = "http://127.0.0.1:8000";
let api = "http://localhost:8000";
import axios from "axios";

export async function GetLogin(email, password) {
    try {
        const response = await axios.post(
            `${api}/login`, // ใช้ URL ของ API
            { email, password }, // ส่ง email และ password ใน request body
            {
                headers: {
                    "Content-Type": "application/json", // กำหนด Content-Type ให้เป็น JSON
                },
            }
        );

        console.log("data : ", response.data); // แสดงข้อมูลที่ได้รับจาก API

        return response.data; // ส่งข้อมูลที่ได้รับจาก API กลับไป
    } catch (error) {
        console.error("Error fetching user data:", error); // แสดงข้อผิดพลาดถ้ามี
        throw error; // ส่งข้อผิดพลาดออกไปให้ฟังก์ชันที่เรียกใช้จัดการ
    }
}

export async function getdataProducts() {
  //   console.log(id_actionplan);
  try {
    // console.log("token : ", token);
    const response = await axios.get(
      `${api}/users`,
    //   { id_year },
      {
        headers: {
        //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const json = await response.json();
    console.log("data : ", response);
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}

export async function adddataProducts(token,id_year) {
  //   console.log(id_actionplan);
  try {
    // console.log("token : ", token);
    const response = await axios.post(
      `${api}/products`,
      { id_year },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const json = await response.json();
    console.log("data : ", response);
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}

export async function getStocks() {
  try {
    const response = await axios.get(
      `${api}/stocks`,   
      {
        headers: {
        //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("data : ", response);
    return response;
  } catch (err) {
    console.error("Get stocks error:", err);
    throw err;
  }
}

export async function getStock(symbol) {
  try {
    const response = await axios.get(
      `${api}/stock/${symbol}`,   
      {
        headers: {
        //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("data : ", response);
    return response;
  } catch (err) {
    console.error("Get stocks error:", err);
    throw err;
  }
}

export async function getStockLatest(symbol) {
  const response = await axios.get(
    `${api}/stock/price/latest`,
    {
      params: { symbol }
    }
  );
  return response.data;
}

export async function getStockHistory({ symbol, period, interval }) {
  const response = await axios.get(
    `${api}/stock/price/history`,
    {
      params: {
        symbol,
        period,
        interval,
      },
    }
  );
  return response.data;
}

export async function getStockSummary({ symbol }) {
  const response = await axios.get(
    `${api}/stock/price/summary`,
    {
      params: {
        symbol,
      },
    }
  );
  return response.data;
}

export async function getStockHistoryPerDay(symbol, days = 30) {
  try {
    const response = await axios.get(
      `${api}/stock/price/history/perday`,
      {
        params: {
          symbol,
          days,
        },
      }
    );

    console.log("history per day:", response.data);
    return response.data;

  } catch (err) {
    console.error("Get stock history (per day) error:", err);
    throw err;
  }
}

export async function getQuestions() {
  try {
    const response = await axios.get(
      `${api}/questions`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("questions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get questions error:", error);
    throw error;
  }
}

export async function getUserById(user_id) {
  try {
    const response = await axios.get(
      `${api}/user/${user_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
}

export async function updateUser(user_id, payload) {
  try {
    const response = await axios.put(
      `${api}/edit_user/${user_id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("updated user:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
}

// เช็คสถานะ
export async function checkFavorite(token, user_id, stock_id) {
  try {
    const response = await axios.get(
      `${api}/favorite/check/${user_id}/${stock_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Check favorite error:", error);
    throw error;
  }
}

// เพิ่ม
export async function addFavorite(token, user_id, stock_id) {
  try {
    const response = await axios.post(
      `${api}/add_favorite`,
      {
        user_id,
        stock_id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("favorite added:", response.data);
    return response.data;

  } catch (error) {
    console.error("Add favorite error:", error);
    throw error;
  }
}

// ลบ
export async function deleteFavorite(token, favorite_id) {
  try {
    const response = await axios.put(
      `${api}/delete_favorite/${favorite_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("favorite removed:", response.data);
    return response.data;

  } catch (error) {
    console.error("Delete favorite error:", error);
    throw error;
  }
}