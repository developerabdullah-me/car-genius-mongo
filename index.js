const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middelware
app.use(cors());
app.use(express.json());
 
function verifyJWT(req, res, next) {
  const authHeader=req.headers.authorization
  if(!authHeader){
    return res.status(401).send({massage: 'unauthorized'});
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRETfunction,(err, decoded)=>{
    if(err){
      return res.status.send({massage:massage})
    }
    console.log(decoded);
    req.decoded=decoded;
  })
  console.log('inside verify jwt',authHeader);
  next();
}

// mongo collection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdz6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run (){
try{
await client.connect();
const ServiceCollection=client.db('car-geneus').collection('service')
const orderCollection=client.db('car-geneus').collection('order')
// auth
app.post('/login',async(req, res)=>{
  const user=req.body;

  const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:id
  })
  res.send({accessToken})
})
// multple collection
app.get('/service',async(req,res) => {
    const query={}
    const cursor=ServiceCollection.find(query)
    const services=await cursor.toArray()
    res.send(services)
  
})

app.get('/service/:id', async(req, res) => {
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const service = await ServiceCollection.findOne(query)
    res.send(service)
})
// post
app.post('/service',verifyJWT,async(req, res)=>{
const newServices=req.body;
const result=await ServiceCollection.insertOne(newServices)
res.send(result)
})
// delete 
app.delete('/service/:id',async(req, res)=>{
  const id = req.params.id;
  const require={_id:ObjectId(id)}
  const result=await ServiceCollection.deleteOne(require)
  res.send(result)
})
// orders 
app.get('/order',async(req, res)=>{
  const email = req.body.email;
  const query={email: email};
  const cursor=orderCollection.find(query);
  const result=cursor.toArray();
  res.send(result)

})

// post
app.post('/order',async(req, res)=>{
  const order=req.body;
  const result=await orderCollection.insertOne(order)
  res.send(result)
})

}
finally{

}
}
run().catch(console.dir)
app.get("/", (req, res) => {
  res.send("running genius");
});

app.listen(port, () => {
  console.log("listen on port", port);
});
