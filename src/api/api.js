const API = "https://ecommerce-backend-ep03.onrender.com"

export async function login(data){
 const res = await fetch(`${API}/auth/login`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify(data)
 })

 return res.json()
}

export async function register(data){
 const res = await fetch(`${API}/auth/register`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify(data)
 })

 return res.json()
}

export async function getProducts(){
 const res = await fetch(`${API}/products`)
 return res.json()
}

export async function addToCart(data,token){
 const res = await fetch(`${API}/cart`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   Authorization:`Bearer ${token}`
  },
  body:JSON.stringify(data)
 })

 return res.json()
}

export async function createOrder(userId,token){
 const res = await fetch(`${API}/orders`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   Authorization:`Bearer ${token}`
  },
  body:JSON.stringify({userId})
 })

 return res.json()
}

export async function getOrders(userId,token){
 const res = await fetch(`${API}/orders/${userId}`,{
  headers:{
   Authorization:`Bearer ${token}`
  }
 })

 return res.json()
}