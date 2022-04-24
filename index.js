const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middelware
app.use(cors());
app.use(express.json());

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
app.post('/service',async(req, res)=>{
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

}
finally{

}
}
run().catch(console.dir)
app.get("/", (req, res) => {
  res.send("running geneus");
});

app.listen(port, () => {
  console.log("listen on port", port);
});
