import axios from "axios"

export const getCommentById = async (idProduct) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment/get/${idProduct}`)
    return res.data
}

export const addComment = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/comment/add`, data)
    return res.data
}