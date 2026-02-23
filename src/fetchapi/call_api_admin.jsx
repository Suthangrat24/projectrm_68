let api = "http://localhost:8000";
import axios from "axios";

export async function getdataUsers() {
  //   console.log(id_actionplan);
  try {
    // console.log("token : ", token);
    const response = await axios.get(
      `${api}/users`,
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

export async function getdataUser(user_id) {
  //   console.log(id_actionplan);
  try {
    // console.log("token : ", token);
    const response = await axios.get(
      `${api}/user/${user_id}`,
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

export async function createUser(userData) {
  try {
    const response = await axios.post(
      `${api}/add_user`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("create user success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
}

export async function updateUser(user_id, userData) {
  try {
    const response = await axios.put(
      `${api}/edit_user/${user_id}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("update user success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
}

export async function deleteUser(user_id) {
  try {
    const res = await axios.put(
      `${api}/delete_user/${user_id}`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Delete question error", err);
    throw err;
  }
}

export async function getAllQuestions() {
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

export async function addQuestion(questionData) {
  try {
    const response = await axios.post(
      `${api}/add_question`,
      questionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("add question success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add question error:", error);
    throw error;
  }
}

export async function editQuestion(question_id, questionData) {
  try {
    const response = await axios.put(
      `${api}/edit_question/${question_id}`,
      questionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("edit question success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit question error:", error);
    throw error;
  }
}

export async function deleteQuestion(question_id) {
  try {
    const res = await axios.put(
      `${api}/delete_question/${question_id}`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Delete question error", err);
    throw err;
  }
}