import express from 'express'

const app = express();

app.use(express.json());

app.get("/test", (req, res)=>{
  return res.status(200).json({Message: "Server is working"});
})

const PORT = 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});